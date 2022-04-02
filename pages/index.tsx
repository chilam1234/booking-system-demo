import MyCalendar from "../components/Calendar";
import useSWR from "swr";
import { WithUser } from "../components/HOC/withUser";
import { LoadingOverlay } from "@mantine/core";

export default function Home() {
  const { data: bookings } = useSWR("/api/bookings");
  const MyCalendarWithUser = WithUser(MyCalendar);
  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={bookings === undefined} />
      <main className="">
        <MyCalendarWithUser bookings={bookings} />
      </main>
    </div>
  );
}
