import { cn } from "../../lib/utils";
import type { Email } from "../../hooks/useEmails";

type Props = {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
  }
}

export function EmailList({ emails, selectedId, onSelect }: Props) {
  return (
    <div className="h-full flex flex-col">
      <ul className="flex-1 overflow-y-auto list-none m-0 p-0 ">
        {emails.map((email) => (
          <li
            key={email.gmail_id}
            className={cn(
              "p-3 transition-all duration-200",
              "hover:bg-gray-50 hover:shadow-sm",
              email.gmail_id === selectedId && "bg-blue-50 hover:bg-blue-50 border-l-4 border-blue-500"
            )}
            onClick={() => onSelect(email.gmail_id)}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className={cn("font-semibold text-base text-gray-900")}>
                {email.full_name || email.sender}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {formatTime(email.received_at)}
              </span>
            </div>

            <div
              className={cn(
                "text-sm text-gray-700 mb-1.5 truncate",
              )}
            >
              {email.subject}
            </div>

            <div className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
              {email.preview}
            </div>
          </li>
        ))}
      </ul>
    </div>

    
  );
}
