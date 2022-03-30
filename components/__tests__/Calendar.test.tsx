import { logRoles, render, screen } from "@testing-library/react";
import Calendar from "../Calendar";

jest.mock("next/router", () => require("next-router-mock"));
describe("Calendar", () => {
  it("should render with books", () => {
    render(
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
            },
          },
        ]}
      />
    );
    expect(screen.getByText("Room c1")).toBeVisible();
    expect(screen.getByText("happy")).toBeVisible();
  });
});
