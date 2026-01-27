import React from "react";

export type Booking = {
  id: string;
  guestName?: string;
  startDate?: string; // ISO or display string
  endDate?: string; // ISO or display string
  summary?: string; // short context line for the list
};

export type BookingProps = {
  bookings: Booking[];

  /**
   * Controlled selection (optional). If omitted, component manages its own selection.
   */
  selectedBookingId?: string | null;
  onSelectedBookingIdChange?: (id: string | null) => void;

  /**
   * Controlled draft text.
   */
  draftReply: string;
  onDraftReplyChange: (next: string) => void;
};

export function Booking({
  bookings,
  selectedBookingId: selectedBookingIdProp,
  onSelectedBookingIdChange,
  draftReply,
  onDraftReplyChange,
}: BookingProps) {
  const isSelectionControlled = selectedBookingIdProp !== undefined;
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = React.useState<string | null>(
    bookings[0]?.id ?? null,
  );

  const selectedBookingId = isSelectionControlled ? selectedBookingIdProp ?? null : uncontrolledSelectedId;
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) ?? null;

  const selectBooking = (id: string) => {
    if (!isSelectionControlled) setUncontrolledSelectedId(id);
    onSelectedBookingIdChange?.(id);
  };

  return (
    <div>
      <h2>Bookings</h2>
      {bookings.length ? (
        <ul aria-label="Bookings list">
          {bookings.map((b) => {
            const labelParts = [
              b.guestName ? b.guestName : `Booking ${b.id}`,
              b.startDate || b.endDate ? `(${b.startDate ?? "?"} → ${b.endDate ?? "?"})` : "",
              b.summary ? `— ${b.summary}` : "",
            ].filter(Boolean);

            const isSelected = b.id === selectedBookingId;

            return (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => selectBooking(b.id)}
                  aria-current={isSelected ? "true" : undefined}
                >
                  {labelParts.join(" ")}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No bookings.</p>
      )}

      <h2>Draft reply</h2>
      {selectedBooking ? (
        <p>
          Replying to: <strong>{selectedBooking.guestName ?? selectedBooking.id}</strong>
        </p>
      ) : (
        <p>Select a booking to draft a reply.</p>
      )}

      <textarea
        aria-label="Draft reply text"
        rows={10}
        value={draftReply}
        onChange={(e) => onDraftReplyChange(e.target.value)}
        disabled={!selectedBooking}
      />
    </div>
  );
}

