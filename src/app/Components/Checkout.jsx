"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../../config/axios";

const Checkout = ({ data }) => {
  const [isModal, setIsModal] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "/payment",
        {
          showDate: data?.showDate,
          showTime: data?.showTime,
          totalSeats: data?.totalSeats,
          isFull: data?.isFull,
          movieId: data?.movieId,
          seats: data?.seats,
          numSeatsBooked: data?.numSeatsBooked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const responseData = response.data;
      setCheckoutUrl(responseData?.url);

      if (responseData?.url) {
        router.push(responseData.url); // Use Next.js router for navigation
      } else {
        console.error("No URL returned from backend");
      }
    } catch (error) {
      console.log(
        "Error during checkout:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <>
      {isModal && (
        <div className="p-6">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/3 p-6 relative">
              {/* Close button */}
              <button
                onClick={() => setIsModal(!isModal)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>

              {/* Movie Details */}
              <div className="mb-6">
                <img
                  src={data?.image}
                  alt={data?.title || "Movie"}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{data?.title}</h2>
                <p className="text-gray-600">{data?.description}</p>
              </div>

              {/* Ticket Details */}
              <div className="mb-6 space-y-2">
                <p className="text-gray-800 font-medium">
                  <strong>Price:</strong> ₹
                  {data?.seats[0]?.price * data?.seats.length}
                </p>
                <p className="text-gray-800 font-medium">
                  <strong>Date:</strong> {data?.showDate?.toString()}
                </p>
                <p className="text-gray-800 font-medium">
                  <strong>Time:</strong> {data?.showTime}
                </p>
                <p className="text-gray-800 font-medium">
                  <strong>Seats:</strong>{" "}
                  {data?.seats
                    ?.map((seat) => `${seat?.row}-${seat?.seatNumber}`)
                    .join(", ")}
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
