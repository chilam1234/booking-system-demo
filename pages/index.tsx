import MyCalendar from "../components/Calendar";
import useSWR from "swr";
import { WithUser } from "../components/HOC/withUser";

export default function Home() {
  const { data: bookings } = useSWR("/api/bookings");
  const MyCalendarWithUser = WithUser(MyCalendar);
  return (
    <div>
      <main className="">
        <MyCalendarWithUser bookings={bookings} />
      </main>
    </div>
  );
}
