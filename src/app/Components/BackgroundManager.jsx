"use client"; // This marks the component as a client component

import { useEffect, useContext } from "react";
import UserContext from "../context/UserContext";


const BackgroundManager = () => {
  const { isLoggedIn } =
    useContext(UserContext);

  useEffect(() => {}, []);

  return (
    <div
      className={` ${
        isLoggedIn
          ? ""
          : "absolute inset-0 bg-center bg-cover opacity-90 bg-[url('/images/naya.webp')] blur-sm"
      }`}
    ></div>
  );
};

export default BackgroundManager;
