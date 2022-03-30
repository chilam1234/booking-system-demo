import { getBookingsByUser } from "../../utils/Fauna";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getSession(req, res);

  if (req.method !== "GET") {
    return res.status(405);
  }
  try {
    const snippets = await getBookingsByUser(session.user.sub);
    return res.status(200).json(snippets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Something went wrong." });
  }
});
