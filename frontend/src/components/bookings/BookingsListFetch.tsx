import React from "react";

type UnknownJson = unknown;

export function BookingsListFetch() {
  const [data, setData] = React.useState<UnknownJson>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/bookings.json");
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

        const json = (await res.json()) as UnknownJson;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div role="alert">Error: {error}</div>;

  return (
    <div>
      <h2>Bookings</h2>

      {Array.isArray(data) ? (
        <ul aria-label="Bookings list">
          {data.map((item, idx) => (
            <li key={(item as { id?: string })?.id ?? idx}>
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <pre aria-label="Bookings response">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
