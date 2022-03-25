import React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback } from "react";
import { TimeRangeInput } from "@mantine/dates";

export default function BookingForm({ booking }) {
  console.log(booking);
  const { register, handleSubmit, errors, control } = useForm({
    defaultValues: {
      time: booking ? booking.data.time : [new Date(), new Date()],
      room: booking ? booking.data.room : "c1",
      remarks: booking ? booking.data.remarks : "",
    },
  });

  const ok = useWatch({ control });
  console.log(ok);
  const router = useRouter();

  const createBooking = useCallback(async (data) => {
    const { time, room, remarks } = data;
    try {
      await fetch("/api/createBooking", {
        method: "POST",
        body: JSON.stringify({ time, room, remarks }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteBooking = useCallback(async () => {
    try {
      await fetch("/api/deleteBooking", {
        method: "DELETE",
        body: JSON.stringify({ id: booking.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }, [booking]);

  const updateBooking = useCallback(
    async (data) => {
      const { time, room, remarks } = data;
      const id = booking.id;
      try {
        await fetch("/api/updateBooking", {
          method: "PUT",
          body: JSON.stringify({ id, time, room, remarks }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        router.push("/");
      } catch (err) {
        console.error(err);
      }
    },
    [booking]
  );
  const RoomOptions = new Array(10).fill("").map((_, i) => {
    return (
      <>
        <option key={`c${i}`} value={`c${i + 1}`}>
          c{i + 1}
        </option>
        <option key={`p${i}`} value={`p${i + 1}`}>
          p{i + 1}
        </option>
      </>
    );
  });

  return (
    <form onSubmit={handleSubmit(booking ? updateBooking : createBooking)}>
      <div className="mb-4">
        <label
          className="block text-red-100 text-sm font-bold mb-1"
          htmlFor="name"
        >
          Booking Time
        </label>
        <Controller
          control={control}
          name="time"
          rules={[{ required: true }]}
          render={({ field: { onChange, ref } }) => (
            <TimeRangeInput
              type="text"
              id="time"
              defaultValue={[
                new Date(booking?.data?.time[0]),
                new Date(booking?.data?.time[1]),
              ]}
              onChange={onChange}
              ref={ref}
            />
          )}
        />

        {errors?.time && (
          <p className="font-bold text-red-900">Time is required</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-red-100 text-sm font-bold mb-1"
          htmlFor="description"
        >
          Room
        </label>

        <Controller
          control={control}
          name="room"
          rules={[{ required: true }]}
          render={({ field: { onChange } }) => (
            <select
              defaultValue={booking?.data?.room ?? "c1"}
              onChange={onChange}
              className="w-full border bg-white rounded px-3 py-2 outline-none text-gray-700"
            >
              {RoomOptions}
            </select>
          )}
        />
        {errors?.room && (
          <p className="font-bold text-red-900">Room is required</p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-red-100 text-sm font-bold mb-1"
          htmlFor="description"
        >
          Remarks
        </label>
        <textarea
          name="remarks"
          id="remarks"
          rows="3"
          className="resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          placeholder="What does the booking do?"
          {...register("remarks", { required: false })}
        ></textarea>
      </div>
      <button
        className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
        type="submit"
      >
        Save
      </button>
      <Link href="/">
        <a className="mt-3 inline-block bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          Cancel
        </a>
      </Link>
      {booking && (
        <button
          className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          type="button"
          onClick={deleteBooking}
        >
          Delete
        </button>
      )}
    </form>
  );
}
