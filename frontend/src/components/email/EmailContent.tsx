import "../../layout/emailContent.css"

type Email = {
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
};

type Props = {
  email: Email | null;
};

export function EmailContent({ email }: Props) {
  if (!email) {
    return <div className="emailContent__empty">Select an email</div>;
  }

  return (
    <div className="emailContent">
      <h2 className="emailContent__subject">{email.subject}</h2>

      <div className="emailContent__meta">
        <span>{email.from}</span>
        <span>
          {new Date(email.receivedAt).toLocaleString()}
        </span>
      </div>

      <p className="emailContent__body">{email.preview}</p>
    </div>
  );
}

  