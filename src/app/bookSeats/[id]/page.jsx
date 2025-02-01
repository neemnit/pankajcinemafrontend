"use client";
import React, { useContext, useEffect, useState,useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import UserContext from "../../context/UserContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "@/app/Components/Checkout";

const Page = () => {
  const bookButtonRef = useRef(null);
   const timeRef=useRef(null)
   const seatRef=useRef(null)
  

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  const { id } = useParams();

  const [movieDetails, setMovieDetails] = useState({});
  const [seats, setSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const {
    isModalOpen,
    ticketCount,
    handleTicketSubmit,
    setIsModalOpen,
    setTicketCount,
    profileData,
    movies,
    bookedSeats,
    getSeats,
  } = useContext(UserContext);

  const rows = 10;
  const cols = 10;

  // Fetch movie details
  useEffect(() => {
    if (movies && id) {
      const data = movies.find((movie) => movie._id === id);
      if (data) {
        setMovieDetails(data);
        setSelectedDate(new Date(data.releaseDate));
      }
    }
  }, [movies, id]);

useEffect(() => {
  setTimeout(() => {
    timeRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 200);
}, [selectedDate]);





  // Generate seats on movie load
  useEffect(() => {
    const generatedSeats = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        row: String.fromCharCode(65 + rowIndex),
        seatNumber: colIndex + 1,
        isBooked: false,
        price: movieDetails?.ticketPrice || 200,
      }))
    ).flat();
    setSeats(generatedSeats);
  }, [movieDetails]);

  // Fetch and update seats based on selected date and time
  useEffect(() => {
    if (selectedDate && selectedTime) {
      getSeats(); // Fetch booked seats from the server
    }
  }, [selectedDate, selectedTime, getSeats]);

  // Update seat booking status based on booked seats
  useEffect(() => {
    if (selectedDate && selectedTime && bookedSeats.length > 0) {
      // Fix: Convert selectedDate to local YYYY-MM-DD format
      const localDate = selectedDate.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

      // Compare seat.showDate (also convert to YYYY-MM-DD format)
      const bookedSeatData = bookedSeats.filter((seat) => {
        const seatDate = new Date(seat.showDate); // Make sure showDate is a Date object
        const formattedSeatDate = seatDate.toLocaleDateString("en-CA"); // Format seat.showDate to YYYY-MM-DD
        return (
          formattedSeatDate === localDate && // Compare with local date
          seat.showTime === selectedTime &&
          seat.movieId === id
        );
      });

      

      setSeats((prevSeats) =>
        prevSeats.map((seat) => {
          const isBooked = bookedSeatData.some((booked) =>
            booked.seats.some(
              (s) => s.seatNumber === seat.seatNumber && s.row === seat.row
            )
          );
          return { ...seat, isBooked };
        })
      );
    }
  }, [bookedSeats, selectedDate, selectedTime, id]);

  const handleSeatClick = (seat) => {
    if (!seat.isBooked) {
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.length >= ticketCount) {
          return [...prevSelectedSeats.slice(1), seat];
        }
        return prevSelectedSeats.includes(seat)
          ? prevSelectedSeats.filter((s) => s !== seat)
          : [...prevSelectedSeats, seat];
      });
      setTimeout(() => {
        bookButtonRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  const handleSeatDetail = () => ({
    showDate: selectedDate,
    showTime: selectedTime,
    totalSeats: "100",
    isFull: false,
    movieId: movieDetails._id,
    image: movieDetails.image.url,
    seats: selectedSeats.map((seat) => ({
      ...seat,
      price: movieDetails?.ticketPrice,
    })),
    numSeatsBooked: [
      { userId: profileData._id, seatsBooked: selectedSeats.length },
    ],
  });

  const isBookingEnabled =
    selectedDate && selectedTime && selectedSeats.length === ticketCount;

  const vehicleImages = {
    1: "/images/bycle.webp",
    2: "/images/scooter.webp",
    3: "/images/auto.webp",
    4: "/images/auto.webp",
    5: "/images/van.webp",
    6: "/images/bus.webp",
    7: "/images/minibus.webp",
    8: "/images/minibus.webp",
    9: "https://example.com/bus.png",
    10: "https://example.com/mini-bus.png",
  };

  return (
    <div className="container mx-auto p-4">
      {/* YouTube Video with Background Image */}
      <div className="relative w-full h-60 rounded-lg shadow-lg overflow-hidden">
        <Image
          src={movieDetails?.image?.url || "/images/default-placeholder.png"}
          alt={movieDetails?.name || "Movie Image"}
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <iframe
            width="80%"
            height="80%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&modestbranding=1&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

      {/* Left Panel for Date, Time & Seat Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start p-4 bg-light-blue-100 gap-4">
        {/* Date Picker */}
        <div className="w-full md:w-1/3 p-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Date</h3>
            <button
              onClick={() => {
                setIsModalOpen(!isModalOpen);
                setTicketCount(0);
              }}
              className="flex items-center text-sm text-blue-500 hover:text-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Tickets
            </button>
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mb-4"
            month={
              movieDetails?.releaseDate
                ? new Date(movieDetails.releaseDate)
                : undefined
            }
            disabled={{
              before: movieDetails?.releaseDate
                ? new Date(movieDetails.releaseDate)
                : undefined,
              after: movieDetails?.releaseDate
                ? new Date(
                    new Date(movieDetails.releaseDate).setDate(
                      new Date(movieDetails.releaseDate).getDate() + 7
                    )
                    
                  )
                : undefined,
            }}
          />
        </div>

        {/* Time Picker */}
        <div className="w-full md:w-1/3 p-4 bg-white shadow-md rounded-lg" ref={timeRef}>
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          <select
            value={selectedTime}
            onChange={(e) =>{ setSelectedTime(e.target.value)
              setTimeout(() => {
                 seatRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 200);
            }}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Time</option>
            {["10:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"].map(
              (time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              )
            )}
          </select>
        </div>

        {/* Seat Selection */}
        {ticketCount > 0 && selectedDate && selectedTime && (
          <div className="w-full md:flex-grow p-4 bg-white shadow-md rounded-lg" ref={seatRef}>
            <h2 className="text-2xl font-semibold mb-4">Select Your Seats</h2>
            <div className="flex flex-col gap-2">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <span className="w-8 text-gray-700 font-medium">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  <div className="grid grid-cols-10 gap-2">
                    {seats
                      .filter(
                        (seat) =>
                          seat.row === String.fromCharCode(65 + rowIndex)
                      )
                      .map((seat, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 flex items-center justify-center rounded-md text-white font-bold cursor-pointer ${
                            seat.isBooked
                              ? "bg-gray-300 cursor-not-allowed"
                              : selectedSeats.includes(seat)
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "border border-green-700 hover:bg-green-600"
                          }`}
                          onClick={() => handleSeatClick(seat)}
                          
                        >
                          <span
                            className={`${
                              seat.isBooked
                                ? "text-gray-500"
                                : "text-green-500 hover:text-white"
                            }`}
                          >
                            {seat.seatNumber}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Selecting Ticket Quantity */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              Select Ticket Quantity
            </h2>
            <div className="mb-4">
              <label
                htmlFor="ticketCount"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Tickets
              </label>
              <select
                id="ticketCount"
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Your Ride</h3>
              <Image
                src={vehicleImages[ticketCount]}
                alt={`Vehicle for ${ticketCount} tickets`}
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                onClick={() => {
                  handleTicketSubmit();
                  setIsModalOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm and Book Button */}
      <div className="p-4 bg-white text-center mt-4" ref={bookButtonRef}>
        <button
          className={`border w-full md:w-[30%] p-4 bg-[#f84464] shadow-[0 1px 8px rgba(0, 0, 0, .16)] rounded-md text-[#fff] font-semibold text-sm transition-transform transform hover:scale-95 hover:translate-y-2 ${
            !isBookingEnabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setIsModalOpen(!isModalOpen)}
          disabled={!isBookingEnabled}
        >
          Confirm and book seats
        </button>
      </div>

      {/* Stripe Payment Modal */}
      {isModalOpen &&
        selectedDate &&
        selectedTime &&
        ticketCount > 0 &&
        selectedSeats.length && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <Elements stripe={stripePromise}>
              <Checkout data={handleSeatDetail()} />
            </Elements>
          </div>
        )}
    </div>
  );
};

export default Page;
