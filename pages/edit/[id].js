import Head from 'next/head'
import { getBookingById } from '../../utils/Fauna'
import BookingForm from '../../components/BookingForm'

export default function Home({ booking }) {
  return (
    <div>
      <Head>
        <title>Update your Booking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-lg mx-auto">
        <h1 className="text-red-100 text-2xl mb-4">Update your Booking</h1>
        <BookingForm booking={booking} />
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const id = context.params.id
    const booking = await getBookingById(id)
    return {
      props: { booking },
    }
  } catch (error) {
    console.error(error)
    context.res.statusCode = 302
    context.res.setHeader('Location', `/`)
    return { props: {} }
  }
}
