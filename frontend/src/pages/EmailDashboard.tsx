import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { EmailList } from "../components/email/EmailList";
import { EmailContent } from "../components/email/EmailContent";

type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
  status: string;
};

export function EmailDashboard() {
  const [emails, setEmails] = React.useState<Email[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/emails.json")
      .then((r) => r.json())
      .then((data: Email[]) => {
        setEmails(data);
        setSelectedId(data[0]?.id ?? null);
      });
  }, []);

  const selectedEmail = emails.find((e) => e.id === selectedId) ?? null;

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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3.5 mt-3">
        <aside className="bg-white border border-[#e6ebf2] rounded-xl overflow-hidden">
          <div className="py-3 px-3.5 border-b border-[#eef2f7] bg-[#fbfcfe]">
            <div className="font-extrabold">Inbox</div>
          </div>

          <EmailList
            emails={emails}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        <section className="bg-white border border-[#e6ebf2] rounded-xl overflow-hidden">
          <EmailContent email={selectedEmail} />
        </section>
      </div>
    </DashboardLayout>
  );
}
