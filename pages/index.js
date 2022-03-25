import Head from 'next/head'
import Booking from '../components/Booking'
import useSWR from 'swr'
import Header from '../components/Header'
export default function Home() {
  const { data: bookings } = useSWR('/api/bookings')
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <Header title="One Day Booking System" />
        {bookings &&
          bookings.map((booking) => (
            <Booking key={booking.id} booking={booking} />
          ))}
      </main>
    </div>
  )
}
