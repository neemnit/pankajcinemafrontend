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
            `/getBooking?session_id=${sessionId}&user_data=${userData}`
          );
          

          if (response.status === 200) {
            setPaymentData(response.data);
            getSeats();
          }
        } catch (error) {
          console.error("Error fetching payment success data:", error);
        }
      };
      fetchSuccessData();
    }
  }, [searchParams, getSeats]);

  const downloadTicketAsPDF = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 150] });
      pdf.addImage(imgData, "PNG", 10, 10, 80, 100);
      pdf.save(`${paymentData?.movieId?.name}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Success</h1>
      {paymentData ? (
        <div
          ref={ticketRef}
          className="bg-white shadow-lg rounded-lg p-4 max-w-sm w-full border border-gray-300 text-gray-900"
        >
          <h2 className="text-xl font-bold text-center mb-3 text-gray-900">🎟️ Movie Ticket</h2>
          <img
            src={paymentData?.movieId?.image?.url}
            className="w-full h-20 rounded-lg object-cover mb-3"
            alt="Movie Poster"
          />
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-600"><strong>🎬 Movie:</strong> {paymentData?.movieId?.name}</p>
            <p className="font-semibold text-gray-600"><strong>📅 Date:</strong> {paymentData?.userData?.showDate ? new Date(paymentData.userData.showDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</p>
            <p className="font-semibold text-gray-600"><strong>⏰ Time:</strong> {paymentData?.userData?.showTime}</p>
            <p className="font-semibold text-gray-600"><strong>💺 Seats:</strong> {paymentData?.userData?.seats?.map(seat => `${seat.row}-${seat.seatNumber}`).join(", ")}</p>
            <p className="font-semibold text-gray-600"><strong>🎟️ Tickets:</strong> {paymentData?.userData?.seats?.length}</p>
            <p className="font-bold text-black border-t border-gray-300 pt-2"><strong>💰 Amount:</strong> ₹{(paymentData?.userData?.seats[0]?.price * paymentData?.userData?.seats.length).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Loading payment details...</p>
      )}
      {paymentData && (
        <button
          onClick={downloadTicketAsPDF}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          Download Ticket as PDF
        </button>
      )}
    </div>
  );
};

export default SuccessPage;
