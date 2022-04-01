import { NextApiRequest, NextApiResponse } from "next";
import faunaDb from "../../utils/Fauna";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405);
  }
  const { getBookings } = faunaDb();
  try {
    const bookings = await getBookings();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong." });
  }
}
