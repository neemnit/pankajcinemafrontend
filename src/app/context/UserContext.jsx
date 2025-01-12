"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Create the context with default values
export const UserContext = createContext({
  addUser: () => {},
  checkUnique: () => true,
  isLoggedIn: false,
  updateLoggedIn: () => {},
  movies: [],
  setMovies: () => {},
  roleType: "user",
  setRoleType: () => {},
  fetchRole: () => {},
  profileData: {
    name: "",
    email: "",
    adharNo: "",
    password: "",
  },
  setProfileData: () => {},
  getMovies: () => {},
  handleDelete: () => {},
  bookMovie: () => {},
  users: [],
  isModalOpen: true,
  setIsModalOpen: () => {},
  handleTicketSubmit: () => {},
  ticketCount: 1,
  setTicketCount: () => {},
  bookedSeats: [],
  setBookedSeats: () => {},
  getSeats: () => {},
});

// Provider component
export const ThemeProvider = ({ children }) => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [roleType, setRoleType] = useState("user");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    adharNo: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const profile = searchParams.get("profile");
  const seatBook = searchParams.get("bookSeats");
  const sessionId = searchParams.get("session_id");

  const addUser = useCallback((user) => {
    setUsers((prevUsers) => [user, ...prevUsers]);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!id) {
      alert("Invalid movie ID");
      return;
    }

    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        const response = await fetch(
          `http://localhost:4000/deleteMovie/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.ok) {
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie._id !== id)
          );
          toast.success("Movie deleted successfully!", {
            className: "bg-red-500 text-white", // Tailwind classes for red background
            icon: "🗑️", // Add a delete-specific icon
          });
        } else {
          const errorData = await response.json();
          toast.error(`Error deleting movie: ${errorData.message || "Unknown error"}`)
        }
      } catch (error) {
        console.error("Failed to delete movie:", error);
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }, []);

  const getSeats = useCallback(async () => {
    try {
      const response = await fetch("https://pankajcinemabackend-1.onrender.com/getSeats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBookedSeats(data);
      }
    } catch (error) {
      console.error("Failed to fetch booked seats:", error);
    }
  }, []);
  const bookMovie = useCallback(
    async (id, userId) => {
      if (!id) {
        alert("Invalid movie ID");
        return;
      }

      try {
        const movie = movies.find((movie) => movie._id === id);

        const updatedUsers = [...(movie?.users || []), userId]; // Ensure it's an array with the new user added

        const response = await fetch(`https://pankajcinemabackend-1.onrender.com/bookMovie/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ users: updatedUsers }), // Send the updated array
        });

        if (response.ok) {
          const updatedMovie = await response.json();
          setMovies((prevMovies) =>
            prevMovies.map((movie) =>
              movie._id === updatedMovie._id ? updatedMovie : movie
            )
          );

          setIsModalOpen(true); // Open modal on success
          router.push(`/bookSeats/${id}`); // Redirect to bookSeats
        } else {
          const errorData = await response.json();
          alert(`Error booking movie: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Failed to book movie:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    },
    [movies]
  );

  const handleTicketSubmit = () => {
    if (ticketCount > 0) {
      setIsModalOpen(!isModalOpen);
    }
  };

  const fetchRole = useCallback(async (token) => {
    try {
      const response = await fetch("https://pankajcinemabackend-1.onrender.com/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch role");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  }, []);

  const checkUnique = useCallback(
    (value) => {
      return !users.some((user) =>
        value.length === 16 && !value.includes("@")
          ? user.adharNo === value
          : user.email.split("@")[0] === value.split("@")[0]
      );
    },
    [users]
  );

  const fetchMoviesAndUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authorization token not found.");

      const [usersResponse, moviesResponse] = await Promise.all([
        fetch("https://pankajcinemabackend-1.onrender.com/getAllUsers"),
        fetch("https://pankajcinemabackend-1.onrender.com/getMovies", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      if (moviesResponse.ok) {
        const moviesData = await moviesResponse.json();
        setMovies(moviesData);
      }
    } catch (error) {
      console.error("Error fetching movies and users:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("toeknwa",token)
    const role = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRoleType(role || "user");
      fetchMoviesAndUsers();
      fetchRole(token);

      if (role === "admin") {
        router.push("/addmovies");
      } else if (role === "user" && !sessionId) {
        router.push("/viewmovie");
      }
    } else if (router.pathname !== "/login") {
      // Redirect to login if not logged in
      router.push("/login");
    }
  }, [fetchMoviesAndUsers, fetchRole, isLoggedIn, router.pathname]);

  const contextValue = useMemo(
    () => ({
      addUser,
      checkUnique,
      isLoggedIn,
      updateLoggedIn: setIsLoggedIn,
      movies,
      setMovies,
      roleType,
      setRoleType,
      fetchRole,
      profileData,
      setProfileData,
      handleDelete,
      bookMovie,
      users,
      isModalOpen,
      setIsModalOpen,
      handleTicketSubmit,
      ticketCount,
      setTicketCount,
      fetchMoviesAndUsers,
      bookedSeats,
      setBookedSeats,
      getSeats,
    }),
    [
      addUser,
      checkUnique,
      isLoggedIn,
      movies,
      roleType,
      profileData,
      handleDelete,
      bookMovie,
      users,
      isModalOpen,
      ticketCount,
      fetchMoviesAndUsers,
      bookedSeats,
      setBookedSeats,
      getSeats,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContext;
