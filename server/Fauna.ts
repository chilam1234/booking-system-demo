import faunadb from "faunadb";

const fuanaDB = (
  faunaClient = new faunadb.Client({ secret: process.env.FAUNA_SECRET })
) => {
  const q = faunadb.query;
  const getBookings = async () => {
    const { data } = await faunaClient.query<any>(
      q.Map(
        q.Paginate(q.Documents(q.Collection("bookings"))),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );
    const bookings = data.map((booking) => {
      booking.id = booking.ref.id;
      delete booking.ref;
      return booking;
    });

    return bookings;
  };

  const getBookingById = async (id: string) => {
    const booking = await faunaClient.query<any>(
      q.Get(q.Ref(q.Collection("bookings"), id))
    );
    booking.id = booking.ref.id;
    const { ref, ...noRefBooking } = booking;

    return noRefBooking;
  };

  const getBookingsByUser = async (userId: string) => {
    const { data } = await faunaClient.query<any>(
      q.Map(
        q.Paginate(q.Match(q.Index("bookings_by_user"), userId)),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );
    const bookings = data.map((booking) => {
      booking.id = booking.ref.id;
      delete booking.ref;
      return booking;
    });

    return bookings;
  };

  const isTimeOccupied = async ({
    time,
    room,
    id,
  }: {
    time: [string, string];
    room: string;
    id?: string;
  }) => {
    const { data: withinDate } = await faunaClient.query<any>(
      q.Map(
        q.Filter(
          q.Paginate(q.Documents(q.Collection("bookings"))),
          q.Lambda(
            "booking",
            q.Or(
              q.And(
                q.GTE(
                  q.Select(["data", "end"], q.Get(q.Var("booking"))),
                  time[1]
                ),
                q.LTE(
                  q.Select(["data", "start"], q.Get(q.Var("booking"))),
                  time[0]
                ),
                q.Equals(
                  q.Select(["data", "room"], q.Get(q.Var("booking"))),
                  room
                )
              ),
              q.And(
                q.LTE(
                  time[0],
                  q.Select(["data", "end"], q.Get(q.Var("booking")))
                ),
                q.LTE(
                  q.Select(["data", "start"], q.Get(q.Var("booking"))),
                  time[1]
                ),
                q.Equals(
                  q.Select(["data", "room"], q.Get(q.Var("booking"))),
                  room
                )
              )
            )
          )
        ),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );
    if (withinDate.length > 1) {
      return true;
    }

    if (withinDate.length === 1 && !id && withinDate[0]?.ref?.id !== id) {
      return true;
    }
    const { data } = await faunaClient.query<any>(
      q.Paginate(
        q.Intersection(
          q.Join(
            q.Range(
              q.Match(q.Index("bookings_by_start")),
              q.Time(time[0]),
              q.Time(time[1])
            ),
            q.Lambda(["start", "ref"], q.Match("tracks_by_ref", q.Var("ref")))
          ),
          q.Join(
            q.Range(
              q.Match(q.Index("bookings_by_end")),
              q.Time(time[0]),
              q.Time(time[1])
            ),
            q.Lambda(["start", "ref"], q.Match("tracks_by_ref", q.Var("ref")))
          ),
          q.Match(q.Index("booking_by_room"), room)
        )
      )
    );
    if (id && data.length === 1 && data[0]?.id === id) {
      return false;
    }

    return data.length > 0;
  };

  const createBooking = async ({
    start,
    end,
    room,
    remarks,
    userId,
    username,
  }: {
    start: string;
    end: string;
    room: string;
    remarks: string;
    userId: string;
    username: string;
  }) => {
    if (await isTimeOccupied({ time: [start, end], room })) {
      throw new Error("Time is already occupied");
    }
    return await faunaClient.query(
      q.Create(q.Collection("bookings"), {
        data: {
          start,
          end,
          room,
          remarks,
          userId,
          username,
        },
      })
    );
  };

  const updateBooking = async ({
    id,
    start,
    end,
    room,
    remarks,
    userId,
    username,
  }: {
    id: string;
    start: string;
    end: string;
    room: string;
    remarks: string;
    userId: string;
    username: string;
  }) => {
    if (await isTimeOccupied({ time: [start, end], room, id })) {
      throw new Error("Time is already occupied");
    }
    return await faunaClient.query(
      q.Update(q.Ref(q.Collection("bookings"), id), {
        data: { start, end, room, remarks, userId, username },
      })
    );
  };

  const deleteBooking = async (id: string) => {
    return await faunaClient.query(
      q.Delete(q.Ref(q.Collection("bookings"), id))
    );
  };
  return {
    createBooking,
    getBookings,
    getBookingById,
    getBookingsByUser,
    updateBooking,
    deleteBooking,
  };
};

export default fuanaDB;
