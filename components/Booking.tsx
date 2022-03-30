import React, { useMemo } from "react";

import Link from "next/link";

import { TimeRangeInput } from "@mantine/dates";
import { UserProfile } from "@auth0/nextjs-auth0";
import { IBooking } from "../types";
import isLaterOrEqualDateTime from "../utils/isLaterDateTime";
import { DateTime } from "luxon";
import { Badge } from "@mantine/core";

type BookingProps = {
  user?: UserProfile;
  booking: IBooking;
};
export default function Booking({ booking, user }: BookingProps) {
  const timePassed = useMemo(
    () =>
      isLaterOrEqualDateTime(
        DateTime.now().toUTC(),
        DateTime.fromISO(booking?.data?.start)
      ),
    []
  );
  return (
    <div className="bg-gray-100 p-4 rounded-md my-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h2 className="text-xl text-gray-800 font-bold">
            Room - {booking.data.room}
          </h2>
          {timePassed && (
            <Badge
              className="ml-2"
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              Expired Booking
            </Badge>
          )}
        </div>

        <TimeRangeInput
          value={[new Date(booking?.data?.start), new Date(booking?.data?.end)]}
          readOnly
        />
      </div>
      <h3 className="text-md text-gray-800 font-bold mb-2">Remarks</h3>
      <p className="text-gray-900 mb-4">{booking.data.remarks}</p>
      {user?.sub === booking.data.userId && !timePassed && (
        <Link href={`/edit/${booking.id}`}>
          <a className="text-gray-800 mr-2">Edit</a>
        </Link>
      )}
    </div>
  );
}
