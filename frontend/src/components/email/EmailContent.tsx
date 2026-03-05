import type { Email } from "../../hooks/useEmails";

type Props = {
  email: Email | null;
  onBack?: () => void;
  replyDraft: string;
  onReplyDraftChange: (value: string) => void;
  onGenerateReply?: () => void;
  isGenerating: boolean;
};

export function EmailContent({
  email,
  onBack,
  replyDraft,
  onReplyDraftChange,
  onGenerateReply,
  isGenerating
}: Props) {
  const handleCopy = () => {
    
  };

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-100 text-sm text-gray-400 bg-gray-50/50">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-lg font-medium text-gray-500">No email selected</p>
        <p className="text-sm text-gray-400 mt-1">Select an email from your inbox to view it</p>
      </div>
    );
  }

  const formattedDate = new Date(email.received_at).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {onBack && (
        <div className="shrink-0 flex items-center gap-2 px-6 py-3 border-b border-[#e6ebf2] bg-[#fbfcfe]">
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
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className=" mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-light mb-8 text-gray-900 leading-tight">{email.subject}</h2>

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {(email.full_name || email.sender).charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {email.full_name || email.sender}
                    </span>
                    {email.full_name && (
                      <span className="text-sm text-gray-500">
                        &lt;{email.sender}&gt;
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <time dateTime={email.received_at}>{formattedDate}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-sm sm:prose-base w-full mb-10 rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {email.body}
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reply Draft</h3>
              <div className="">
                <button
                  type="button"
                  onClick={onGenerateReply}
                  disabled={isGenerating}
                  className="relative inline-flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-linear-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Neon wave effect */}
                  {isGenerating && (
                    <>
                      {/* Outer glow rings */}
                      <span className="absolute -inset-1 rounded-xl border-2 border-indigo-400/60 animate-ping opacity-60 shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ animationDuration: '2s' }} />
                      <span className="absolute -inset-2 rounded-xl border-2 border-purple-400/40 animate-ping opacity-40 shadow-[0_0_15px_rgba(168,85,247,0.3)]" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                      <span className="absolute -inset-3 rounded-xl border-2 border-blue-400/20 animate-ping opacity-20 shadow-[0_0_20px_rgba(59,130,246,0.2)]" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                      {/* Glow particles */}
                      {[...Array(6)].map((_, i) => (
                        <span
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.2}s`,
                            boxShadow: '0 0 10px white'
                          }}
                        />
                      ))}
                    </>
                  )}
                  
                  <span className="relative z-10 text-shadow-lg">
                    {isGenerating ? (
                      <span className="bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                        Generating with AI
                      </span>
                    ) : (
                      "Generate AI Reply"
                    )}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>To: {email.sender}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Copy reply draft"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <rect x="6" y="2" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="5" width="11" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>Copy to clipboard</span>
                </button>
              </div>

              <textarea
                value={replyDraft}
                onChange={(e) => onReplyDraftChange(e.target.value)}
                className="w-full min-h-40 p-4 text-sm leading-relaxed text-gray-800 border-0 focus:ring-0 focus:outline-none resize-y bg-white font-light"
                placeholder="Write your reply here, or click 'Generate Reply' to get started..."
              />
              
              <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You can edit this reply before sending it from your email client.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  