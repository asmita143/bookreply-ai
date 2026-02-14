import type { Email } from "../../hooks/useEmails";

type Props = {
  email: Email | null;
  /** When provided, shows a back button (e.g. for mobile list→detail flow). */
  onBack?: () => void;
  /** Current editable reply text. */
  replyDraft: string;
  /** Called whenever the reply draft text changes. */
  onReplyDraftChange: (value: string) => void;
  /** Optional handler for Simplify action. */
  onSimplify?: () => void;
  /** Optional handler for Generate reply action. */
  onGenerateReply?: () => void;
};

export function EmailContent({
  email,
  onBack,
  replyDraft,
  onReplyDraftChange,
  onSimplify,
  onGenerateReply,
}: Props) {
  const handleCopy = () => {
    if (!replyDraft.trim()) return;
    void navigator.clipboard.writeText(replyDraft);
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-sm text-[#888]">
        Select an email
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {onBack && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-[#e6ebf2] bg-[#fbfcfe]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#536173] font-semibold text-sm hover:text-[#1b2430] focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:ring-offset-1 rounded-lg px-2 py-1 -ml-1"
            aria-label="Back to inbox"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Inbox
          </button>
        </div>
      )}
      <div className="flex flex-col flex-1 min-h-0 overflow-auto p-4">
        <h2 className="text-xl font-semibold mb-3 text-[#111]">{email.subject}</h2>

        <div className="flex justify-between text-[13px] text-[#666] mb-4 pb-4 border-b border-[#eee]">
          <span>{email.sender}</span>
        </div>

        <p className="text-sm leading-relaxed text-[#333] whitespace-pre-line">{email.intent}</p>

        <div className="mt-6 border-t border-[#eef2f7] pt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => onSimplify && onSimplify()}
              className="inline-flex items-center justify-center rounded-[10px] border border-[#d7deea] bg-white px-3 py-2 text-[13px] font-semibold text-[#1b2430] hover:bg-[#f4f6fb] focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:ring-offset-1"
            >
              Simplify
            </button>
            <button
              type="button"
              onClick={() => onGenerateReply && onGenerateReply()}
              className="inline-flex items-center justify-center rounded-[10px] border border-[#2a62d2] bg-[#2f6fed] px-3 py-2 text-[13px] font-semibold text-white hover:bg-[#255ed9] focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:ring-offset-1"
            >
              Generate reply
            </button>
          </div>

          <div className="flex items-center justify-between mb-1.5 gap-2">
            <label className="block text-xs font-semibold text-[#6b7a90]">
              Reply draft
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!replyDraft.trim()}
              className={
                "inline-flex items-center gap-1 rounded-md border border-[#e6ebf2] px-2 py-1 text-[11px] font-semibold text-[#536173] bg-white hover:bg-[#f4f6fb] focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
              }
              aria-label="Copy reply draft"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="6" y="2" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="5" width="11" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
          <textarea
            value={replyDraft}
            onChange={(e) => onReplyDraftChange(e.target.value)}
            className="w-full min-h-[120px] max-h-[320px] text-sm leading-relaxed text-[#111] border border-[#e6ebf2] rounded-lg px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-[#2f6fed] focus:border-[#2a62d2] bg-white"
            placeholder="Generate a reply or start typing your own..."
          />
          <p className="mt-1 text-[11px] text-[#6b7a90]">
            You can edit this reply before sending it from your email client.
          </p>
        </div>
      </div>
    </div>
  );
}

  