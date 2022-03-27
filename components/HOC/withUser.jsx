import { useUser } from "@auth0/nextjs-auth0";
export function withUser(Children) {
  const { user, isLoading } = useUser();
  return (props) => <Children {...props} user={user} isLoading={isLoading} />;
}
