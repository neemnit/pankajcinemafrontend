"use client";  // This marks the component as a client component

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UserContext from "../context/UserContext";
import { useRouter } from "next/navigation";

const Header = React.memo(() => {
  const { isLoggedIn, updateLoggedIn, roleType, fetchRole, setRoleType } = useContext(UserContext);
  const [view, setView] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // You can add logic here if needed
  }, []);

  const AdminLinks = () => {
    return (
      <>
        <li>
          <Link href="/profile" className="text-white">
            Profile
          </Link>
        </li>
        <li>
        <button
      className="text-white"
      onClick={() => {
        setView(!view);
        router.push(view ? "/viewmovie" : "/addmovies");
      }}
    >
      {view ? "View Movie" : "Add Movie"}
    </button>
        </li>
        <li>
          <Link href="/view-users" className="text-white">
            View Users
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("role");
              updateLoggedIn(!isLoggedIn);
              setRoleType("");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </li>
      </>
    );
  };

  const UserLinks = () => {
    const [viewProfile, setViewProfile] = useState(true);

    return (
      <>
        <li>
          <Link href="/my-booking" className="text-white">
            My Booking
          </Link>
        </li>
        <li>
          <Link
            href={viewProfile ? "/profile" : "/viewmovie"}
            className="text-white"
            onClick={() => setViewProfile(!viewProfile)}
          >
            {viewProfile ? "Profile" : "View Movie"}
          </Link>
        </li>
        <li>
          <Link href="/ticket-status" className="text-white">
            Ticket Status
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("role");
              updateLoggedIn(!isLoggedIn);
              setRoleType("");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </li>
      </>
    );
  };

  return (
    <div className={ `bg-slate-600 h-20 w-full flex items-center px-6 `} >
      <ul className="flex w-full items-center justify-between list-none">
        {isLoggedIn ? (
          <>
            {roleType === "admin" ? <AdminLinks /> : <UserLinks />}
          </>
        ) : (
          <>
            <li className="text-3xl text-white font-sans ">
              Welcome to Pankaj Hall
            </li>
            <li>
              <Image
                src="/images/agla.webp"
                alt="Reel"
                width={60}
                height={40}
                className="shadow-sm h-16 w-[32rem] object-contain"
            
              />
            </li>
            <li>
              <Link
                href="/login"
                className="text-bold text-xl text-slate-200 transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-1"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
