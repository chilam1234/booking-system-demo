import getFauna from "../Fauna";
import faunadb from "faunadb";
import { DateTime } from "luxon";

describe("fauna", () => {
  let fauna: ReturnType<typeof getFauna>;
  let faunaClient: faunadb.Client;
  const q = faunadb.query;
  beforeAll(async () => {
    faunaClient = new faunadb.Client({
      secret: process.env.FAUNA_SECRET,
      domain: "localhost",
      port: 8443,
      scheme: "http",
    });
    fauna = getFauna(faunaClient);

    const collections = await faunaClient.query(q.Paginate(q.Collections()));
    if (collections?.data.length === 0) {
      await faunaClient.query(q.CreateCollection({ name: "bookings" }));
    }
    const indexes = await faunaClient.query(q.Paginate(q.Indexes()));
    if (indexes?.data.length === 0) {
      await faunaClient.query(
        q.CreateIndex({
          name: "booking_by_room",
          unique: false,
          serialized: true,
          source: q.Collection("bookings"),
          terms: [
            {
              field: ["data", "room"],
            },
          ],
        })
      );
      await faunaClient.query(
        q.CreateIndex({
          name: "tracks_by_ref",
          unique: false,
          serialized: true,
          source: q.Collection("bookings"),
          terms: [
            {
              field: ["ref"],
            },
          ],
          values: [
            {
              field: ["ref"],
            },
          ],
        })
      );

      await faunaClient.query(
        q.CreateIndex({
          name: "bookings_by_start",
          source: [
            {
              collection: q.Collection("bookings"),
              fields: {
                start: q.Query(
                  q.Lambda(
                    "booking",
                    q.Date(q.Select(["data", "start"], q.Var("booking")))
                  )
                ),
              },
            },
          ],
          values: [{ binding: "start" }, { field: ["ref"] }],
        })
      );
      await faunaClient.query(
        q.CreateIndex({
          name: "bookings_by_end",
          source: [
            {
              collection: q.Collection("bookings"),
              fields: {
                end: q.Query(
                  q.Lambda(
                    "booking",
                    q.Date(q.Select(["data", "end"], q.Var("booking")))
                  )
                ),
              },
            },
          ],
          values: [{ binding: "end" }, { field: ["ref"] }],
        })
      );
    }
  });
  it("should be able to connect to fauna", () => {
    expect(fauna).toBeTruthy();
  });
  it("should able to create one", async () => {
    const result = await fauna.createBooking({
      start: DateTime.now().plus({ minute: 20 }).toISO().toString(),
      end: DateTime.now().plus({ minute: 30 }).toISO().toString(),
      room: "c1",
      remarks: "asdasd",
      userId: "asdasd",
      username: "asdasd",
    });
  });

  it("should not able to create when same room and same time", async () => {
    try {
      await fauna.createBooking({
        start: DateTime.now().plus({ minute: 20 }).toISO().toString(),
        end: DateTime.now().plus({ minute: 30 }).toISO().toString(),
        room: "c1",
        remarks: "ok",
        userId: "ok",
        username: "testing",
      });
    } catch (err) {
      expect(err.message).toBe("Time is already occupied");
    }
  });
  it("should not able to create when same room and overlapping time", async () => {
    try {
      await fauna.createBooking({
        start: DateTime.now().plus({ minute: 10 }).toISO().toString(),
        end: DateTime.now().plus({ minute: 30 }).toISO().toString(),
        room: "c1",
        remarks: "ok",
        userId: "ok",
        username: "testing",
      });
    } catch (err) {
      expect(err.message).toBe("Time is already occupied");
    }
  });
  it("should not able to create when same room and overlapping time (within)", async () => {
    try {
      await fauna.createBooking({
        start: DateTime.now().plus({ minute: 21 }).toISO().toString(),
        end: DateTime.now().plus({ minute: 29 }).toISO().toString(),
        room: "c1",
        remarks: "ok",
        userId: "ok",
        username: "testing",
      });
    } catch (err) {
      expect(err.message).toBe("Time is already occupied");
    }
  });
  it("should not able to create when same room and overlapping time, start later then existing start", async () => {
    try {
      await fauna.createBooking({
        start: DateTime.now().plus({ minute: 21 }).toISO().toString(),
        end: DateTime.now().plus({ minute: 32 }).toISO().toString(),
        room: "c1",
        remarks: "ok",
        userId: "ok",
        username: "testing",
      });
    } catch (err) {
      expect(err.message).toBe("Time is already occupied");
    }
  });
  afterAll(async () => {
    await faunaClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("bookings")), { size: 9999 }),
        q.Lambda(["ref"], q.Delete(q.Var("ref")))
      )
    );
  });
});
