import Layout from "../Layout";
import { render, screen } from "@testing-library/react";
import Auth from "@auth0/nextjs-auth0";
import { ColorSchemeProvider } from "@mantine/core";
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
        <ColorSchemeProvider colorScheme={"dark"} toggleColorScheme={jest.fn()}>
          <Layout>
            <p>Hello</p>
          </Layout>
        </ColorSchemeProvider>
      );
      screen.debug();
      expect(screen.getByText("Bookr")).toBeVisible();
      expect(screen.getByText("Hello")).toBeVisible();
      expect(screen.getByText("My Bookings")).toBeVisible();
      expect(screen.getByText("New Booking")).toBeVisible();
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
        <ColorSchemeProvider colorScheme={"dark"} toggleColorScheme={jest.fn()}>
          <Layout>
            <p>Hello</p>
          </Layout>
        </ColorSchemeProvider>
      );
      expect(screen.getByText("Bookr")).toBeVisible();
      expect(screen.getByText("Hello")).toBeVisible();
      expect(screen.getByText("Login")).toBeVisible();
      spy.mockReset();
      spy.mockRestore();
    });
  });
});
