import Booking from "../Booking";
import { render, screen } from "@testing-library/react";
describe("Booking", () => {
  describe("when there are bookings and user is logged in but no user's bookings", () => {
    it("should render the booking details correctly but no edit", () => {
      render(
        <Booking
          booking={{
            data: {
              start: "2011-10-10T14:48:00.000Z",
              end: "2011-10-10T18:48:00.000Z",
              room: "test room",
              remarks: "testing remarks",
            },
          }}
          user={{ sub: "123" }}
        />
      );
      expect(screen.getByText("Room - test room")).toBeVisible();
      expect(screen.getByText("testing remarks")).toBeVisible();
      expect(screen.queryByRole("button", { name: "Edit" })).toBeNull();
      const times = screen.getAllByRole("textbox");
      expect(times.length).toBe(4);
      expect(times.find((ele) => ele.value === "22")).toBeTruthy();
      expect(times.filter((ele) => ele.value === "48").length).toEqual(2);
      expect(times.find((ele) => ele.value === "02")).toBeTruthy();
    });
  });
  describe("when there are bookings and user is logged in and it is user's bookings", () => {
    it("should render the booking details correctly and have edit", () => {
      render(
        <Booking
          booking={{
            id: "testing",
            data: {
              start: "2011-10-10T14:48:00.000Z",
              end: "2011-10-10T18:48:00.000Z",
              room: "test room",
              remarks: "testing remarks",
              userId: "123",
            },
          }}
          user={{ sub: "123" }}
        />
      );
      expect(screen.getByText("Room - test room")).toBeVisible();
      expect(screen.getByText("testing remarks")).toBeVisible();
      const editLink = screen.getByRole("link", { name: "Edit" });
      expect(editLink).toBeVisible();
      expect(editLink).toHaveAttribute("href", "/edit/testing");
      const times = screen.getAllByRole("textbox");
      expect(times.length).toBe(4);
      expect(times.find((ele) => ele.value === "22")).toBeTruthy();
      expect(times.filter((ele) => ele.value === "48").length).toEqual(2);
      expect(times.find((ele) => ele.value === "02")).toBeTruthy();
    });
  });
});
