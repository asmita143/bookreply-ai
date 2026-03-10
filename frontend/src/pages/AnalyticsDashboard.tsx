import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useEmails, type Email } from "../hooks/useEmails";
import { cn } from "../lib/utils";

type Booking = {
  id: string;
  date: string;
  time: string;
  party_size: number;
  customer_name?: string;
  status?: string;
};

type StaffSummary = {
  date: string;
  totalGuests: number;
  totalBookings: number;
  staffNeeded: number;
};

type IntentSummary = {
  intent: string;
  count: number;
};

function groupEmailsByDay(emails: Email[]) {
  const byDay = new Map<string, Email[]>();

  emails.forEach((email) => {
    const dateKey = new Date(email.received_at).toISOString().slice(0, 10);
    const list = byDay.get(dateKey) ?? [];
    list.push(email);
    byDay.set(dateKey, list);
  });

  return Array.from(byDay.entries())
    .map(([date, items]) => ({ date, count: items.length }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

function summarizeIntents(emails: Email[]): IntentSummary[] {
  const counts: Record<string, number> = {};

  emails.forEach((email) => {
    const key = email.intent || "other";
    counts[key] = (counts[key] ?? 0) + 1;
  });

  return Object.entries(counts)
    .map(([intent, count]) => ({ intent, count }))
    .sort((a, b) => b.count - a.count);
}

function summarizeStaff(bookings: Booking[]): StaffSummary[] {
  const byDate: Record<string, { totalGuests: number; totalBookings: number }> = {};

  bookings.forEach((b) => {
    if (!b.date) return;
    const partySize = typeof b.party_size === "number" ? b.party_size : 0;
    if (!byDate[b.date]) {
      byDate[b.date] = { totalGuests: 0, totalBookings: 0 };
    }
    byDate[b.date].totalGuests += partySize;
    byDate[b.date].totalBookings += 1;
  });

  return Object.entries(byDate)
    .map(([date, value]) => ({
      date,
      totalGuests: value.totalGuests,
      totalBookings: value.totalBookings,
      // Always schedule at least 1 staff per day,
      // even for very small guest counts.
      staffNeeded: Math.max(1, value.totalGuests > 0 ? Math.ceil(value.totalGuests / 15) : 1),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function AnalyticsDashboard() {
  const { emails, loading: emailsLoading, error: emailsError } = useEmails();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = React.useState(true);
  const [bookingsError, setBookingsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchBookings() {
      try {
        setBookingsLoading(true);
        setBookingsError(null);
        const res = await fetch("/bookings/all");
        if (!res.ok) {
          throw new Error(`Failed to fetch bookings (${res.status})`);
        }
        const json = (await res.json()) as Booking[];
        if (!cancelled) {
          setBookings(json);
        }
      } catch (e) {
        if (!cancelled) {
          setBookingsError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setBookingsLoading(false);
        }
      }
    }

    void fetchBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  const emailCount = emails.length;
  const bookingIntents = emails.filter((e) => e.intent === "booking").length;
  const emailDays = groupEmailsByDay(emails);
  const intentSummary = summarizeIntents(emails);
  const staffSummary = summarizeStaff(bookings);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayEmails = emailDays.find((d) => d.date === todayKey)?.count ?? 0;
  const todayStaff = staffSummary.find((s) => s.date === todayKey);
  const todayStaffCount = todayStaff?.staffNeeded ?? 1;

  const maxEmailsPerDay = emailDays.reduce((max, d) => Math.max(max, d.count), 0) || 1;
  const maxStaff = staffSummary.reduce((max, d) => Math.max(max, d.staffNeeded), 0) || 1;

  return (
    <DashboardLayout
      navItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "reservations", label: "Reservations" },
        { key: "emails", label: "Emails" },
        { key: "analytics", label: "Analytics" },
        { key: "settings", label: "Settings" },
      ]}
      activeNavKey="analytics"
      topRight={
        <div className="flex items-center gap-2">
          <span className="py-1.5 px-2.5 rounded-full bg-[#f0f3f8] text-[#2b3a4d]">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[22px]">Analytics Overview</h1>
            <p className="m-0 text-[13px] text-[#6b7a90]">
              Live view of emails, reservations, and staffing needs.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-[#2f6fed] text-white p-4 shadow-sm">
            <div className="text-xs font-semibold opacity-80">Emails Today</div>
            <div className="mt-1 text-3xl font-extrabold leading-tight">{todayEmails}</div>
            <div className="mt-3 text-[11px] opacity-80">
              Total emails stored: <span className="font-semibold">{emailCount}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#e3e8f3] shadow-sm">
            <div className="text-xs font-semibold text-[#6b7a90]">Booking Intent Emails</div>
            <div className="mt-1 text-3xl font-extrabold text-[#1b2430] leading-tight">
              {bookingIntents}
            </div>
            <div className="mt-3 text-[11px] text-[#7b879b]">
              Emails classified as <span className="font-semibold">reservation-related</span>.
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#e3e8f3] shadow-sm">
            <div className="text-xs font-semibold text-[#6b7a90]">Guests Today</div>
            <div className="mt-1 text-3xl font-extrabold text-[#1b2430] leading-tight">
              {todayStaff?.totalGuests ?? 0}
            </div>
            <div className="mt-3 text-[11px] text-[#7b879b]">
              Across all bookings recorded for today.
            </div>
          </div>

          <div className="rounded-2xl bg-[#111827] text-white p-4 shadow-sm">
            <div className="text-xs font-semibold opacity-80">Staff Needed Today</div>
            <div className="mt-1 text-3xl font-extrabold leading-tight">
              {todayStaffCount}
            </div>
            <div className="mt-3 text-[11px] opacity-80">
              Based on <span className="font-semibold">1 staff / 15 guests</span>.
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="rounded-2xl bg-white border border-[#e3e8f3] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="m-0 text-[15px] font-extrabold text-[#1b2430]">
                Email Volume by Day
              </h2>
              {(emailsLoading || bookingsLoading) && (
                <span className="text-[11px] text-[#7b879b]">Syncing data…</span>
              )}
            </div>
            {emailsError && (
              <div className="mb-2 text-[12px] text-red-500">Emails: {emailsError}</div>
            )}
            {emailDays.length === 0 ? (
              <p className="mt-2 text-[13px] text-[#7b879b]">No email data available yet.</p>
            ) : (
              <div className="space-y-1.5 mt-2">
                {emailDays.map((day) => {
                  const ratio = day.count / maxEmailsPerDay;
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <div className="w-24 text-[12px] text-[#6b7a90]">
                        {new Date(day.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex-1 h-2.5 rounded-full bg-[#eef2fb] overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-linear-to-r from-[#2f6fed] to-[#7b5cff] transition-[width]",
                          )}
                          style={{ width: `${Math.max(8, ratio * 100)}%` }}
                        />
                      </div>
                      <div className="w-8 text-right text-[12px] font-semibold text-[#1b2430]">
                        {day.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[#e3e8f3] p-4 shadow-sm">
            <h2 className="m-0 text-[15px] font-extrabold text-[#1b2430] mb-2">
              Email Intent Mix
            </h2>
            <p className="m-0 mb-2 text-[12px] text-[#7b879b]">
              How customers are reaching out: bookings, menu questions, cancellations, and more.
            </p>
            {intentSummary.length === 0 ? (
              <p className="mt-2 text-[13px] text-[#7b879b]">No email data available yet.</p>
            ) : (
              <div className="space-y-1.5">
                {intentSummary.map((item) => {
                  const ratio = emailCount ? item.count / emailCount : 0;
                  return (
                    <div
                      key={item.intent}
                      className="flex items-center justify-between gap-2 text-[13px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2f6fed]/70" />
                        <span className="capitalize text-[#1b2430]">
                          {item.intent.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-[#eef2fb] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#2f6fed]"
                            style={{ width: `${ratio * 100}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-[12px] font-semibold text-[#1b2430]">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-[#e3e8f3] p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="m-0 text-[15px] font-extrabold text-[#1b2430]">
              Reservations & Staffing by Day
            </h2>
            {bookingsError && (
              <span className="text-[12px] text-red-500">Bookings: {bookingsError}</span>
            )}
          </div>

          {staffSummary.length === 0 ? (
            <p className="mt-2 text-[13px] text-[#7b879b]">
              No bookings recorded yet. As bookings are created, we’ll estimate staffing needs
              (1 staff per 15 guests).
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-[13px] min-w-[480px]">
                <thead>
                  <tr className="bg-[#f3f6fb] text-[#5a6a81]">
                    <th className="text-left py-2.5 px-3 font-extrabold border-b border-[#e6ebf2]">
                      Date
                    </th>
                    <th className="text-left py-2.5 px-3 font-extrabold border-b border-[#e6ebf2]">
                      Bookings
                    </th>
                    <th className="text-left py-2.5 px-3 font-extrabold border-b border-[#e6ebf2]">
                      Guests
                    </th>
                    <th className="text-left py-2.5 px-3 font-extrabold border-b border-[#e6ebf2]">
                      Staff Needed
                    </th>
                    <th className="text-left py-2.5 px-3 font-extrabold border-b border-[#e6ebf2]">
                      Load
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffSummary.map((row) => {
                    const ratio = row.staffNeeded / maxStaff;
                    const isToday = row.date === todayKey;
                    return (
                      <tr
                        key={row.date}
                        className={cn(
                          "border-b border-[#eef2f7]",
                          isToday ? "bg-[#f7fbff]" : "bg-white",
                        )}
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#1b2430]">
                            {new Date(row.date).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-[11px] text-[#7b879b]">{row.date}</div>
                        </td>
                        <td className="py-2.5 px-3">{row.totalBookings}</td>
                        <td className="py-2.5 px-3">{row.totalGuests}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center justify-center rounded-full bg-[#e0ecff] text-[#1c3d8d] text-xs font-extrabold px-2 py-0.5">
                            {row.staffNeeded} staff
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[#eef2fb] overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  ratio < 0.4
                                    ? "bg-[#34d399]"
                                    : ratio < 0.8
                                    ? "bg-[#fbbf24]"
                                    : "bg-[#f97373]",
                                )}
                                style={{ width: `${ratio * 100}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-[11px] text-[#7b879b]">
                              {Math.round(ratio * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

