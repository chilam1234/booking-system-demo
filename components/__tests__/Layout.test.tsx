import Layout from "../Layout";
import { render, screen } from "@testing-library/react";
import Auth from "@auth0/nextjs-auth0";
jest.mock("@auth0/nextjs-auth0", () => {
  return {
    UserProvider: ({ children }) => children,
    useUser: jest.fn(() => ({
      user: { sub: 123 },
      isLoading: false,
    })),
  };
});
afterEach(() => {
  jest.clearAllMocks();
});
describe("Layout", () => {
  jest.spyOn(Auth, "UserProvider").mockReturnValue(({ children }) => children);
  describe("when user is logged in", () => {
    it("should render the following info", () => {
      const spy = jest
        .spyOn(Auth, "useUser")
        .mockReturnValue({ user: { sub: "123" }, isLoading: false } as any);
      render(
        <Layout>
          <p>Hello</p>
        </Layout>
      );
      screen.debug();
      expect(screen.getByText("One Day Room Booking System")).toBeVisible();
      expect(screen.getByText("Hello")).toBeVisible();
      expect(screen.getByText("My bookings")).toBeVisible();
      expect(screen.getByText("Create Booking")).toBeVisible();
      expect(screen.getByText("Logout")).toBeVisible();
      spy.mockReset();
      spy.mockRestore();
    });
  });
  describe("when user is not logged in", () => {
    it("should render the following info", () => {
      const spy = jest
        .spyOn(Auth, "useUser")
        .mockReturnValue({ isLoading: false } as any);
      render(
        <Layout>
          <p>Hello</p>
        </Layout>
      );
      expect(screen.getByText("One Day Room Booking System")).toBeVisible();
      expect(screen.getByText("Hello")).toBeVisible();
      expect(screen.getByText("Login")).toBeVisible();
      spy.mockReset();
      spy.mockRestore();
    });
  });
});
