import Booking from "../components/Booking";
import useSWR from "swr";
import { WithUser } from "../components/HOC/withUser";

export default function Home() {
  const { data: bookings } = useSWR("/api/bookings");
  const BookingWithUser = WithUser(Booking);
  return (
    <div>
      <main className="">
        {bookings &&
          bookings.map((booking) => (
            <BookingWithUser key={booking.id} booking={booking} />
          ))}
      </main>
    </div>
  );
}
