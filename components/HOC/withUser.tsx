import { useUser } from "@auth0/nextjs-auth0";
import React, { ComponentProps } from "react";

export function WithUser<T>(Children: React.FC<T>) {
  const { user, isLoading } = useUser();
  return function LoadedUserChildren(
    props: Omit<ComponentProps<typeof Children>, "user" | "isLoading">
  ) {
    return <Children {...props} user={user} isLoading={isLoading} />;
  };
}
