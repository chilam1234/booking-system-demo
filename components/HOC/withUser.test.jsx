import { withUser } from "./withUser";
import { UserProvider } from "@auth0/nextjs-auth0";
import { render, screen } from "@testing-library/react";

jest.mock("@auth0/nextjs-auth0", () => {
  return {
    UserProvider: ({ children }) => children,
    useUser: jest.fn(() => ({
      user: { sub: 123 },
      isLoading: false,
    })),
  };
});
describe("withUser", () => {
  it("should load user data to children component", () => {
    const Testing = ({ user, isLoading }) => (
      <>
        <p>{user.sub}</p> <p>isLoading: {`${isLoading}`}</p>
      </>
    );
    const WithUser = withUser(Testing);
    render(
      <UserProvider>
        <WithUser />
      </UserProvider>
    );
    screen.getByText("123");
    screen.getByText("isLoading: false");
  });
});
