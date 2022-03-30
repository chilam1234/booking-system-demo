import React from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { useCallback } from "react";
import { TimeInput } from "@mantine/dates";
import { Button } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { validationsSchema } from "../utils/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { IBooking, IBookingForm } from "../types";

type BookingFormProps = {
  booking: IBooking;
  newBooking: Partial<IBookingForm>;
  createBookingCb?: (
    data: Partial<IBookingForm>,
    successCb: () => void,
    failCb: (err) => void
  ) => void;
  updateBookingCb?: (
    data: Partial<IBookingForm> & { id: string },
    successCb: () => void,
    failCb: (err) => void
  ) => void;
  deleteBookingCb?: (
    id: string,
    successCb: () => void,
    failCb: (err) => void
  ) => void;
};
export default function BookingForm({
  booking,
  newBooking,
  createBookingCb,
  updateBookingCb,
  deleteBookingCb,
}: BookingFormProps) {
  console.log(newBooking);
  const router = useRouter();
  const notifications = useNotifications();

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(validationsSchema),
    defaultValues: {
      start: new Date(
        booking?.data?.start ? booking?.data?.start : newBooking?.start ?? ""
      ),
      end: new Date(
        booking?.data?.end ? booking?.data?.end : newBooking?.end ?? ""
      ),
      room: booking ? booking.data.room : newBooking?.room ?? "c1",
      remarks: booking ? booking.data.remarks : "",
    },
  });

  const createBooking = useCallback(
    async (data) => {
      console.log(data);
      await createBookingCb(
        data,
        () => {
          router.push("/");
          notifications.showNotification({
            title: "Created the booking",
            color: "blue",
            message: "",
          });
        },
        (err) => {
          notifications.showNotification({
            title: "Cannot Create Booking",
            message: `${err.msg ?? err}`,
          });
        }
      );
    },
    [createBookingCb, notifications, router]
  );

  const deleteBooking = useCallback(
    async () =>
      deleteBookingCb(
        booking?.id,
        () => {
          router.push("/");
          notifications.showNotification({
            title: "Deleted the booking",
            color: "blue",
            message: "",
          });
        },
        (err) => {
          notifications.showNotification({
            title: "Cannot Delete Booking",
            message: err.msg ?? err,
            color: "red",
          });
        }
      ),
    [booking?.id, deleteBookingCb, notifications, router]
  );

  const updateBooking = useCallback(
    async (data) =>
      updateBookingCb(
        { data, id: booking.id },
        () => {
          notifications.showNotification({
            title: "Updated the booking",
            color: "blue",
            message: "",
          });
          router.push("/");
        },
        (err) => {
          notifications.showNotification({
            title: "Cannot update Booking",
            message: err.msg ?? err,
            color: "red",
          });
        }
      ),
    [booking?.id, notifications, router, updateBookingCb]
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
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
              <TimeInput
                label="Start"
                id="time"
                defaultValue={
                  booking?.data?.start
                    ? new Date(booking?.data?.start)
                    : newBooking?.start
                    ? new Date(newBooking?.start)
                    : ""
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
          render={({ field: { onChange, ref }, fieldState: { error } }) => (
            <>
              <TimeInput
                id="end"
                label="End"
                defaultValue={
                  booking?.data?.end
                    ? new Date(booking.data.end)
                    : newBooking?.end
                    ? new Date(newBooking?.end)
                    : ""
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
          render={({ field: { onChange }, fieldState: { error } }) => (
            <>
              <select
                defaultValue={
                  booking?.data?.room
                    ? booking?.data?.room
                    : newBooking?.room ?? "c1"
                }
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
          rows={3}
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
