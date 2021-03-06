import Head from "next/head";
import { getBookingById } from "../../utils/Fauna";
import BookingForm from "../../components/BookingForm";
import { Title } from "@mantine/core";
import { updateBooking, deleteBooking } from "../../actions";

export default function Home({ booking }) {
  return (
    <div>
      <main className="max-w-lg mx-auto">
        <Title order={1}>Update your Booking</Title>
        <BookingForm
          booking={booking}
          updateBookingCb={updateBooking}
          deleteBookingCb={deleteBooking}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const id = context.params.id;
    const booking = await getBookingById(id);
    return {
      props: { booking },
    };
  } catch (error) {
    console.error(error);
    context.res.statusCode = 302;
    context.res.setHeader("Location", `/`);
    return { props: {} };
  }
}
