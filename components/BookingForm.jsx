import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback } from "react";
import { TimeRangeInput } from "@mantine/dates";
import { Button } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";

export default function BookingForm({ booking }) {
  const notifications = useNotifications();

  const { register, handleSubmit, errors, control } = useForm({
    defaultValues: {
      time: booking ? booking.data.time : [new Date(), new Date()],
      room: booking ? booking.data.room : "c1",
      remarks: booking ? booking.data.remarks : "",
    },
  });
  const router = useRouter();

  const createBooking = useCallback(async (data) => {
    const { time, room, remarks } = data;
    try {
      const response = await fetch("/api/createBooking", {
        method: "POST",
        body: JSON.stringify({ time, room, remarks }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        router.push("/");
      } else {
        notifications.showNotification({
          title: "Cannot Create Booking",
          message: response.statusText,
        });
      }
    } catch (err) {
      notifications.showNotification({
        title: "Cannot Create Booking",
        message: err,
      });
    }
  }, []);

  const deleteBooking = useCallback(async () => {
    try {
      const response = await fetch("/api/deleteBooking", {
        method: "DELETE",
        body: JSON.stringify({ id: booking.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        router.push("/");
      } else {
        notifications.showNotification({
          title: "Cannot delete Booking",
          message: response.statusText,
        });
      }
    } catch (err) {
      console.error(err);
      notifications.showNotification({
        title: "Cannot Delete Booking",
        message: err,
      });
    }
  }, [booking]);

  const updateBooking = useCallback(
    async (data) => {
      const { time, room, remarks } = data;
      const id = booking.id;
      try {
        const response = await fetch("/api/updateBooking", {
          method: "PUT",
          body: JSON.stringify({ id, time, room, remarks }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          router.push("/");
        } else {
          notifications.showNotification({
            title: "Cannot Update Booking",
            message: response.statusText,
          });
        }
      } catch (err) {
        notifications.showNotification({
          title: "Cannot Update Booking",
          message: err,
        });
        console.error(err);
      }
    },
    [booking]
  );
  const RoomOptions = new Array(10).fill("").map((_, i) => {
    return (
      <>
        <option key={`c${i + 1}`} value={`c${i + 1}`}>
          c{i + 1}
        </option>
        <option key={`p${i + 1}`} value={`p${i + 1}`}>
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
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
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
              {error && (
                <p className="font-bold text-red-900">Time is required</p>
              )}
            </>
          )}
        />
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
          render={({ field: { onChange }, fieldState: { error } }) => (
            <>
              <select
                defaultValue={booking?.data?.room ?? "c1"}
                onChange={onChange}
                className="w-full border bg-white rounded px-3 py-2 outline-none text-gray-700"
              >
                {RoomOptions}
              </select>
              {error && (
                <p className="font-bold text-red-900">Room is required</p>
              )}
            </>
          )}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-red-100 text-sm font-bold mb-1"
          htmlFor="remarks"
        >
          Remarks
        </label>
        <textarea
          name="remarks"
          id="remarks"
          rows="3"
          className="resize-none w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          placeholder="remarks for your booking"
          {...register("remarks", { required: false })}
        ></textarea>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            type="submit"
            size="md"
            className="mr-3"
          >
            Save
          </Button>
          <Link href="/" passHref>
            <Button component="a" size="md" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>

        {booking && (
          <Button
            variant="gradient"
            gradient={{ from: "red", to: "dark" }}
            size="md"
            className="mr-2"
            type="button"
            onClick={deleteBooking}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
