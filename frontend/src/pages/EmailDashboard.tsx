import { useEffect, useState } from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { EmailList } from "../components/email/EmailList";
import { EmailContent } from "../components/email/EmailContent";
import { useIsMobile } from "../hooks/useMediaQuery";
import { useEmails } from "../hooks/useEmails";

type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
  status: string;
};

export function EmailDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<string>("");
  const isMobile = useIsMobile();
  const { emails, loading, error } = useEmails();


  useEffect(() => {
    if (!isMobile && emails.length > 0 && selectedId === null) {
      setSelectedId(emails[0].gmail_id);
    }
  }, [isMobile, emails, selectedId]);

  const selectedEmail = emails.find((e) => e.gmail_id === selectedId) ?? null;

  // Clear reply draft when switching to a different email
  useEffect(() => {
    setReplyDraft("");
  }, [selectedId]);

  const handleSimplify = () => {
    if (!selectedEmail) return;
    const text = selectedEmail.body ?? "";
    const trimmed = text.length > 220 ? `${text.slice(0, 220)}…` : text;
    setReplyDraft(`Simplified summary:\n\n${trimmed}`);
  };

  const handleGenerateReply = () => {
    if (!selectedEmail) return;
    const from = selectedEmail.sender;
    const namePart = from.split("<")[0].trim();
    const firstName = (namePart.split(" ")[0] ?? from).trim();
    const subject = selectedEmail.subject;
    const template = `Hi ${firstName || "there"},

    Thank you for your message about "${subject}". I've reviewed the details and would be happy to help.

    Best regards,
    RestaurantX Team`;

    setReplyDraft(template);
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
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <h1 className="m-0 text-[22px]">Emails</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_620px] gap-3.5 mt-3">
        {/* Mobile: show list only when no email is selected */}
        <aside
          className={showDetailOnMobile ? "hidden" : "bg-white border border-[#e6ebf2] rounded-xl overflow-hidden"}
        >
          <div className="py-3 px-3.5 border-b border-[#eef2f7] bg-[#fbfcfe]">
            <div className="font-extrabold">Inbox</div>
            {isMobile && (
              <p className="text-xs text-[#6b7a90] font-normal mt-0.5">
                Tap an email to read
              </p>
            )}
          </div>

          <EmailList
            emails={emails}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* Mobile: show detail only when an email is selected (with back). Desktop: always show. */}
        <section
          className={
            showListOnMobile
              ? "hidden"
              : "bg-white border border-[#e6ebf2] rounded-xl overflow-hidden flex flex-col min-h-0 lg:min-h-[400px]"
          }
        >
          <EmailContent
            email={selectedEmail}
            onBack={isMobile && selectedId !== null ? () => setSelectedId(null) : undefined}
            replyDraft={replyDraft}
            onReplyDraftChange={setReplyDraft}
            onSimplify={handleSimplify}
            onGenerateReply={handleGenerateReply}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
