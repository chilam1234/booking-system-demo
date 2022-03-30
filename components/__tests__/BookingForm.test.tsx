import { NotificationsProvider } from "@mantine/notifications";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "../BookingForm";
import { createBooking, updateBooking, deleteBooking } from "../../actions";
jest.mock("next/router", () => require("next-router-mock"));

describe("BookingForm", () => {
  describe("when it is create booking", () => {
    it("should have a empty with default values", () => {
      render(
        <NotificationsProvider>
          <BookingForm />
        </NotificationsProvider>
      );
      expect(screen.getByText("Booking Time")).toBeVisible();
      const start = screen.getByRole("textbox", { name: "Start" });
      expect(start).toBeVisible();
      expect(start).toHaveValue("");
      expect(start).toHaveAttribute("placeholder", "--");

      const end = screen.getByRole("textbox", { name: "End" });
      expect(end).toBeVisible();
      expect(end).toHaveValue("");
      expect(start).toHaveAttribute("placeholder", "--");

      const minutes = screen.getAllByRole("textbox", { name: "" });
      expect(minutes.length).toBe(2);
      expect(minutes.filter((ele) => ele.value === "").length).toEqual(2);
      expect(minutes.filter((ele) => ele.placeholder === "--").length).toEqual(
        2
      );

      const remarks = screen.getByRole("textbox", { name: "Remarks" });
      expect(remarks).toBeVisible();
      expect(remarks).toHaveValue("");
      expect(remarks).toHaveAttribute(
        "placeholder",
        "remarks for your booking"
      );

      const roomSelect = screen.getByRole("combobox", { name: "" });
      expect(roomSelect).toBeVisible();
      const roomOptions = screen.getAllByRole("option");
      expect(roomOptions.length).toBe(20);
      const selected = screen.getByRole("option", { name: "c1" });
      expect(selected).toHaveAttribute("selected");
      expect(new Set(roomOptions).size).toBe(20);
      expect(
        roomOptions.filter(
          (ele) => ele.value.startsWith("c") | ele.value.startsWith("p")
        ).length
      ).toBe(20);

      const save = screen.getByRole("button", { name: "Save" });
      expect(save).toBeVisible();

      const cancel = screen.getByRole("link", { name: "Cancel" });
      expect(cancel).toBeVisible();
    });
    describe("when I click save without typing any data", () => {
      it("should show errors", async () => {
        render(
          <NotificationsProvider>
            <BookingForm />
          </NotificationsProvider>
        );
        const save = screen.getByRole("button", { name: "Save" });
        userEvent.click(save);
        expect(
          (await screen.findAllByText("This field is required")).length
        ).toEqual(2);
      });
    });
    describe("when I click save with proper data filled in", () => {
      it("should create the booking", async () => {
        render(
          <NotificationsProvider>
            <BookingForm createBookingCb={createBooking} />
          </NotificationsProvider>
        );
        const start = screen.getByRole("textbox", { name: "Start" });
        userEvent.type(start, "10");
        const end = screen.getByRole("textbox", { name: "End" });
        userEvent.type(end, "11");
        const minutes = screen.getAllByRole("textbox", { name: "" });
        minutes.forEach((ele) => userEvent.type(ele, "00"));
        const save = screen.getByRole("button", { name: "Save" });
        userEvent.click(save);
        await waitFor(() => screen.getByText("Created the booking"));
      });
    });

    describe("when I click save with end time less than start time", () => {
      it("should show error", async () => {
        render(
          <NotificationsProvider>
            <BookingForm createBookingCb={createBooking} />
          </NotificationsProvider>
        );
        const start = screen.getByRole("textbox", { name: "Start" });
        userEvent.type(start, "11");
        const end = screen.getByRole("textbox", { name: "End" });
        userEvent.type(end, "10");
        const minutes = screen.getAllByRole("textbox", { name: "" });
        minutes.forEach((ele) => userEvent.type(ele, "00"));
        const save = screen.getByRole("button", { name: "Save" });
        userEvent.click(save);
        expect(
          await screen.findByText("End must later than start")
        ).toBeVisible();
      });
    });
  });
  describe("when it is update booking", () => {
    it("should have loaded booking values into form", () => {
      render(
        <NotificationsProvider>
          <BookingForm
            booking={{
              ts: 1648354929210000,
              data: {
                start: "2022-03-26T17:00:00.555Z",
                end: "2022-03-26T18:00:00.635Z",
                room: "p1",
                remarks: "asdasdasd",
                userId: "google-oauth2|112017502625468671953",
              },
              id: "327256303278752329",
            }}
          />
        </NotificationsProvider>
      );
      expect(screen.getByText("Booking Time")).toBeVisible();
      const start = screen.getByRole("textbox", { name: "Start" });
      expect(start).toBeVisible();
      expect(start).toHaveValue("01");
      expect(start).toHaveAttribute("placeholder", "--");

      const end = screen.getByRole("textbox", { name: "End" });
      expect(end).toBeVisible();
      expect(end).toHaveValue("02");
      expect(start).toHaveAttribute("placeholder", "--");

      const minutes = screen.getAllByRole("textbox", { name: "" });
      expect(minutes.length).toBe(2);
      expect(minutes.filter((ele) => ele.value === "00").length).toEqual(2);
      expect(minutes.filter((ele) => ele.placeholder === "--").length).toEqual(
        2
      );

      const remarks = screen.getByRole("textbox", { name: "Remarks" });
      expect(remarks).toBeVisible();
      expect(remarks).toHaveValue("asdasdasd");
      expect(remarks).toHaveAttribute(
        "placeholder",
        "remarks for your booking"
      );

      const roomSelect = screen.getByRole("combobox", { name: "" });
      expect(roomSelect).toBeVisible();
      const roomOptions = screen.getAllByRole("option");
      expect(roomOptions.length).toBe(20);
      const selected = screen.getByRole("option", { name: "p1" });
      expect(selected).toHaveAttribute("selected");
      expect(new Set(roomOptions).size).toBe(20);
      expect(
        roomOptions.filter(
          (ele) => ele.value.startsWith("c") | ele.value.startsWith("p")
        ).length
      ).toBe(20);

      const save = screen.getByRole("button", { name: "Save" });
      expect(save).toBeVisible();

      const cancel = screen.getByRole("link", { name: "Cancel" });
      expect(cancel).toBeVisible();

      const deleteBtn = screen.getByRole("button", { name: "Delete" });
      expect(deleteBtn).toBeVisible();
    });

    describe("when I click save without typing any data", () => {
      it("should able to save", async () => {
        render(
          <NotificationsProvider>
            <BookingForm
              booking={{
                ts: 1648354929210000,
                data: {
                  start: "2022-03-26T17:00:00.555Z",
                  end: "2022-03-26T18:00:00.635Z",
                  room: "p1",
                  remarks: "asdasdasd",
                  userId: "google-oauth2|112017502625468671953",
                },
                id: "327256303278752329",
              }}
              updateBookingCb={updateBooking}
            />
          </NotificationsProvider>
        );
        const save = screen.getByRole("button", { name: "Save" });
        userEvent.click(save);
        expect(await screen.findByText("Updated the booking")).toBeVisible();
      });
    });
    describe("when I click save with end time less than start time", () => {
      it("should show error", async () => {
        render(
          <NotificationsProvider>
            <BookingForm
              booking={{
                ts: 1648354929210000,
                data: {
                  start: "2022-03-26T17:00:00.555Z",
                  end: "2022-03-26T18:00:00.635Z",
                  room: "p1",
                  remarks: "asdasdasd",
                  userId: "google-oauth2|112017502625468671953",
                },
                id: "327256303278752329",
              }}
              updateBookingCb={updateBooking}
            />
          </NotificationsProvider>
        );
        const start = screen.getByRole("textbox", { name: "Start" });
        userEvent.type(start, "11");
        const end = screen.getByRole("textbox", { name: "End" });
        userEvent.type(end, "10");
        const minutes = screen.getAllByRole("textbox", { name: "" });
        minutes.forEach((ele) => userEvent.type(ele, "00"));
        const save = screen.getByRole("button", { name: "Save" });
        userEvent.click(save);
        expect(
          await screen.findByText("End must later than start")
        ).toBeVisible();
      });
    });

    describe("when I click Delete button", () => {
      it("should show deleted", async () => {
        render(
          <NotificationsProvider>
            <BookingForm
              booking={{
                ts: 1648354929210000,
                data: {
                  start: "2022-03-26T17:00:00.555Z",
                  end: "2022-03-26T18:00:00.635Z",
                  room: "p1",
                  remarks: "asdasdasd",
                  userId: "google-oauth2|112017502625468671953",
                },
                id: "327256303278752329",
              }}
              updateBookingCb={updateBooking}
              deleteBookingCb={deleteBooking}
            />
          </NotificationsProvider>
        );

        const deleteBtn = screen.getByRole("button", { name: "Delete" });
        userEvent.click(deleteBtn);
        expect(await screen.findByText("Deleted the booking")).toBeVisible();
      });
    });
  });
});
