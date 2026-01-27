import React from "react";

export type Email ={
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string;
    read: boolean;
    starred: boolean;
    important: boolean;
    draft: boolean;
};
export type EmailAndDraftProps = {
    emails: Email[];
};

const EmailAndDraft: React.FC<EmailAndDraftProps> = ({ emails }) => {
    return (
        <div>
            <h2>Emails</h2>
            {emails.length ? (
              <ul aria-label="Email list">
                {emails.map((e) => (
                  <li key={e.id}>
                    <strong>{e.subject}</strong> — {e.from}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No emails.</p>
            )}
        </div>
    );
}

export default EmailAndDraft;