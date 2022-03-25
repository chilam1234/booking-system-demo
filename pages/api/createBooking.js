import { createBooking } from '../../utils/Fauna'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'

export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res)
  const userId = session.user.sub
  const { time, room, remarks } = req.body
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }
  try {
    const createdBooking = await createBooking(time, room, remarks, userId)
    return res.status(200).json(createdBooking)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Something went wrong.' })
  }
})
