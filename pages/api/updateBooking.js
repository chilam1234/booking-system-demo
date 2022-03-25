import { updateBooking, getBookingById } from '../../utils/Fauna'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res)
  const userId = session.user.sub
  if (req.method !== 'PUT') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }

  const { id, time, room, remarks } = req.body
  const existingRecord = await getBookingById(id)
  if (!existingRecord || existingRecord.data.userId !== userId) {
    res.statusCode = 404
    return res.json({ msg: 'Record not found' })
  }

  try {
    const updated = await updateBooking(id, time, room, remarks, userId)
    return res.status(200).json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
})
