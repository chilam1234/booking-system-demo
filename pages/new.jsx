import BookingForm from "../components/BookingForm";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Title } from "@mantine/core";
import { createBooking } from "../actions";
import { useRouter } from "next/router";

export default function New() {
  const router = useRouter();
  const { room, start, end } = router.query;
  let newBooking;
  if (room && start && end) {
    newBooking = {
      room,
      start,
      end,
    };
  }
  return (
    <div>
      <main className="max-w-lg mx-auto">
        <Title order={3} className="mt-3">
          New Booking
        </Title>
        <BookingForm createBookingCb={createBooking} newBooking={newBooking} />
      </main>
    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();
