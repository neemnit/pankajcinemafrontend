"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "../../config/axios";
import UserContext from "../context/UserContext";

const SuccessPage = () => {
  const { getSeats } = useContext(UserContext);
  const [paymentData, setPaymentData] = useState(null);
  const ticketRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const userData = searchParams.get("user_data");

    if (sessionId && userData) {
      const fetchSuccessData = async () => {
        try {
          const response = await axios.get(
            `/success?session_id=${sessionId}&user_data=${userData}`
          );

          if (response.status === 200) {
            setPaymentData(response.data);
            getSeats();
          } else {
            console.error("Error:", response.data.error);
          }
        } catch (error) {
          console.error("Error fetching payment success data:", error);
        }
      };

      fetchSuccessData();
    }
  }, [searchParams, getSeats]);

  // ✅ Updated function to download as PDF
  const downloadTicketAsPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Avoid cross-origin issues
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 180; // Adjusted for A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      pdf.save("movie_ticket.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
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
            🎟️  Ticket
          </h2>
          <div className="space-y-4">
            <img
              src={paymentData?.seatData?.movieId?.image?.url}
              className="w-full h-16"
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
              <strong>Seats:</strong>{" "}
              {paymentData?.seatData?.seats
                ?.map((seat) => `${seat.row}-${seat.seatNumber}`)
                .join(", ")}
            </p>
            <p>
              <strong>Total Tickets:</strong>{" "}
              {paymentData?.seatData?.seats?.length}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {(
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
          onClick={downloadTicketAsPDF}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Ticket as PDF
        </button>
      )}
    </div>
  );
};

export default SuccessPage;
