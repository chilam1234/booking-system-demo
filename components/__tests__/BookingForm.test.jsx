import { NotificationsProvider } from "@mantine/notifications";
import { logRoles, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "../BookingForm";

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
      it("should show errors", async () => {
        render(
          <NotificationsProvider>
            <BookingForm />
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
        expect(
          (await screen.findAllByText("This field is required")).length
        ).toEqual(2);
      });
    });
  });
});
