import faunadb from 'faunadb'

const faunaClient = new faunadb.Client({ secret: process.env.FAUNA_SECRET })
const q = faunadb.query

const getBookings = async () => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection('bookings'))),
      q.Lambda('ref', q.Get(q.Var('ref'))),
    ),
  )
  const bookings = data.map((booking) => {
    booking.id = booking.ref.id
    delete booking.ref
    return booking
  })

  return bookings
}

const getBookingById = async (id) => {
  const booking = await faunaClient.query(
    q.Get(q.Ref(q.Collection('bookings'), id)),
  )
  booking.id = booking.ref.id
  delete booking.ref
  return booking
}

const getBookingsByUser = async (userId) => {
  const { data } = await faunaClient.query(
    q.Map(
      q.Paginate(q.Match(q.Index('bookings_by_user'), userId)),
      q.Lambda('ref', q.Get(q.Var('ref'))),
    ),
  )
  const bookings = data.map((booking) => {
    booking.id = booking.ref.id
    delete booking.ref
    return booking
  })

  return bookings
}

const createBooking = async (time, room, remarks, userId) => {
  return await faunaClient.query(
    q.Create(q.Collection('bookings'), {
      data: { time, room, remarks, userId },
    }),
  )
}

const updateBooking = async (id, time, room, remarks, userId) => {
  return await faunaClient.query(
    q.Update(q.Ref(q.Collection('bookings'), id), {
      data: { time, room, remarks, userId },
    }),
  )
}

const deleteBooking = async (id) => {
  return await faunaClient.query(q.Delete(q.Ref(q.Collection('bookings'), id)))
}

export {
  createBooking,
  getBookings,
  getBookingById,
  getBookingsByUser,
  updateBooking,
  deleteBooking,
}
