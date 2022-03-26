import { createBooking } from '../../utils/Fauna'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import checkRole from '../../utils/checkRole'

export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res)
  const userId = session.user.sub
  console.log('session user', session)
  const { time, room, remarks } = req.body
  checkRole(session.user, res, room)
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
