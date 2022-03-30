import { Claims } from "@auth0/nextjs-auth0";

export default function checkRole(user: Claims, res, room) {
  if (user["http://demo-day-system.com/roles"].length === 0) {
    return res.status(401).json({ msg: "no correct roles" });
  }
  const roles = user["http://demo-day-system.com/roles"];
  if (roles.includes("cola") && room.startsWith("p")) {
    return res.status(401).json({ msg: "not pepsi employee" });
  }
  if (roles.includes("pepsi") && room.startsWith("c")) {
    return res.status(401).json({ msg: "not cola employee" });
  }
}
