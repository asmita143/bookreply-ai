import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import "./reservationsDashboard.css";

type Reservation = {
  id: string;
  date: string;
  time: string;
  partySize: number;
  name: string;
  customerRequests?: string;
  status: string;
};

function formatDisplayDate(date: string) {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(date)) return date;
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function ReservationsDashboard() {
  const [data, setData] = React.useState<Reservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/bookings.json");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void fetchData();
    return () => { cancelled = true; };
  }, []);

  const selected = data.find((r) => r.id === selectedId) ?? data[0] ?? null;
  React.useEffect(() => {
    if (!selectedId && data[0]?.id) setSelectedId(data[0].id);
  }, [data, selectedId]);

  const titleDate = selected?.date ?? data[0]?.date ?? "";
  const slots = Array.from(new Set(data.map((r) => r.time)));

  return (
    <DashboardLayout
      navItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "reservations", label: "Reservations" },
        { key: "emails", label: "Emails" },
        { key: "analytics", label: "Analytics" },
        { key: "settings", label: "Settings" },
      ]}
      topRight={<div className="rx__topDate">{formatDisplayDate(titleDate)}</div>}
    >
      {/* Full Reservations Dashboard content goes here */}
      <div className="rx__pageHeader">
        <h1 className="rx__h1">Reservations</h1>
        <div className="rx__pageActions">
          <button className="rx__primaryButton">+ Add Reservation</button>
          <button className="rx__button">View All</button>
        </div>
      </div>

      <div className="rx__chips" aria-label="Time slots">
        {slots.map((t) => (
          <button
            key={t}
            className={`rx__chip ${selected?.time === t ? "rx__chip--active" : ""}`}
            onClick={() => setSelectedId(data.find((r) => r.time === t)?.id ?? null)}
          >
            <div className="rx__chipTime">{t}</div>
            <div className="rx__chipSub">Fully Booked</div>
          </button>
        ))}
      </div>

      {loading && <div className="rx__state">Loading…</div>}
      {error && <div className="rx__state" role="alert">{error}</div>}

      <div className="rx__grid">
        {/* Table panel */}
        <section className="rx__panel">
          <div className="rx__panelHeader">
            <div className="rx__panelTitle">{formatDisplayDate(titleDate)}</div>
          </div>
          <table className="rx__table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Size</th>
                <th>Name</th>
                <th>Customer Requests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr
                  key={r.id}
                  className={selected?.id === r.id ? "rx__row rx__row--active" : "rx__row"}
                  onClick={() => setSelectedId(r.id)}
                >
                  <td>{r.time}</td>
                  <td>{r.partySize}</td>
                  <td>{r.name}</td>
                  <td>{r.customerRequests ?? ""}</td>
                  <td><span className="rx__status">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </section>

        {/* Side panel */}
        <aside className="rx__panel rx__panel--side">
          <div className="rx__panelHeader">
           
          </div>
          <div className="rx__context">
            <div className="rx__contextRow">
              <div className="rx__contextKey">Date:</div>
              <div className="rx__contextVal">{selected ? formatDisplayDate(selected.date) : "-"}</div>
            </div>
            <div className="rx__contextRow">
              <div className="rx__contextKey">Time:</div>
              <div className="rx__contextVal">{selected?.time ?? "-"}</div>
            </div>
            <div className="rx__contextRow">
              <div className="rx__contextKey">Party Size:</div>
              <div className="rx__contextVal">{selected ? `${selected.partySize} people` : "-"}</div>
            </div>
            <div className="rx__contextRow">
              <div className="rx__contextKey">Availability:</div>
              <div className="rx__contextVal">Fully Booked</div>
            </div>
            <div className="rx__contextRow">
              <div className="rx__contextKey">Response Tone:</div>
              <div className="rx__contextVal">Formal Response</div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
