import { updateBooking, getBookingById } from '../../utils/Fauna'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import checkRole from '../../utils/checkRole'

export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res)
  const userId = session.user.sub

  if (req.method !== 'PUT') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }

  const { id, start, end, room, remarks } = req.body
  checkRole(session.user, res, room)
  const existingRecord = await getBookingById(id)
  if (!existingRecord || existingRecord.data.userId !== userId) {
    res.statusCode = 404
    return res.json({ msg: 'Record not found' })
  }

  try {
    const updated = await updateBooking({
      id,
      start,
      end,
      room,
      remarks,
      userId,
    })
    return res.status(200).json(updated)
  } catch (err) {
    if (err.message === 'Time is already occupied') {
      res.status(400).json({ msg: 'Time has already been booked.' })
    } else {
      res.status(500).json({ msg: 'Something went wrong.' })
    }
  }
})
