import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import Booking from "../components/Booking";
import { WithUser } from "../components/HOC/withUser";

export default function MyBookings() {
  const { data: bookings } = useSWR("/api/myBookings");
  const BookingWithUser = WithUser(Booking);

  return (
    <div>
      <main className="my-12">
        {bookings &&
          bookings.length > 0 &&
          bookings.map((booking) => (
            <BookingWithUser key={booking.id} booking={booking} />
          ))}
        {!bookings ||
          (bookings.length === 0 && (
            <p className="text-red-200">There are no bookings yet</p>
          ))}
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
