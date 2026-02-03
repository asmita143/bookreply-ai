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
    return (
      <div className="flex items-center justify-center h-full text-sm text-[#888]">
        Select an email
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-semibold mb-3 text-[#111]">{email.subject}</h2>

      <div className="flex justify-between text-[13px] text-[#666] mb-4 pb-4 border-b border-[#eee]">
        <span>{email.from}</span>
        <span>{new Date(email.receivedAt).toLocaleString()}</span>
      </div>

      <p className="text-sm leading-relaxed text-[#333] whitespace-pre-line">{email.preview}</p>
    </div>
  );
}

  