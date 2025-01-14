"use client"
import { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import UserContext from "../context/UserContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [isPassword, setIsPassword] = useState(true);
  const { updateLoggedIn, setRoleType ,isLoggedIn} = useContext(UserContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one capital letter")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await fetch("https://pankajcinemabackend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();

        if (error?.error) {
          setErrors({
            email: error.error.includes("email") ? error.error : "",
            password: error.error.includes("password") ? error.error : "",
          });
        }

        throw new Error(`HTTP error! Status: ${response.status} ${error?.error}`);
      }

      const result = await response.json();
      toast.success(result?.message);
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("role", result?.role);
      updateLoggedIn(true); // Update login status
      setRoleType(result?.role);
    } catch (error) {
      alert(error);
    } finally {
      setSubmitting(false); // Re-enable the submit button after submission
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-300  via-pink-200 to-red-200 opacity-90 h-auto shadow-2xl hover:shadow-xl w-[34rem] rounded-3xl text-center mx-auto z-20 mt-5 border-4 border-slate-800 p-4">
      <div className="flex flex-row relative">
        <Image
          src={"/images/login.webp"}
          height={30}
          width={40}
          alt="reel"
          className="absolute left-28"
        
          style={{ width: "auto", height: "auto" }}
        />
        <p className="text-3xl font-bold mb-4 text-red-700 grow">Login</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center relative space-x-2">
                <label
                  className="text-black tracking-wider font-serif pr-8 grow text-2xl after:content-['*'] after:text-red-500 after:align-super"
                  htmlFor="email"
                >
                  Email:
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="px-2 border-none outline-none w-80 rounded-2xl h-10 focus:shadow-lg focus:shadow-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
                <i className="fa-solid fa-envelope absolute right-2"></i>
              </div>
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center relative space-x-2">
                <label
                  className="text-black tracking-wider font-serif pr-8 grow text-2xl after:content-['*'] after:text-red-500 after:align-super"
                  htmlFor="password"
                >
                  Password:
                </label>
                <Field
                  type={isPassword ? "password" : "text"}
                  id="password"
                  name="password"
                  className="px-2 border-none outline-none w-80 rounded-2xl h-10 focus:shadow-lg focus:shadow-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
                <button
                  className="absolute right-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPassword(!isPassword);
                  }}
                >
                  <i
                    className={`fa-regular ${isPassword ? "fa-eye-slash" : "fa-eye"} cursor-pointer`}
                  ></i>
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Submit Button */}
            <button
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 transition-all duration-300"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <span className="absolute right-auto text-sm pl-0.5">
              Not loggedIn?{" "}
              <Link href={"/"} className="text-blue-800">
                first register here
              </Link>
            </span>
          </Form>
        )}
      </Formik>
    </div>
  );
}
