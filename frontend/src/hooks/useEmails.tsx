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
    const [isSyncing, setIsSyncing] = useState(false);
    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

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

    const syncEmails = async () => {
        try {
            setIsSyncing(true);

            const response = await fetch("/gmail/sync", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Sync failed");
            }

            await response.json();

            await fetchEmails();

        } catch (err: any) {
            setError(err.message || "Sync failed");
        } finally {
            setIsSyncing(false);
        }
    };

    const generateDraft = async (emailId: string) => {
        try {
            setIsGeneratingDraft(true);

            const response = await fetch(`/ai/draft/${emailId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to generate draft");
            }

            const data = await response.json();

            return data.draft_reply;

        } catch (err: any) {
            setError(err.message || "Draft generation failed");
            throw err;
        } finally {
            setIsGeneratingDraft(false);
        }
    };


    useEffect(() => {
        fetchEmails();
    }, []);

  return { emails, loading, error, refetch: fetchEmails, syncEmails, isSyncing, generateDraft, isGeneratingDraft };
}