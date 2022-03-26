export default function checkRole(user, res, room) {
  if (user['http://demo-day-system.com/roles'].length === 0) {
    return res.status(401).json({ msg: 'no correct roles' })
  }
  if (
    user['http://demo-day-system.com/roles'].includes('cola') &
    room.startsWith('p')
  ) {
    return res.status(401).json({ msg: 'not pepsi employee' })
  }
  if (
    user['http://demo-day-system.com/roles'].includes('pepsi') &
    room.startsWith('c')
  ) {
    return res.status(401).json({ msg: 'not cola employee' })
  }
}
