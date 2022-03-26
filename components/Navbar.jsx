import { useUser } from "@auth0/nextjs-auth0";
import React from "react";
import Link from "next/link";
export default function Navbar() {
  const { user, isLoading } = useUser();
  return (
    <>
      {!isLoading && !user && (
        <Link href="/api/auth/login">
          <a className="text-grey-800 hover:text-blue-800 mb-3">Login</a>
        </Link>
      )}
      {!isLoading && user && (
        <>
          <Link href="/myBookings">
            <a className="text-grey-800 hover:text-blue-800 mb-3">
              My bookings
            </a>
          </Link>
          <Link href="/new">
            <a className="text-grey-800 hover:text-blue-800 mb-3">
              Create Booking
            </a>
          </Link>
          <Link href="/api/auth/logout">
            <a className="text-grey-800 hover:text-blue-800">Logout</a>
          </Link>
        </>
      )}
    </>
  );
}
