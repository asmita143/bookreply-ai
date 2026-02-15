import { useEffect, useState } from "react";

export type Email = {
    gmail_id: string
    full_name: string
    sender: string
    subject: string
    body: string
    intent: string
    preview: string
    received_at: string
};

export function useEmails() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/emails/");

            if (!response.ok) {
                throw new Error("Failed to fetch emails");
            }

            const data: Email[] = await response.json();
            setEmails(data);

        }catch (err: any) {
            setError(err.message || "Something went wrong");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

  return { emails, loading, error };
}