import React from "react";
import { Calendar, Clock, Users, Mail, Utensils, AlertCircle, CheckCircle2 } from "lucide-react";

interface BookingData {
  customer_name: string;
  date: string;
  time: string;
  party_size: number;
  email: string;
  source_email_id: string;
  dietary_requirements?: string | null;
  customer_questions?: string[];
}

interface BookingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}

const BookingInfoModal: React.FC<BookingInfoModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-300 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-emerald-500/20 border border-emerald-100 animate-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-8 pb-4">
          <div className="text-center">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1 p-1">
              Booking Confirmed!
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

          <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-inner">

            <div className="flex items-start gap-4 py-4 border-b border-gray-100 first:pt-0 last:border-0 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
              <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Users size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Guest Name</span>
                <span className="text-base text-gray-900 font-semibold">{bookingData.customer_name}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 py-4 border-b border-gray-100 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
              <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Date</span>
                <span className="text-base text-gray-900 font-semibold">{formatDate(bookingData.date)}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 py-4 border-b border-gray-100 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
              <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Clock size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Time</span>
                <span className="text-base text-gray-900 font-semibold">{bookingData.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-4 py-4 border-b border-gray-100 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
              <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Users size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Party Size</span>
                <span className="text-base text-gray-900 font-semibold">
                  {bookingData.party_size} {bookingData.party_size === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 py-4 border-b border-gray-100 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
              <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Mail size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Contact Email</span>
                <span className="text-base text-gray-900 font-semibold break-all">{bookingData.email}</span>
              </div>
            </div>

            {bookingData.dietary_requirements && (
              <div className="flex items-start gap-4 py-4 border-b border-gray-100 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
                <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <Utensils size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Dietary Requirements</span>
                  <span className="text-base text-gray-800">{bookingData.dietary_requirements}</span>
                </div>
              </div>
            )}

            {bookingData.customer_questions && bookingData.customer_questions.length > 0 && (
              <div className="flex items-start gap-4 py-4 group hover:bg-white/50 transition-colors duration-200 px-2 rounded-lg">
                <div className="bg-emerald-100 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <AlertCircle size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Special Requests</span>
                  <div className="flex flex-col gap-2">
                    {bookingData.customer_questions.map((question, index) => (
                      <span key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{question}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-gray-100">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to {bookingData.email}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base group"
          >
            <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <span>Got it</span>
          </button>

          <p className="text-base text-center text-black-400 mt-4">
            You can view or modify all bookings in your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoModal;