import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback } from "react";
import { TimeInput } from "@mantine/dates";
import { Button } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { validationsSchema } from "../utils/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";

export default function BookingForm({
  booking,
  createBookingCb,
  updateBookingCb,
  deleteBookingCb,
}) {
  const notifications = useNotifications();

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(validationsSchema),
    defaultValues: {
      start: new Date(booking?.data?.start),
      end: new Date(booking?.data?.end),
      room: booking ? booking.data.room : "c1",
      remarks: booking ? booking.data.remarks : "",
    },
  });
  const router = useRouter();

  const createBooking = useCallback(async (data) => {
    console.log(data);
    await createBookingCb(
      data,
      () => {
        router.push("/");
        notifications.showNotification({
          title: "Created the booking",
          color: "blue",
        });
      },
      (err) => {
        notifications.showNotification({
          title: "Cannot Create Booking",
          message: `${err.msg ?? err}`,
        });
      }
    );
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
        notifications.showNotification({
          title: "Deleted the booking",
          color: "blue",
        });
        return;
      }
      const err = await response.json();
      notifications.showNotification({
        title: "Cannot Delete Booking",
        message: `${response.statusText}: ${err.msg}`,
      });
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
      const { start, end, room, remarks } = data;
      const id = booking.id;
      try {
        const response = await fetch("/api/updateBooking", {
          method: "PUT",
          body: JSON.stringify({ id, start, end, room, remarks }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          notifications.showNotification({
            title: "Updated the booking",
            color: "blue",
          });
          router.push("/");
          return;
        }
        const err = await response.json();
        notifications.showNotification({
          title: "Cannot Update Booking",
          message: `${response.statusText}: ${err.msg}`,
        });
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
    <form
      onSubmit={handleSubmit(booking ? updateBooking : createBooking, (err) =>
        console.log(err)
      )}
    >
      <div className="mb-4">
        <label
          className="block text-red-100 text-sm font-bold mb-1"
          htmlFor="name"
        >
          Booking Time
        </label>
        <Controller
          control={control}
          name="start"
          rules={[{ required: true }]}
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
              <TimeInput
                label="Start"
                id="time"
                defaultValue={
                  booking?.data?.start ? new Date(booking?.data?.start) : ""
                }
                onChange={onChange}
                ref={ref}
              />
              {error && (
                <p className="font-bold text-red-600">{error.message}</p>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="end"
          rules={[{ required: true }]}
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
              <TimeInput
                id="end"
                label="End"
                defaultValue={
                  booking?.data?.end ? new Date(booking?.data?.end) : ""
                }
                onChange={onChange}
                ref={ref}
              />
              {error && (
                <p className="font-bold text-red-600">{error.message}</p>
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
