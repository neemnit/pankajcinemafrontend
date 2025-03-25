"use client";
import React, { useContext } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import UserContext from '../context/UserContext';

const Page = () => {
  const { profileData, movies } = useContext(UserContext);

  // Extract booking details from profileData
  const bookingDetails = profileData?.bookingDetails;

  if (!bookingDetails || bookingDetails.length === 0) {
    return <div className="text-center text-gray-600 py-10">No booking details found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-950">Your Bookings</h1>

      {/* Booking Details */}
      {bookingDetails.map((booking, index) => {
        
        const { date, movieName, seatNumber, showTime, tickets, _id } = booking;

        // Find the movie details from the movies array
        const movie = movies.find((movie) => movie.name === movieName);

        // Format the date
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div key={_id} className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Movie Poster */}
              <div className="w-full md:w-1/3 relative h-64 md:h-auto">
                {movie?.image ? (
                  <Image
                    src={movie.image.url} // Use the poster URL from the movies array
                    alt={movieName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                  />
                ) : (
                  <div className="bg-gray-200 flex items-center justify-center h-full">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Booking Information */}
              <div className="w-full md:w-2/3 p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{movieName}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Show Time and Date */}
                  <div>
                    <p className="text-gray-600 font-semibold">Show Time</p>
                    <p className="text-lg text-gray-500">{showTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Date</p>
                    <p className="text-lg text-gray-500">{formattedDate}</p>
                  </div>

                  {/* Tickets and Seats */}
                  <div>
                    <p className="text-gray-600 font-semibold">Tickets</p>
                    <p className="text-lg text-gray-500">{tickets}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {seatNumber.map((seat, seatIndex) => (
                        <span
                          key={seat._id}
                          className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-400"
                        >
                          {seat.row}-{seat.number}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Page;