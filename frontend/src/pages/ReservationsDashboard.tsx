import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { cn } from "../lib/utils";
import { useBooking } from "../hooks/useBooking";
import { Calendar, Users, Settings, PlusCircle, User, Timer, TimerIcon, Database, CalendarCheck2, Edit2, Edit, Delete, LucideDelete, DeleteIcon, Trash, Trash2, ChartArea, BarChart } from 'lucide-react';


function formatDisplayDate(date: string) {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso.test(date)) return date;
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function ReservationsDashboard() {
  const { fetchBookings, bookings, isLoadingBookings, error } = useBooking();
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todaysBookings = bookings.filter((b) => b.date === today);
  
  const slots = Array.from(
    new Set(todaysBookings.map((r) => r.time))
  ).sort();

  const reservationsForSlot = todaysBookings.filter(
    (b) => selectedTime ? b.time === selectedTime : true
  );

  return (
    <DashboardLayout
      navItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "reservations", label: "Reservations" },
        { key: "emails", label: "Emails" },
        { key: "analytics", label: "Analytics" },
        { key: "settings", label: "Settings" },
      ]}
      topRight={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-[#1e293b] font-semibold text-[13px]">{formatDisplayDate(today)}</span>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="m-0 text-2xl font-semibold text-gray-800">Reservations</h1>
        </div>
        
        <div className="flex gap-2.5">
          <button className="rounded-lg border border-blue-600 bg-blue-600 text-white py-2.5 px-4 font-semibold text-[13px] cursor-pointer hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-white" />
            Add Reservation
          </button>
          <button className="rounded-lg border border-gray-300 bg-white text-gray-700 py-2.5 px-4 font-semibold text-[13px] cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2">
            View All
          </button>
        </div>
      </div>

      <div
        className="flex gap-3 p-3 bg-linear-to-b from-gray-50 to-white bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm"
        aria-label="Time slots"
      >
        {slots.map((t) => {
          const count = todaysBookings.filter((b) => b.time === t).length;
          return (
            <button
              key={t}
              className={cn(
                "min-w-19.5 border rounded-xl py-3 px-3 text-left cursor-pointer transition-all duration-200 group:",
                selectedTime  === t
                  ? "bg-linear-to-br from-blue-100/30 to-blue-200/30 border-2 border-blue-600 shadow-lg scale-105"
                  : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102"
              )}
              
              onClick={() => {
                  setSelectedTime(t);
                  setSelectedReservation(null);
              }}
            >
              <div className="font-bold text-sm mb-1">{t}</div>
              <div className="text-xs text-gray-600">{count} Reservation{count !== 1 ? "s" : ""}</div>
            </button>
          );
        })}
      </div>

      {isLoadingBookings && 
        <div className="my-4 p-4 bg-blue-50 rounded-lgfflex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-700 font-medium">Loading reservations...</span> 
        </div>}

      {error && (
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex items-center gap-2 text-red-700">
            <span className="font-semibold">{error}</span>
          </div>
          
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mt-4">
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="py-3 px-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="font-extrabold">{formatDisplayDate(today)}</div>
            </div>
          </div>

          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                <th className="text-left py-3 px-4 text-gray-600 font-bold border-b border-gray-200">
                  Time
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-bold border-b border-gray-200">
                  Size
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-bold border-b border-gray-200">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-bold border-b border-gray-200">
                  Customer Requests
                </th>
                <th className="text-left py-3 px-4 text-gray-600 font-bold border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {reservationsForSlot.map((r, index) => (
                <tr
                  key={r.id}
                  className={cn(
                    "cursor-pointer transition-colors duration-150 hover:bg-blue-50",
                    selectedReservation?.id === r.id ? "bg-blue-50 border-l-4 border-l-blue-500" : "",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                  onClick={() => setSelectedReservation(r)}
                >
                  <td className="py-3 px-4 border-b border-gray-100 font-medium">{r.time}</td>
                  <td className="py-3 px-4 border-b border-gray-100">{r.party_size}</td>
                  <td className="py-3 px-4 border-b border-gray-100 font font-medium">{r.customer_name}</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-gray-500 max-w-50 truncate">{r.customer_questions || "-"}</td>
                  <td className="py-3 px-4 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-linear-to-r from green-50 to emerald-50 text-green-700 font-semibold text-xs border border-green-200">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="py-3 px-4 border-b border-gray-300 bg-linear-to-r from-blue-50 to-blue-100/30">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-semibold text-black">Reservation Details</span>
              </div>
            </div>
            <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100/30">
              {selectedReservation ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b border-blue-200/50">
                    <div className="font-bold text-amber-700 text-sm">Date:</div>
                    <div className="text-gray-800 font-medium">
                      <span className="inline-flex items-center gap-3">
                        <CalendarCheck2 className="w-5 h-5" />
                        {formatDisplayDate(selectedReservation.date)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b border-blue-200/50">
                    <div className="font-bold text-amber-700 text-sm">Time:</div>
                    <div className="text-gray-800 font-medium">
                      <span className="inline-flex items-center gap-3">
                        <Timer className="w-5 h-5" />
                        {selectedReservation.time}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 py-2 border-b border-blue-200/50">
                    <div className="font-bold text-amber-700 text-sm">Party Size:</div>
                    <div className="text-gray-800 font-medium">
                      <span className="inline-flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        {selectedReservation.party_size} people
                      </span>
                    </div>
                  </div>
                  
                  {selectedReservation && (
                    <div className="flex gap-2 pt-3 mt-2 border-t border-blue-200/50">
                      <button className="flex-1 px-2 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
                        <Edit className="w-5 h-5" />
                        Edit
                      </button>
                      <button className="flex-1 px-2 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-3">
                        <Trash2 className="w-5 h-5" />
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">Select a reservation to view details</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="py-3 px-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 " />
                <span className="font-bold text-black">Today's Summary</span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-700">{todaysBookings.length}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {todaysBookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-xs text-gray-600">Confirmed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-purple-700">{slots.length}</div>
                  <div className="text-xs text-gray-600">Time Slots</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-amber-700">
                    {Math.round(todaysBookings.reduce((acc, b) => acc + b.party_size, 0) / (todaysBookings.length || 1))}
                  </div>
                  <div className="text-xs text-gray-600">Avg. Size</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
