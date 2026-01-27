import React from "react";
import { DashboardLayout } from "../layout/DashboardLayout";
import { EmailList } from "../components/email/EmailList";
import { EmailContent } from "../components/email/EmailContent";
import "../pages/reservationsDashboard.css";

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
      topRight={<div className="rx__userChip">Anna</div>}
    >
      {/* PAGE HEADER */}
      <div className="rx__pageHeader">
        <h1 className="rx__h1">Emails</h1>
      </div>

      {/* PAGE GRID */}
      <div className="rx__grid">
        {/* 📬 EMAIL LIST SIDEBAR */}
        <aside className="rx__panel rx__panel--side">
          <div className="rx__panelHeader">
            <div className="rx__panelTitle">Inbox</div>
          </div>

          <EmailList
            emails={emails}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </aside>

        {/* ✉️ EMAIL CONTENT */}
        <section className="rx__panel">
          <EmailContent email={selectedEmail} />
        </section>
      </div>
    </DashboardLayout>
  );
}
