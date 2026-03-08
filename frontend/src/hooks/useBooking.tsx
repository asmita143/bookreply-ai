import { useState } from "react";

export interface BookingData {
    id: string;
    customer_name: string;
    date: string;
    time: string;
    party_size: number;
    email: string;
    dietary_requirements?: string | null;
    customer_questions?: string[];
    status: string;
}

export function useBooking() {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [error, setError] = useState<string | null>(null);

    const createBooking = async (bookingData: BookingData) => {
        try {
            setIsCreating(true);
            setError(null);

            const formattedData = {
                booking_date: bookingData.date,
                booking_time: bookingData.time,
                party_size: bookingData.party_size,
                customer_name: bookingData.customer_name,
                customer_email: bookingData.email,
                dietary_requirements: bookingData.dietary_requirements ?? "",
                customer_questions: bookingData.customer_questions ?? [],
            };
            console.log("SENDING TO BACKEND:", formattedData);

            const response = await fetch("/bookings/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });
            console.log("response ", response)
            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                console.error("Backend error:", data);
                throw new Error("Failed to create booking");
            }
            
            return data;

        } catch (err: any) {
        setError(err.message || "Something went wrong");
        throw err;

        } finally {
        setIsCreating(false);
        }
    };


    const fetchBookings = async () => {
        try {
        setIsLoadingBookings(true);
        setError(null);

        const response = await fetch("/bookings/");

        const data = await response.json();

        console.log("Fetched booking data ", data.id)

        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }

        setBookings(data);
        return data;
        } catch (err: any) {
        setError(err.message || "Failed to fetch bookings");
        throw err;
        } finally {
        setIsLoadingBookings(false);
        }
    };

    return {
        createBooking,
        fetchBookings,
        bookings,
        isCreating,
        isLoadingBookings,
        error,
    };
}