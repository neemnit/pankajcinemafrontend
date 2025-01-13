"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import UserContext from "../context/UserContext";

const SuccessPage = () => {
  const{getSeats}=useContext(UserContext)
  const [paymentData, setPaymentData] = useState(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchSuccessData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const sessionId = queryParams.get("session_id");
      const userData = queryParams.get("user_data");

      if (sessionId && userData) {
        try {
          const response = await fetch(
            `"https://pankajcinemabackend-1.onrender.com/success?session_id=${sessionId}&user_data=${userData}`
          );
          const data = await response.json();

          if (response.ok) {
            setPaymentData(data); // Store data in state
            getSeats()
            
          } else {
            console.error("Error:", data.error);
          }
        } catch (error) {
          console.error("Error fetching payment success data:", error);
        }
      } else {
        console.error("Session ID or user data missing");
      }
    };

    fetchSuccessData();
  }, []);

  const downloadTicket = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 120, 0);
        pdf.save("movie_ticket.pdf");
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Payment Success</h1>
      {paymentData ? (
        <div
          ref={ticketRef}
          className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full border border-gray-300"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            🎟️ Movie Ticket
          </h2>
          <div className="space-y-4">
            <img
              src={paymentData?.seatData?.movieId?.image?.url}
              className="w-5 h-6"
              alt="Movie"
            />
            <p>
              <strong>Movie Name:</strong> {paymentData?.seatData?.movieId?.name}
            </p>
            <p>
              <strong>Show Date:</strong> {paymentData?.seatData?.showDate}
            </p>
            <p>
              <strong>Show Time:</strong> {paymentData?.seatData?.showTime}
            </p>
            <p>
              <strong>Seats:</strong> {paymentData?.seatData?.seats
                ?.map((seat) => `${seat.row}-${seat.seatNumber}`)
                .join(", ")}
            </p>
            <p>
              <strong>Total Tickets:</strong> {paymentData?.seatData?.seats?.length}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{(
                paymentData?.seatData?.seats[0]?.price *
                paymentData?.seatData?.seats.length
              ).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Loading payment details...</p>
      )}

      {paymentData && (
        <button
          onClick={downloadTicket}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Ticket
        </button>
      )}
    </div>
  );
};

export default SuccessPage;
