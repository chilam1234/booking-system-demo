import React from "react";

import Link from "next/link";

import { TimeRangeInput } from "@mantine/dates";

export default function Booking({ booking, user }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md my-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl text-gray-800 font-bold">
          Room - {booking.data.room}
        </h2>
        <TimeRangeInput
          value={[new Date(booking?.data?.start), new Date(booking?.data?.end)]}
          readOnly
        />
      </div>
      <h3 className="text-md text-gray-800 font-bold mb-2">Remarks</h3>
      <p className="text-gray-900 mb-4">{booking.data.remarks}</p>
      {user && user.sub === booking.data.userId && (
        <Link href={`/edit/${booking.id}`}>
          <a className="text-gray-800 mr-2">Edit</a>
        </Link>
      )}
    </div>
  );
}
