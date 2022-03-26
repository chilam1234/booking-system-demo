import BookingForm from "../components/BookingForm";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function New() {
  return (
    <div>
      <main className="max-w-lg mx-auto">
        <h1 className="text-red-100 text-2xl mb-4">New Booking</h1>
        <BookingForm />
      </main>
    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();
