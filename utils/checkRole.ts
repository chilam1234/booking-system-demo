import { Claims } from "@auth0/nextjs-auth0";
import { NextApiResponse } from "next";

export default function checkRole(
  user: Claims,
  res: NextApiResponse,
  room: string
) {
  if (user["http://demo-day-system.com/roles"].length === 0) {
    res.status(401).json({ msg: "no correct roles" });
    return false;
  }
  const roles = user["http://demo-day-system.com/roles"];
  if (roles.includes("cola") && room.startsWith("p")) {
    res.status(401).json({ msg: "not pepsi employee" });
    return false;
  }
  if (roles.includes("pepsi") && room.startsWith("c")) {
    res.status(401).json({ msg: "not cola employee" });
    return false;
  }
  return true;
}
