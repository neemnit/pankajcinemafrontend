"use client";

import React, { useEffect, useContext } from "react";
import { useRouter ,notFound,usePathname} from "next/navigation";
import UserContext from "../context/UserContext";

const Profile = () => {
  const { isLoggedIn, fetchRole, profileData } = useContext(UserContext);
  const router = useRouter();
const pathName=usePathname()
  useEffect(() => {
    if(pathName!='/profile')
      notFound()
    if (isLoggedIn) {
      fetchRole(localStorage.getItem("authToken"));
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-white">
        Welcome {profileData?.name}
      </h1>
    </div>
  );
};

export default Profile;
