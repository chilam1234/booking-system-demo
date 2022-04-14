import { logRoles, render, screen } from "@testing-library/react";
import Calendar from "../Calendar";
import { DateTime } from "luxon";

jest.mock("next/router", () => require("next-router-mock"));
describe("Calendar", () => {
  it("should render with books", () => {
    const { container } = render(
      <Calendar
        bookings={[
          {
            id: "ok",
            data: {
              start: new Date().toISOString(),
              end: new Date().toISOString(),
              room: "c1",
              remarks: "happy",
              userId: "testingUser",
              username: "testingUser",
            },
          },
        ]}
      />
    );
    expect(screen.getByText("Room c1")).toBeVisible();
    expect(
      screen.getByTitle(
        new RegExp(
          `${DateTime.now().hour}:${DateTime.now().minute} – ${
            DateTime.now().hour
          }:${DateTime.now().minute}`
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText("testingUser")).toBeInTheDocument();
  });
});
