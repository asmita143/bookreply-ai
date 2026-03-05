import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { cn } from "../lib/utils";

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
      topRight={<div className="text-[#536173] font-semibold text-[13px]">{formatDisplayDate(titleDate)}</div>}
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <h1 className="m-0 text-[22px]">Reservations</h1>
        <div className="flex gap-2.5">
          <button className="rounded-[10px] border border-[#2a62d2] bg-[#2f6fed] text-white py-2 px-3 font-bold text-[13px] cursor-pointer">
            + Add Reservation
          </button>
          <button className="rounded-[10px] border border-[#d7deea] bg-white py-2 px-3 font-bold text-[13px] cursor-pointer">
            View All
          </button>
        </div>
      </div>

      <div
        className="flex gap-2.5 p-2.5 bg-white border border-[#e6ebf2] rounded-xl overflow-x-auto"
        aria-label="Time slots"
      >
        {slots.map((t) => (
          <button
            key={t}
            className={cn(
              "min-w-19.5 border rounded-[10px] py-2 px-2.5 text-left cursor-pointer",
              selected?.time === t
                ? "bg-[#fff3c4] border-[#ead78b]"
                : "border-[#e6ebf2] bg-[#f8fafc]"
            )}
            onClick={() => setSelectedId(data.find((r) => r.time === t)?.id ?? null)}
          >
            <div className="font-extrabold text-[13px]">{t}</div>
            <div className="text-[11px] text-[#6b7a90] mt-0.5">Fully Booked</div>
          </button>
        ))}
      </div>

      {loading && <div className="my-2.5 text-[#6b7a90] font-semibold">Loading…</div>}
      {error && (
        <div className="my-2.5 text-[#6b7a90] font-semibold" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3.5 mt-3">
        <section className="bg-white border border-[#e6ebf2] rounded-xl overflow-hidden">
          <div className="py-3 px-3.5 border-b border-[#eef2f7] bg-[#fbfcfe]">
            <div className="font-extrabold">{formatDisplayDate(titleDate)}</div>
          </div>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="text-left py-2.5 px-3 text-[#5a6a81] font-extrabold bg-[#f3f6fb] border-b border-[#e6ebf2]">
                  Time
                </th>
                <th className="text-left py-2.5 px-3 text-[#5a6a81] font-extrabold bg-[#f3f6fb] border-b border-[#e6ebf2]">
                  Size
                </th>
                <th className="text-left py-2.5 px-3 text-[#5a6a81] font-extrabold bg-[#f3f6fb] border-b border-[#e6ebf2]">
                  Name
                </th>
                <th className="text-left py-2.5 px-3 text-[#5a6a81] font-extrabold bg-[#f3f6fb] border-b border-[#e6ebf2]">
                  Customer Requests
                </th>
                <th className="text-left py-2.5 px-3 text-[#5a6a81] font-extrabold bg-[#f3f6fb] border-b border-[#e6ebf2]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr
                  key={r.id}
                  className={cn(
                    "cursor-pointer",
                    selected?.id === r.id ? "bg-[#f7fbff]" : ""
                  )}
                  onClick={() => setSelectedId(r.id)}
                >
                  <td className="py-2.5 px-3 border-b border-[#eef2f7]">{r.time}</td>
                  <td className="py-2.5 px-3 border-b border-[#eef2f7]">{r.partySize}</td>
                  <td className="py-2.5 px-3 border-b border-[#eef2f7]">{r.name}</td>
                  <td className="py-2.5 px-3 border-b border-[#eef2f7]">{r.customerRequests ?? ""}</td>
                  <td className="py-2.5 px-3 border-b border-[#eef2f7]">
                    <span className="inline-flex py-1 px-2.5 rounded-full bg-[#d6f0dd] text-[#1d6b2f] font-extrabold text-xs">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="bg-white border border-[#e6ebf2] rounded-xl overflow-hidden">
          <div className="py-3 px-3.5 border-b border-[#eef2f7] bg-[#fbfcfe]" />
          <div className="p-3 px-3.5 bg-[#fff6d8] border-t border-[#f1e2a8]">
            <div className="grid grid-cols-[120px_1fr] gap-2.5 py-2 border-b border-amber-900/20">
              <div className="font-extrabold text-[#6b4d15]">Date:</div>
              <div className="text-[#3b2a0b] font-semibold">{selected ? formatDisplayDate(selected.date) : "-"}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2.5 py-2 border-b border-amber-900/20">
              <div className="font-extrabold text-[#6b4d15]">Time:</div>
              <div className="text-[#3b2a0b] font-semibold">{selected?.time ?? "-"}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2.5 py-2 border-b border-amber-900/20">
              <div className="font-extrabold text-[#6b4d15]">Party Size:</div>
              <div className="text-[#3b2a0b] font-semibold">{selected ? `${selected.partySize} people` : "-"}</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2.5 py-2 border-b border-amber-900/20">
              <div className="font-extrabold text-[#6b4d15]">Availability:</div>
              <div className="text-[#3b2a0b] font-semibold">Fully Booked</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2.5 py-2">
              <div className="font-extrabold text-[#6b4d15]">Response Tone:</div>
              <div className="text-[#3b2a0b] font-semibold">Formal Response</div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
