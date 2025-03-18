"use client";

import React, { useContext,useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UserContext from "../context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Icons for mobile menu

const Header = React.memo(() => {
  const { isLoggedIn, updateLoggedIn, roleType, setRoleType } =
    useContext(UserContext);
  const [view, setView] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn); // Ensure UI updates correctly
  const router = useRouter();
  const pathName = usePathname();

  // Update local state when context changes
  useEffect(() => {
    setUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    updateLoggedIn(false); // Set context state to false
    setUserLoggedIn(false); // Update local state
    setRoleType("");
    setMenuOpen(false); // Close menu after logout
    router.push("/login");
  };

  const AdminLinks = () => (
    <>
      <li><Link href="/profile" className="hover:text-yellow-300">Profile</Link></li>
      <li>
        <button onClick={() => { setView(!view); router.push(view ? "/viewmovie" : "/addmovies"); }}>
          {view ? "View Movie" : "Add Movie"}
        </button>
      </li>
      <li><Link href="/viewusers" className="hover:text-yellow-300">View Users</Link></li>
      <li><button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button></li>
    </>
  );

  const UserLinks = () => (
    <>
      <li><Link href="/my-booking" className={`${pathName === "/my-booking" ? "font-bold text-yellow-300" : "hover:text-yellow-300"}`}>My Booking</Link></li>
      <li>
        <button onClick={() => { setView(!view); router.push(view ? "/profile" : "/viewmovie"); }}>
          {view ? "Profile" : "View Movie"}
        </button>
      </li>
      <li><Link href="/ticket-status" className="hover:text-yellow-300">Ticket Status</Link></li>
      <li><button onClick={handleLogout} className="text-red-400 hover:text-red-300">Logout</button></li>
    </>
  );

  return (
    <header className="bg-slate-800 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Image src="/images/agla.webp" alt="Reel" width={80} height={40} className="shadow-sm h-12 w-auto md:h-16 object-contain" />
          <h1 className="text-white text-lg sm:text-2xl md:text-3xl font-semibold">Pankaj Hall</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6 text-sm md:text-lg text-white">
            {userLoggedIn ? (roleType === "admin" ? <AdminLinks /> : <UserLinks />) : (
              <li>
                <Link href="/login" className="bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-400 transition duration-300">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {userLoggedIn ? (
            // Show hamburger menu if user is logged in
            <button className="text-white focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          ) : (
            // Show Login button if user is NOT logged in
            <Link href="/login" className="bg-blue-500 px-4 py-2 text-white rounded-md shadow-md hover:bg-blue-400 transition duration-300">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && userLoggedIn && (
          <nav className="absolute top-14 right-6 bg-slate-900 p-4 rounded-lg shadow-lg md:hidden w-48">
            <ul className="flex flex-col gap-4 text-white">
              {roleType === "admin" ? <AdminLinks /> : <UserLinks />}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
