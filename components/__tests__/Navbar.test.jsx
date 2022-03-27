import Navbar from "../Navbar";
import { render, screen } from "@testing-library/react";
import { UserProvider } from "@auth0/nextjs-auth0";

describe("Navbar", () => {
  describe("when user is not logged in ", () => {
    it("should not render the these", () => {
      render(
        <UserProvider>
          <Navbar user={undefined} isLoading={false} />
        </UserProvider>
      );
      expect(screen.queryByText("My bookings")).toBeNull();
      expect(screen.queryByText("Create Booking")).toBeNull();
      expect(screen.queryByText("Logout")).toBeNull();
      expect(screen.queryByText("Login")).toBeVisible();
    });
  });
  describe("when user is logged in ", () => {
    it("should render the these", () => {
      render(
        <UserProvider>
          <Navbar user={{ sub: 123 }} isLoading={false} />
        </UserProvider>
      );
      expect(screen.getByText("My bookings")).toBeVisible();
      expect(screen.getByText("Create Booking")).toBeVisible();
      expect(screen.getByText("Logout")).toBeVisible();
    });
  });
});
