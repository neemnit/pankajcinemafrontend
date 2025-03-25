"use client";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import UserContext from "../context/UserContext";
import { notFound, usePathname ,useRouter} from "next/navigation";
import NotFound from "../not-found";



const Page = () => {
  const {
    movies,
    roleType,
    handleDelete,
    bookMovie,
    profileData,
    fetchMoviesAndUsers,
  } = useContext(UserContext);
  const pathName=usePathname()
const router=useRouter()
  useEffect(() => {
    if(pathName!="/viewmovie"){
        notFound()
    }
  if(!localStorage.getItem("authToken")){
    router.push('/login')
  
  }
    fetchMoviesAndUsers();
  }, [fetchMoviesAndUsers]);

  if (!movies || movies.length === 0) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-center">
        <h1 className="text-2xl font-bold">No Movies Available</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-950">
        {movies.length === 0 ? "No Movies Currently" : "Now Showing Movies"}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => {
          const movieId = movie._id ?? "";
          const userEmail = profileData?._id ?? "";

          return (
            <div
              key={movieId}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-36">
                <Image
                  src={movie?.image?.url || "https://via.placeholder.com/300x200"}
                  alt={movie.name || "Movie"}
                 
                  objectFit="cover"
                  className="rounded-t-lg"
                   layout="fill"
                />
              </div>

              <div className="p-3">
                <h2 className="text-sm font-semibold text-gray-800 mb-2 text-center">
                  {movie.name}
                </h2>
                <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                  {movie.description}
                </p>
                <p className="text-gray-800 font-medium text-sm text-center mb-3">
                  Ticket Price: ₹{movie.ticketPrice}
                </p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      if (movieId && userEmail) {
                        bookMovie(movieId, userEmail);
                      } else {
                        alert("Invalid movie or user details.");
                      }
                    }}
                    className="flex-1 py-1 px-3 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Book
                  </button>

                  {roleType === "admin" && (
                    <button
                      onClick={() => {
                        if (movieId) {
                          handleDelete(movieId);
                        } else {
                          alert("Invalid movie ID.");
                        }
                      }}
                      className="flex-1 ml-2 py-1 px-3 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
