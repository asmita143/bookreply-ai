import "../../layout/emailList.css";

type Email = {
  id: string;
  from: string;
  subject: string;
  receivedAt: string;
  status: string;
};

type Props = {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EmailList({ emails, selectedId, onSelect }: Props) {
  return (
    <ul className="emailList">
      {emails.map((email) => (
        <li
          key={email.id}
          className={`emailList__item
            ${email.id === selectedId ? "emailList__item--active" : ""}
            ${email.status === "unread" ? "emailList__item--unread" : ""}
          `}
          onClick={() => onSelect(email.id)}
        >
          <div className="emailList__row">
            <span className="emailList__from">{email.from}</span>
            <span className="emailList__time">
              {formatTime(email.receivedAt)}
            </span>
          </div>

          <div className="emailList__subject">{email.subject}</div>
        </li>
      ))}
    </ul>
  );
}
