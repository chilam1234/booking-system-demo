import Booking from "../components/Booking";
import MyCalendar from "../components/Calendar";
import useSWR from "swr";
import { WithUser } from "../components/HOC/withUser";

export default function Home() {
  const { data: bookings } = useSWR("/api/bookings");
  const BookingWithUser = WithUser(Booking);
  const MyCalendarWithUser = WithUser(MyCalendar);
  return (
    <div>
      <main className="">
        <MyCalendarWithUser bookings={bookings} />
        {bookings &&
          bookings.map((booking) => (
            <BookingWithUser key={booking.id} booking={booking} />
          ))}
      </main>
    </div>
  );
}
