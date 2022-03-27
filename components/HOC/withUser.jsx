import { useUser } from "@auth0/nextjs-auth0";
export function WithUser(Children) {
  const { user, isLoading } = useUser();
  console.log(user, isLoading);
  return function LoadedUserChildren(props) {
    return <Children {...props} user={user} isLoading={isLoading} />;
  };
}
