import BookingForm from "../components/BookingForm";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Title } from "@mantine/core";

export default function New() {
  return (
    <div>
      <main className="max-w-lg mx-auto">
        <Title order={3} className="mt-3">
          New Booking
        </Title>
        <BookingForm />
      </main>
    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();