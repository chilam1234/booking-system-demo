import { createBooking } from "../../utils/Fauna";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import checkRole from "../../utils/checkRole";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession(req, res);
  const userId = session.user.sub;
  console.log("session user", session);
  const { start, end, room, remarks } = req.body;
  checkRole(session.user, res, room);
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }
  try {
    const createdBooking = await createBooking({
      start,
      end,
      room,
      remarks,
      userId,
    });
    return res.status(200).json(createdBooking);
  } catch (err) {
    console.log(err);
    if (err.message === "Time is already occupied") {
      res.status(400).json({ msg: "Time has already been booked." });
    } else {
      res.status(500).json({ msg: "Something went wrong." });
    }
  }
});
