"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useContext, useState } from "react";
import Link from "next/link";
import axios from "../config/axios";
import UserContext from "./context/UserContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(true);
  const { checkUnique, addUser, isLoggedIn } = useContext(UserContext);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    adharNo: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^(?!.*([a-zA-Z])\1{2}).*$/i, "No three consecutive identical letters.")
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, "Name must contain only alphabetic letters and spaces between words.")
      .trim()
      .min(3, "Name must contain at least 3 letters.")
      .max(17, "Name should not be longer than 17 characters.")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test("is-unique", "Email already exists", async (value) => {
        if (!value) return true;
        return await checkUnique(value);
      }),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .required("Password is required"),

    adharNo: Yup.string()
      .matches(/^\d{16}$/, "Aadhaar Card must be exactly 16 digits")
      .required("Aadhaar Card is required")
      .test("is-unique", "Aadhaar Card number already exists", async (value) => {
        if (!value) return true;
        return await checkUnique(value);
      }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("/registerUser", values);
      alert(response.data.message);
      addUser(response.data.user);
      resetForm();
      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    !isLoggedIn && (
      <div className="bg-gradient-to-r from-purple-300 via-pink-200 to-red-200 opacity-90 max-w-md mx-auto rounded-lg text-center p-4 shadow-md border border-gray-300">
        <div className="flex justify-center mb-3">
          <Image src="/images/register.webp" height={30} width={30} alt="Register" />
        </div>
        <h2 className="text-lg font-semibold text-gray-700">Register Yourself</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-2 mt-3">
              <FieldWithError name="name" label="Name" type="text" />
              <FieldWithError name="email" label="Email" type="email" />
              <PasswordField name="password" isPassword={isPassword} setIsPassword={setIsPassword} />
              <FieldWithError name="adharNo" label="Aadhaar Card" type="text" />
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
              <p className="text-center text-xs">
                Already registered? <Link href="/login" className="text-blue-600">Go to Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    )
  );
}

function FieldWithError({ name, label, type }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium text-xs" htmlFor={name}>{label}</label>
      <Field
        type={type}
        id={name}
        name={name}
        className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
    </div>
  );
}

function PasswordField({ name, isPassword, setIsPassword }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium text-xs" htmlFor={name}>Password</label>
      <div className="relative">
        <Field
          type={isPassword ? "password" : "text"}
          id={name}
          name={name}
          className="mt-1 p-1 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-600 text-xs"
          onClick={() => setIsPassword(!isPassword)}
        >
          {isPassword ? "👁️" : "🙈"}
        </button>
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
    </div>
  );
}
