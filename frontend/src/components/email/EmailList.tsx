import { cn } from "../../lib/utils";

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
    <ul className="list-none m-0 p-0">
      {emails.map((email) => (
        <li
          key={email.id}
          className={cn(
            "p-3 cursor-pointer border-b border-[#eee]",
            "hover:bg-[#f7f7f7]",
            email.id === selectedId && "bg-[#eef2ff]"
          )}
          onClick={() => onSelect(email.id)}
        >
          <div className="flex justify-between text-[13px] text-[#555]">
            <span className={cn("text-[#111]", email.status === "unread" && "font-semibold")}>
              {email.from}
            </span>
            <span className="text-xs text-[#888]">
              {formatTime(email.receivedAt)}
            </span>
          </div>

          <div className={cn("mt-1 text-sm text-[#222]", email.status === "unread" && "font-semibold")}>
            {email.subject}
          </div>
        </li>
      ))}
    </ul>
  );
}
