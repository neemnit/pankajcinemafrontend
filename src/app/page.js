"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";

import UserContext from "./context/UserContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(true);
  const { checkUnique, addUser, isLoggedIn, roleType } = useContext(UserContext);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    adharNo: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^(?!.*([a-zA-Z])\1{2}).*$/i,
        "No three consecutive identical letters."
      )
      .matches(
        /^[a-zA-Z]+(\s[a-zA-Z]+)*$/,
        "Name must contain only alphabetic letters and spaces between words."
      )
      .trim()
      .min(3, "Name must contain at least 3 letters.")
      .max(17,"name should not longer than 17 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test(
        "is-unique",
        "Email already exist",
        async (value) => {
          if (!value) return true; // Skip validation if the value is empty
          return await checkUnique(value); // Async validation
        }
      ),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required("Password is required"),

    adharNo: Yup.string()
      .matches(/^\d{16}$/, "Aadhaar Card must be exactly 16 digits")
      .required("Aadhaar Card is required")
      .test(
        "is-unique",
        "Aadhaar Card number already exists",
        async (value) => {
          if (!value) return true; // Skip validation if the value is empty
          return await checkUnique(value); // Async validation
        }
      ),
  });

  useEffect(() => {
    // You can add logic here if needed
    
    

  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch("https://pankajcinemabackend-1.onrender.com/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.log(response)
       // throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert(result.message);
      addUser(result.user);
      resetForm();
      router.push('/login');
    } catch (error) {
      console.log(error,"yaha")
      alert(error?.error);
    }
  };

  return (
    !isLoggedIn && (
      <div className="bg-gradient-to-r from-purple-300 via-pink-200 to-red-200 opacity-90 h-auto shadow-2xl hover:shadow-xl w-[34rem] rounded-3xl text-center mx-auto z-20 mt-5 border-4 border-slate-800 p-4">
        <div className="flex flex-row relative">
          <Image
            src={"/images/register.webp"}
            height={30}
            width={40}
            alt="reel"
            className="absolute left-14"
            
          />
          <p className="text-3xl font-bold mb-4 text-red-700 grow">
            Register Yourself
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name Field */}
              <FieldWithError
                name="name"
                label="Name:"
                type="text"
                icon="fa-user"
              />

              {/* Email Field */}
              <FieldWithError
                name="email"
                label="Email:"
                type="email"
                icon="fa-envelope"
              />

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
                      className={`fa-regular ${isPassword ? "fa-eye-slash" : "fa-eye"}`}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Aadhaar Card Field */}
              <FieldWithError
                name="adharNo"
                label="Aadhaar Card:"
                type="text"
                icon="/images/adhar.webp"
              />

              {/* Submit Button */}
              <button
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 transition-all duration-300"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
              <span className="absolute right-auto text-sm">
                Already registered? <Link href={"/login"} className="text-blue-800">Go to Login</Link>
              </span>
            </Form>
          )}
        </Formik>
      </div>
    )
  );
}

function FieldWithError({ name, label, type, icon }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center space-x-2 relative">
        <label
          className="text-black tracking-tight font-serif grow text-2xl after:content-['*'] after:text-red-500 after:align-super"
          htmlFor={name}
        >
          {label}
        </label>
        <Field
          type={type}
          id={name}
          name={name}
          className="px-2 border-none outline-none w-80 rounded-2xl h-10 focus:shadow-lg focus:shadow-blue-500 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
        {icon && <i className={`fa ${icon} absolute right-2`} />}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}
