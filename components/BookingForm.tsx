import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { useCallback } from "react";
import { TimeInput } from "@mantine/dates";
import { Button, LoadingOverlay, NativeSelect, Textarea } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import { validationsSchema } from "../utils/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { IBooking, IBookingForm } from "../types";

type BookingFormProps = {
  booking?: IBooking;
  newBooking?: Partial<IBookingForm>;
  createBookingCb?: (
    data: Partial<IBookingForm>,
    successCb: () => void,
    failCb: (err) => void
  ) => void;
  updateBookingCb?: (
    { data, id }: { data: Partial<IBookingForm>; id: string },
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
  const router = useRouter();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await createBookingCb(
        data,
        () => {
          setLoading(false);
          router.push("/");
          notifications.showNotification({
            title: "Created the booking",
            color: "blue",
            message: "",
          });
        },
        (err) => {
          setLoading(false);
          notifications.showNotification({
            title: "Cannot Create Booking",
            message: `${err.msg ?? err}`,
            color: "red",
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
    async (data: Partial<IBookingForm>) => {
      setLoading(true);
      return updateBookingCb(
        { data, id: booking.id },
        () => {
          notifications.showNotification({
            title: "Updated the booking",
            color: "blue",
            message: "",
          });
          setLoading(false);
          router.push("/");
        },
        (err) => {
          setLoading(false);
          notifications.showNotification({
            title: "Cannot update Booking",
            message: err.msg ?? err,
            color: "red",
          });
        }
      );
    },
    [booking?.id, notifications, router, updateBookingCb]
  );
  const roomValues = useMemo(
    () =>
      Array(10)
        .fill("")
        .map((_, i) => [`c${i + 1}`, `p${i + 1}`])
        .flat(),
    []
  );

  return (
    <form
      onSubmit={handleSubmit(booking ? updateBooking : createBooking, (err) =>
        console.log(err)
      )}
    >
      <div style={{ width: 400, position: "relative" }}>
        <LoadingOverlay visible={loading} />
        <div className="mb-4">
          <Controller
            control={control}
            name="start"
            render={({ field: { onChange, ref }, fieldState: { error } }) => (
              <>
                <TimeInput
                  label="Start Time"
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
                  required
                  error={error ? error.message : undefined}
                />
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
                  label="End Time"
                  defaultValue={
                    booking?.data?.end
                      ? new Date(booking.data.end)
                      : newBooking?.end
                      ? new Date(newBooking?.end)
                      : ""
                  }
                  onChange={onChange}
                  ref={ref}
                  required
                  error={error ? error.message : undefined}
                />
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <Controller
            control={control}
            name="room"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <>
                <NativeSelect
                  defaultValue={
                    booking?.data?.room
                      ? booking?.data?.room
                      : newBooking?.room ?? "c1"
                  }
                  label="Room"
                  onChange={onChange}
                  data={roomValues}
                  required
                  error={error ? "Room is required" : undefined}
                />
              </>
            )}
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Remarks"
            name="remarks"
            id="remarks"
            placeholder="Remarks for your booking"
            {...register("remarks", { required: false })}
          />
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
      </div>
    </form>
  );
}
