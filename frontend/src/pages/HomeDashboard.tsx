import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { useEmails } from "../hooks/useEmails";
import { cn } from "../lib/utils";

type Booking = {
  id: string;
  date: string;
  time: string;
  party_size: number;
  customer_name?: string;
  status?: string;
  dietary_requirements?: string;
};

const MAX_CAPACITY = 80;

type TodaySlot = {
  time: string;
  totalGuests: number;
  bookings: Booking[];
};

type TodayTotals = {
  totalGuests: number;
  totalBookings: number;
  staffNeeded: number;
  capacityUsed: number;
  busiestSlot: TodaySlot | null;
};

type GroupMenu = {
  starters: string[];
  mains: string[];
  desserts: string[];
};

const GROUP_MENU_STORAGE_KEY = "restaurantx.groupMenu.v1";

const DEFAULT_GROUP_MENU: GroupMenu = {
  starters: [
    "Roasted tomato soup, basil oil",
    "Mixed greens salad, citrus vinaigrette",
    "Garlic prawns, chili butter",
  ],
  mains: [
    "Grilled salmon, lemon herb rice",
    "Chicken parmesan, tomato linguine",
    "Mushroom risotto, parmesan crisp (V)",
  ],
  desserts: [
    "Classic tiramisu",
    "Dark chocolate mousse, berries",
    "Vanilla panna cotta, mango coulis",
  ],
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isToday(date: string | undefined | null): boolean {
  if (!date) return false;
  return date === getTodayKey();
}

function buildTodaySlots(bookings: Booking[]): TodaySlot[] {
  const todayBookings = bookings.filter((b) => isToday(b.date));
  const byTime: Record<string, TodaySlot> = {};

  todayBookings.forEach((b) => {
    if (!b.time) return;
    if (!byTime[b.time]) {
      byTime[b.time] = { time: b.time, totalGuests: 0, bookings: [] };
    }
    const size = typeof b.party_size === "number" ? b.party_size : 0;
    byTime[b.time].totalGuests += size;
    byTime[b.time].bookings.push(b);
  });

  return Object.values(byTime).sort((a, b) => (a.time < b.time ? -1 : 1));
}

function getTotalsForToday(slots: TodaySlot[]): TodayTotals {
  const totalGuests = slots.reduce((sum, s) => sum + s.totalGuests, 0);
  const totalBookings = slots.reduce((sum, s) => sum + s.bookings.length, 0);
  const staffNeeded = totalGuests > 0 ? Math.ceil(totalGuests / 15) : 1;
  const capacityUsed = MAX_CAPACITY > 0 ? Math.min(100, Math.round((totalGuests / MAX_CAPACITY) * 100)) : 0;

  let busiest: TodaySlot | null = null;
  slots.forEach((s) => {
    if (!busiest || s.totalGuests > busiest.totalGuests) busiest = s;
  });

  return { totalGuests, totalBookings, staffNeeded, capacityUsed, busiestSlot: busiest };
}

export function HomeDashboard() {
  const { emails, loading: emailsLoading, error: emailsError } = useEmails();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = React.useState(true);
  const [bookingsError, setBookingsError] = React.useState<string | null>(null);
  const [menu, setMenu] = React.useState<GroupMenu>(DEFAULT_GROUP_MENU);
  const [draftMenu, setDraftMenu] = React.useState<GroupMenu>(DEFAULT_GROUP_MENU);
  const [isEditingMenu, setIsEditingMenu] = React.useState(false);

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

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(GROUP_MENU_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<GroupMenu>;
      const next: GroupMenu = {
        starters: Array.isArray(parsed.starters) ? parsed.starters.slice(0, 3) : DEFAULT_GROUP_MENU.starters,
        mains: Array.isArray(parsed.mains) ? parsed.mains.slice(0, 3) : DEFAULT_GROUP_MENU.mains,
        desserts: Array.isArray(parsed.desserts) ? parsed.desserts.slice(0, 3) : DEFAULT_GROUP_MENU.desserts,
      };
      setMenu(next);
      setDraftMenu(next);
    } catch {
      // ignore localStorage/JSON errors and keep defaults
    }
  }, []);

  const todaySlots = buildTodaySlots(bookings);
  const { totalGuests, totalBookings, staffNeeded, capacityUsed, busiestSlot } =
    getTotalsForToday(todaySlots);

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const activeMenu = isEditingMenu ? draftMenu : menu;

  const updateMenuItem = (section: keyof GroupMenu, index: number, value: string) => {
    setDraftMenu((prev) => {
      const current = prev[section].slice(0, 3);
      while (current.length < 3) current.push("");
      current[index] = value;
      return { ...prev, [section]: current };
    });
  };

  const saveMenu = () => {
    const next: GroupMenu = {
      starters: draftMenu.starters.slice(0, 3),
      mains: draftMenu.mains.slice(0, 3),
      desserts: draftMenu.desserts.slice(0, 3),
    };
    setMenu(next);
    setIsEditingMenu(false);
    try {
      localStorage.setItem(GROUP_MENU_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const cancelMenuEdit = () => {
    setDraftMenu(menu);
    setIsEditingMenu(false);
  };

  const resetMenu = () => {
    setMenu(DEFAULT_GROUP_MENU);
    setDraftMenu(DEFAULT_GROUP_MENU);
    setIsEditingMenu(false);
    try {
      localStorage.removeItem(GROUP_MENU_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <DashboardLayout
      navItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "reservations", label: "Reservations" },
        { key: "emails", label: "Emails" },
        { key: "analytics", label: "Analytics" },
        { key: "settings", label: "Settings" },
      ]}
      activeNavKey="dashboard"
      topRight={
        <div className="flex items-center gap-2 text-[13px] text-[#536173]">
          <span className="py-1 px-2 rounded-full bg-[#f0f3f8]">{todayLabel}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="m-0 text-[22px]">Today at RestaurantX</h1>
            <p className="m-0 text-[13px] text-[#6b7a90]">
              Quick overview of tonight&apos;s service – reservations, staff, and important messages.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-[#2f6fed] text-white p-4 shadow-sm">
            <div className="text-xs font-semibold opacity-80">Guests Today</div>
            <div className="mt-1 text-3xl font-extrabold leading-tight">{totalGuests}</div>
            <div className="mt-3 text-[11px] opacity-80">
              Across <span className="font-semibold">{totalBookings}</span> bookings.
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#e3e8f3] shadow-sm">
            <div className="text-xs font-semibold text-[#6b7a90]">Staff Needed Today</div>
            <div className="mt-1 text-3xl font-extrabold text-[#1b2430] leading-tight">
              {staffNeeded}
            </div>
            <div className="mt-3 text-[11px] text-[#7b879b]">
              Based on <span className="font-semibold">1 staff / 15 guests</span>.
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#e3e8f3] shadow-sm">
            <div className="text-xs font-semibold text-[#6b7a90]">Capacity Used</div>
            <div className="mt-1 text-3xl font-extrabold text-[#1b2430] leading-tight">
              {capacityUsed}%
            </div>
            <div className="mt-3 text-[11px] text-[#7b879b]">
              Assuming max capacity of <span className="font-semibold">{MAX_CAPACITY}</span> guests.
            </div>
          </div>

          <div className="rounded-2xl bg-[#111827] text-white p-4 shadow-sm">
            <div className="text-xs font-semibold opacity-80">New Reservation Emails</div>
            <div className="mt-1 text-3xl font-extrabold leading-tight">
              {emails.filter((e) => e.intent === "booking").length}
            </div>
            <div className="mt-3 text-[11px] opacity-80">
              From today&apos;s inbox sync.
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="rounded-2xl bg-white border border-[#e3e8f3] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="m-0 text-[15px] font-extrabold text-[#1b2430]">
                Today&apos;s Service Timeline
              </h2>
              {(bookingsLoading || emailsLoading) && (
                <span className="text-[11px] text-[#7b879b]">Loading live data…</span>
              )}
            </div>

            {bookingsError && (
              <div className="mb-2 text-[12px] text-red-500">Bookings: {bookingsError}</div>
            )}

            {todaySlots.length === 0 ? (
              <p className="mt-2 text-[13px] text-[#7b879b]">
                No bookings for today yet. New bookings will appear here as they are created.
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {todaySlots.map((slot) => {
                  const ratio = totalGuests ? slot.totalGuests / totalGuests : 0;
                  const isPeak = busiestSlot?.time === slot.time;

                  return (
                    <div
                      key={slot.time}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2",
                        isPeak
                          ? "border-[#2f6fed] bg-[#f5f7ff]"
                          : "border-[#e6ebf2] bg-[#f9fbff]",
                      )}
                    >
                      <div className="w-16">
                        <div className="font-semibold text-[13px] text-[#1b2430]">
                          {slot.time}
                        </div>
                        <div className="text-[11px] text-[#7b879b]">
                          {slot.bookings.length} booking
                          {slot.bookings.length === 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="flex-1 h-2.5 rounded-full bg-[#eef2fb] overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            isPeak ? "bg-[#2f6fed]" : "bg-[#9ba6ff]",
                          )}
                          style={{ width: `${Math.max(10, ratio * 100)}%` }}
                        />
                      </div>
                      <div className="w-14 text-right">
                        <div className="text-[13px] font-semibold text-[#1b2430]">
                          {slot.totalGuests}
                        </div>
                        <div className="text-[11px] text-[#7b879b]">guests</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-[#e3e8f3] p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="m-0 text-[15px] font-extrabold text-[#1b2430]">
                  Today&apos;s Group Menu
                </h2>
                <p className="m-0 mt-1 text-[12px] text-[#7b879b]">
                  Editable set menu with 3 options each for starters, mains and dessert.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {isEditingMenu ? (
                  <>
                    <button
                      type="button"
                      onClick={saveMenu}
                      className="rounded-lg bg-[#2f6fed] text-white border border-[#2a62d2] px-3 py-1.5 text-[12px] font-bold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelMenuEdit}
                      className="rounded-lg bg-white text-[#1b2430] border border-[#d7deea] px-3 py-1.5 text-[12px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftMenu(menu);
                        setIsEditingMenu(true);
                      }}
                      className="rounded-lg bg-white text-[#1b2430] border border-[#d7deea] px-3 py-1.5 text-[12px] font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={resetMenu}
                      className="rounded-lg bg-white text-[#7b879b] border border-[#d7deea] px-3 py-1.5 text-[12px] font-bold cursor-pointer"
                      title="Reset to default dummy menu"
                    >
                      Reset
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="m-0 mb-3 text-[12px] text-[#7b879b]">
              Tip: changes are saved in this browser.
            </p>

            <div className="space-y-3">
              <div className="rounded-xl border border-[#e6ebf2] bg-[#fbfcff] p-3">
                <div className="text-[12px] font-extrabold text-[#5a6a81] mb-2">Starters</div>
                {isEditingMenu ? (
                  <div className="space-y-2">
                    {activeMenu.starters.slice(0, 3).map((item, idx) => (
                      <input
                        key={`starter-${idx}`}
                        value={item ?? ""}
                        onChange={(e) => updateMenuItem("starters", idx, e.target.value)}
                        className="w-full rounded-lg border border-[#d7deea] bg-white px-3 py-2 text-[13px] text-[#1b2430] outline-none focus:border-[#2f6fed]"
                        placeholder={`Starter ${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="m-0 pl-4 space-y-1 text-[13px] text-[#1b2430]">
                    {activeMenu.starters.slice(0, 3).map((item, idx) => (
                      <li key={`starter-li-${idx}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-[#e6ebf2] bg-[#fbfcff] p-3">
                <div className="text-[12px] font-extrabold text-[#5a6a81] mb-2">Main Course</div>
                {isEditingMenu ? (
                  <div className="space-y-2">
                    {activeMenu.mains.slice(0, 3).map((item, idx) => (
                      <input
                        key={`main-${idx}`}
                        value={item ?? ""}
                        onChange={(e) => updateMenuItem("mains", idx, e.target.value)}
                        className="w-full rounded-lg border border-[#d7deea] bg-white px-3 py-2 text-[13px] text-[#1b2430] outline-none focus:border-[#2f6fed]"
                        placeholder={`Main ${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="m-0 pl-4 space-y-1 text-[13px] text-[#1b2430]">
                    {activeMenu.mains.slice(0, 3).map((item, idx) => (
                      <li key={`main-li-${idx}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-[#e6ebf2] bg-[#fbfcff] p-3">
                <div className="text-[12px] font-extrabold text-[#5a6a81] mb-2">Dessert</div>
                {isEditingMenu ? (
                  <div className="space-y-2">
                    {activeMenu.desserts.slice(0, 3).map((item, idx) => (
                      <input
                        key={`dessert-${idx}`}
                        value={item ?? ""}
                        onChange={(e) => updateMenuItem("desserts", idx, e.target.value)}
                        className="w-full rounded-lg border border-[#d7deea] bg-white px-3 py-2 text-[13px] text-[#1b2430] outline-none focus:border-[#2f6fed]"
                        placeholder={`Dessert ${idx + 1}`}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="m-0 pl-4 space-y-1 text-[13px] text-[#1b2430]">
                    {activeMenu.desserts.slice(0, 3).map((item, idx) => (
                      <li key={`dessert-li-${idx}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>

              

              {(emailsError || bookingsError) && (
                <div className="text-[12px] text-[#7b879b]">
                  Some data failed to load. {emailsError ? `Emails: ${emailsError}. ` : ""}
                  {bookingsError ? `Bookings: ${bookingsError}.` : ""}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

