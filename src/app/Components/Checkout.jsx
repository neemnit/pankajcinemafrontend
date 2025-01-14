"use client";

import { useState } from "react";

const Checkout = ({ data }) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const handleCheckout = async () => {
    try {
      // Example data to send to the backend
      const response = await fetch("http/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          showDate: data?.showDate,
          showTime: data?.showTime,
          totalSeats: data?.totalSeats,
          isFull: data?.isFull,
          movieId: data?.movieId,
          seats:data?.seats,
          numSeatsBooked: data?.numSeatsBooked,
        }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to create checkout session");
      }

      const responseData = await response.json(); // Changed variable name from `data` to `responseData`
      setCheckoutUrl(responseData?.url);

      if (responseData.url) {
        window.location.href = responseData.url; // Redirect to Stripe Checkout
      } else {
        console.error("No URL returned from backend");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stripe Checkout</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Book Tickets
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            {/* Movie Details */}
            <div className="mb-6">
              <img
                src={data?.image}
                alt={data.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
              <p className="text-gray-600">{data.description}</p>
            </div>

            {/* Ticket Details */}
            <div className="mb-6">
              <p className="text-gray-800 font-medium">
                <strong>Price:</strong> ₹{data?.seats[0]?.price * data?.seats.length}
              </p>
              <p className="text-gray-800 font-medium">
                <strong>Date:</strong> {data?.showDate.toString()}
              </p>
              <p className="text-gray-800 font-medium">
                <strong>Time:</strong> {data?.showTime}
              </p>
              <p className="text-gray-800 font-medium">
                <strong>Seats:</strong> {
                  data?.seats.map((seat ,i)=>{
                    return <span key={i}>
                      {
                        seat?.row + " "+ seat?.seatNumber
                      }
                    </span>
                  })
                }
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
      )}
    </div>
  );
};

export default Checkout;
