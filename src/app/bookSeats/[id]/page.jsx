"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import UserContext from "../../context/UserContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "@/app/Components/Checkout";

const Page = () => {
  const pathname = usePathname();
  const router = useRouter();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  console.log(stripePromise, "ajakakadf");

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
  let bookSeatData;

  useEffect(() => {
    const generatedSeats = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        row: String.fromCharCode(65 + rowIndex),
        seatNumber: colIndex + 1,
        isBooked: false,
        price: movieDetails?.ticketPrice || 200,
        bookedBy: null,
      }))
    ).flat();
    setSeats(generatedSeats);

    // Filter booked seats based on showDate, showTime, and movieId
    console.log("selecteddatewaaa", selectedDate);
    bookSeatData = bookedSeats.filter(
      (seat) =>
        seat?.showDate === selectedDate?.toISOString() &&
        seat?.showTime === selectedTime &&
        seat?.movieId === id
    );

    console.log("bookseatdatavavava", bookSeatData);
    // Update seat booking status
    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        // Look deeper into bookSeatData to find a matching seat
        const bookedSeat = bookSeatData.find((booked) =>
          booked.seats.some(
            (bookedSeat) =>
              bookedSeat.seatNumber === seat.seatNumber &&
              bookedSeat.row === seat.row
          )
        );

        if (bookedSeat) {
          const matchingSeat = bookedSeat.seats.find(
            (bookedSeat) =>
              bookedSeat.seatNumber === seat.seatNumber &&
              bookedSeat.row === seat.row
          );
          return { ...seat, isBooked: true, bookedBy: matchingSeat.bookedBy };
        }

        return seat;
      })
    );

    // Fetch movie details by ID
    if (movies && id) {
      const data = movies.find((movie) => movie._id === id);
      if (data) {
        setMovieDetails(data);
      }
    }

    getSeats();
    if (pathname.includes("/bookSeats/" + id)) router.push(pathname);
    else router.push("/viewmovie");
  }, [id, getSeats, movies, selectedDate, selectedTime]);

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

  const handleSeatClick = (seat) => {
    if (!seat.isBooked) {
      setSelectedSeats((prevSelectedSeats) => {
        // Limit the number of selected seats to the ticket count
        if (prevSelectedSeats.length >= ticketCount) {
          // If selected seats exceed ticket count, remove the first selected seat
          const updatedSeats = [...prevSelectedSeats.slice(1), seat];
          return updatedSeats;
        }

        if (prevSelectedSeats.includes(seat)) {
          return prevSelectedSeats.filter((s) => s !== seat); // Deselect the seat
        } else {
          return [...prevSelectedSeats, seat]; // Select the seat
        }
      });
    }
  };
  //   if(selectedDate && selectedTime){
  //     console.log(selectedDate)
  //     bookSeatData = bookedSeats.filter(
  //       (seat) =>
  //         seat?.showDate === selectedDate.toISOString() &&
  //         seat?.showTime === selectedTime &&
  //         seat?.movieId === id
  //     );
  // console.log("bookseatdata",bookSeatData)

  //   }
  const handleSeatDetail = () => {
    const data = {
      showDate: selectedDate,
      showTime: selectedTime,
      totalSeats: "100",
      isFull: false,
      movieId: movieDetails._id,
      image: movieDetails.image.url,
      seats: selectedSeats.map((seat) => {
        return { ...seat, price: movieDetails?.ticketPrice };
      }),
      numSeatsBooked: [
        {
          userId: profileData._id,
          seatsBooked: selectedSeats.length,
        },
      ],
    };
    return data;
  };

  return (
    <div>
      {/* Movie Image */}
      <div className="relative w-full h-60 ">
        <Image
          src={movieDetails?.image?.url || "/images/default-placeholder.png"}
          alt={movieDetails?.name || "Movie Image"}
        layout="fill"
          objectFit="contain"
          className="rounded-lg shadow-lg z-50"
        />
      </div>

      {/* Left Panel for Date, Time & Seat Selection */}
      <div className="flex flex-row justify-between items-start p-4 bg-light-blue-100 gap-4">
        {/* Date Picker */}
        <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Select Date</h3>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mb-4"
            disabled={{
              before: movieDetails?.releaseDate,
              after: movieDetails?.releaseDate
                ? new Date(
                    new Date(movieDetails?.releaseDate).setDate(
                      new Date(movieDetails.releaseDate).getDate() + 7
                    )
                  ) // Disable dates 7 days after the release date
                : undefined,
            }}
          />
        </div>

        {/* Time Picker */}
        <div className="w-1/3 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
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
          <div className="flex-grow p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Select Your Seats</h2>
            <div className="flex flex-col gap-2">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  {/* Row Label */}
                  <span className="w-8 text-gray-700 font-medium">
                    {String.fromCharCode(65 + rowIndex)}
                  </span>
                  {/* Seats in the Row */}
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
                              ? "bg-gray-300"
                              : selectedSeats.includes(seat)
                              ? "bg-blue-500 hover:bg-blue-600"
                              : " border border-green-700 hover:bg-green-600"
                          }`}
                          onClick={() => handleSeatClick(seat)}
                        >
                          <span
                            className={`text-green-500 hover:text-white ${
                              seat?.isBooked
                                ? "cursor-not-allowed opacity-50"
                                : ""
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-1/3">
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
                onClick={handleTicketSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-2 bg-white mx-auto mt-[-230px] text-center">
        <button
          className="border w-[20%] p-4 bg-[#f84464] shadow-[0 1px 8px rgba(0, 0, 0, .16)] rounded-md text-[#fff] font-semibold text-sm transition-transform transform hover:scale-95 hover:translate-y-2"
          onClick={() => {
            setIsModalOpen(!isModalOpen);
            const bookingData = handleSeatDetail();
          }} // Open the modal for the checkout process
          disabled={!ticketCount || !selectedDate || !selectedTime}
        >
          Confirm and book seats
        </button>
      </div>

      {/* Render the Stripe Elements component only when required */}
      {isModalOpen && selectedDate && selectedTime && ticketCount > 0 && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-1/2">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <Elements stripe={stripePromise}>
              <Checkout data={handleSeatDetail()} />
            </Elements>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
