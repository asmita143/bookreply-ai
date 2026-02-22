import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { EmailList } from "../components/email/EmailList";
import { EmailContent } from "../components/email/EmailContent";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useEmails } from "../hooks/useEmails";
import { cn } from "../lib/utils";
import BookingConfirmationModal from "../components/Modal/BookingConfirmationModal";
import { useBooking } from "../hooks/useBooking";

export function EmailDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const isMobile = useIsMobile();
  const { emails, loading, error, syncEmails, isSyncing, generateDraft, isGeneratingDraft } = useEmails();
  const {createBooking, isCreating} = useBooking();
  const [bookingData, setBookingData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isMobile && emails.length > 0 && selectedId === null) {
      setSelectedId(emails[0].gmail_id);
    }
  }, [isMobile, emails, selectedId]);

  const selectedEmail = emails.find((e) => e.gmail_id === selectedId) ?? null;

  useEffect(() => {
    setDraft("");
  }, [selectedId]);

  const handleGenerateReply = async () => {
    if (!selectedEmail) return;
    console.log(selectedEmail.gmail_id)
    const result = await generateDraft(selectedEmail.gmail_id);
    setDraft(result.draft_reply);

    if (result.booking_available) {
      setBookingData(result.booking_data);
      setShowModal(true);   
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData) return;
    try {
      await createBooking(bookingData);
      alert("Booking created successfully!");
      setShowModal(false);

    } catch (error) {
      console.error(error);
      alert("Failed to create booking.");
    }

  };

  const showListOnMobile = isMobile && selectedId === null;
  const showDetailOnMobile = isMobile && selectedId !== null;

  if (loading) {
    return (
      <DashboardLayout activeNavKey="emails" navItems={[]}>
        <div className="p-6">Loading emails...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeNavKey="emails" navItems={[]}>
        <div className="p-6 text-red-500">
          Error loading emails: {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeNavKey="emails"
      navItems={[
        { key: "dashboard", label: "Dashboard" },
        { key: "reservations", label: "Reservations" },
        { key: "emails", label: "Emails" },
        { key: "analytics", label: "Analytics" },
        { key: "settings", label: "Settings" },
      ]}
      topRight={<div className="py-1.5 px-2.5 rounded-full bg-[#f0f3f8] text-[#2b3a4d]">Anna</div>}
    >
      <div className="flex flex-col h-full">
        
        <div className="flex-1 min-h-0">

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-3.5 h-full">
            {/* Mobile: show list only when no email is selected */}
            <aside
              className={cn(
                "h-full",
                showDetailOnMobile ? "hidden" : "bg-white border border-[#e6ebf2] rounded-xl overflow-hidden"
              )}
            >
              <div className="h-full flex flex-col">
                <div className="shrink-0 py-3 px-3.5 border-b border-[#eef2f7] bg-[#fbfcfe]">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold">Inbox</div>
                      <button
                        onClick={syncEmails}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-base font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer"
                        aria-label="Sync emails"
                        title="Check for new emails"
                      >
                        <svg 
                          className={cn("w-3.5 h-3.5", 
                          isSyncing && "animate-spin")}  
                          fill="none" stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                          />
                        </svg>
                        {isSyncing ? 'Syncing...' : 'Sync email'}
                    </button>
                  </div>
                  

                  {isMobile && (
                    <p className="text-xs text-[#6b7a90] font-normal mt-0.5">
                      Tap an email to read
                    </p>
                  )}
                </div>
                <div className="flex-1 min-h-0">
                  <EmailList
                    emails={emails}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                  />
                </div>
              </div>
            </aside>

            {/* Mobile: show detail only when an email is selected (with back). Desktop: always show. */}
            <section
               className={cn(
                "h-full",
                showListOnMobile
                  ? "hidden"
                  : "bg-white border border-[#e6ebf2] rounded-xl overflow-hidden"
              )}
            >
              <EmailContent
                email={selectedEmail}
                onBack={isMobile && selectedId !== null ? () => setSelectedId(null) : undefined}
                replyDraft={draft}
                onReplyDraftChange={setDraft}
                onGenerateReply={handleGenerateReply}
                isGenerating={isGeneratingDraft}
              />
            </section>

            {bookingData && (
              <BookingConfirmationModal
                isOpen={showModal}
                bookingData={bookingData}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmBooking}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
