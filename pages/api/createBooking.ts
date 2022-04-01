import faunaDb from "../../utils/Fauna";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import checkRole from "../../utils/checkRole";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
import isLaterDateTime from "../../utils/isLaterDateTime";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { createBooking } = faunaDb();
  const session = getSession(req, res);
  const userId = session.user.sub;
  const { start, end, room, remarks } = req.body;
  if (isLaterDateTime(DateTime.now(), DateTime.fromISO(start))) {
    return res
      .status(400)
      .json({ msg: "Start time should be later than now." });
  }
  if (!checkRole(session.user, res, room)) {
    return;
  }
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
      return res.status(400).json({ msg: "Time has already been booked." });
    }
    return res.status(500).json({ msg: "Something went wrong." });
  }
});
