import faunaDb from "../../server/Fauna";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import checkRole from "../../utils/checkRole";
import { NextApiRequest, NextApiResponse } from "next";
import { DateTime } from "luxon";
import isLaterDateTime from "../../utils/isLaterDateTime";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { getBookingById, updateBooking } = faunaDb();
  const session = getSession(req, res);
  const userId = session.user.sub;

  if (req.method !== "PUT") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  const { id, start, end, room, remarks } = req.body;
  if (isLaterDateTime(DateTime.now(), DateTime.fromISO(start))) {
    res.status(400).json({ msg: "Start time should be later than now." });
  }
  if (!checkRole(session.user, res, room)) {
    return;
  }
  const existingRecord = await getBookingById(id);
  if (!existingRecord || existingRecord.data.userId !== userId) {
    res.statusCode = 404;
    return res.json({ msg: "Record not found" });
  }

  try {
    const updated = await updateBooking({
      id,
      start,
      end,
      room,
      remarks,
      userId,
      username: session.user.name,
    });
    return res.status(200).json(updated);
  } catch (err) {
    if (err.message === "Time is already occupied") {
      res.status(400).json({ msg: "Time has already been booked." });
    } else {
      res.status(500).json({ msg: "Something went wrong." });
    }
  }
});
