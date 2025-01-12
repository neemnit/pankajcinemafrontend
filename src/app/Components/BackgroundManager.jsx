"use client";  // This marks the component as a client component

import { useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import { useRouter } from "next/navigation";

const BackgroundManager = () => {
  const { isLoggedIn, updateLoggedIn, roleType, fetchRole } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // const fetchData = async () => {
    //   console.log("background");
    //   const authToken = localStorage.getItem("authToken")?.trim();
    //   if (authToken || isLoggedIn) {
    //     if (authToken) {
    //       await fetchRole(authToken);
    //     }
    //     if (roleType === "admin") {
    //       updateLoggedIn(true);
    //       router.push('/addmovies');
    //     } else if (roleType === "user") {
    //       updateLoggedIn(true);
    //       router.push('/movies');
    //     }
    //   }
    // };
    // fetchData();
  }, []);

  return (
    <div
      className={` ${isLoggedIn ? "" : "absolute inset-0 bg-center bg-cover opacity-90 bg-[url('/images/naya.webp')] blur-sm"
        }`}
    ></div>
  );
};

export default BackgroundManager;
