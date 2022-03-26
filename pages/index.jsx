import Head from "next/head";
import Booking from "../components/Booking";
import useSWR from "swr";

export default function Home() {
  const { data: bookings } = useSWR("/api/bookings");
  return (
    <div>
      <main className="">
        {bookings &&
          bookings.map((booking) => (
            <Booking key={booking.id} booking={booking} />
          ))}
      </main>
    </div>
  );
}
