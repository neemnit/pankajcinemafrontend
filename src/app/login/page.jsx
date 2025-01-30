"use client";
import { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import UserContext from "../context/UserContext";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [isPassword, setIsPassword] = useState(true);
  const { updateLoggedIn, setRoleType, isLoggedIn } = useContext(UserContext);

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
      const response = await axios.post("/login", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data?.message);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("role", response.data?.role);
      updateLoggedIn(true); // Update login status
      setRoleType(response.data?.role);
    } catch (error) {
      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        setErrors({
          email: errorMessage.includes("email") ? errorMessage : "",
          password: errorMessage.includes("password") ? errorMessage : "",
        });
      }
      toast.error(error.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setSubmitting(false); // Re-enable the submit button after submission
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-auto shadow-lg w-full max-w-md rounded-lg mx-auto mt-10 p-6 border border-gray-300 sm:px-10 md:w-2/3 lg:w-1/2">
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/images/login.webp"
          height={80}
          width={80}
          alt="Login Icon"
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-700">Login</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="flex flex-col">
              <label
                className="text-gray-600 font-medium text-sm mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-gray-600 font-medium text-sm mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Field
                  type={isPassword ? "password" : "text"}
                  id="password"
                  name="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setIsPassword(!isPassword)}
                  className="absolute top-2 right-3 text-gray-600 hover:text-gray-800"
                >
                  <i
                    className={`fa-regular ${isPassword ? "fa-eye-slash" : "fa-eye"}`}
                  ></i>
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
