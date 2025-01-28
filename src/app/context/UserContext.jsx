"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "../../config/axios";
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
const pathName=usePathname()
  const searchParams = useSearchParams();
  const profile = searchParams.get("profile");
  const seatBook = searchParams.get("bookSeats");
  const sessionId = searchParams.get("session_id");

  const addUser = useCallback((user) => {
    setUsers((prevUsers) => [user, ...prevUsers]);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!id) {
      toast.error("Invalid movie ID");
      return;
    }

    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        const response = await axios.delete(`/deleteMovie/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.status === 200) {
          setMovies((prevMovies) =>
            prevMovies.filter((movie) => movie._id !== id)
          );
          toast.success("Movie deleted successfully!", {
            className: "bg-red-500 text-white", // Tailwind classes for red background
            icon: "🗑️", // Add a delete-specific icon
          });
        }
      } catch (error) {
        console.error("Failed to delete movie:", error);
        toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again later.");
      }
    }
  }, []);

  const getSeats = useCallback(async () => {
    try {
      const response = await axios.get("/getSeats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setBookedSeats(response.data);
    } catch (error) {
      console.error("Failed to fetch booked seats:", error);
    }
  }, []);

  const bookMovie = useCallback(
    async (id, userId) => {
      if (!id) {
        toast.error("Invalid movie ID");
        return;
      }

      try {
        const movie = movies.find((movie) => movie._id === id);

        const updatedUsers = [...(movie?.users || []), userId]; // Ensure it's an array with the new user added

        const response = await axios.put(`/bookMovie/${id}`,
          { users: updatedUsers },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie._id === response.data._id ? response.data : movie
          )
        );

        setIsModalOpen(true); // Open modal on success
        router.push(`/bookSeats/${id}`); // Redirect to bookSeats
      } catch (error) {
        console.error("Failed to book movie:", error);
        toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again later.");
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
      const response = await axios.post(
        "/profile",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(response.data);
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
        axios.get("/getAllUsers"),
        axios.get("/getMovies", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(usersResponse.data);
      setMovies(moviesResponse.data);
    } catch (error) {
      console.error("Error fetching movies and users:", error);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("authToken");
      const role = localStorage.getItem("role");
  
      if (token) {
        
        setIsLoggedIn(true);
        setRoleType(role || "user");
  
        // Fetch movies and user data asynchronously
        try {
          await fetchMoviesAndUsers();
          await fetchRole(token);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
  
        // Handle routing based on role and path
        if (role === "admin" && (pathName === "/login" || pathName==="/") && pathName!=="/profile") {
          router.push("/addmovies");
        } else if (
          role === "user" &&
          !sessionId &&
          pathName !== "/profile" &&
          (pathName === "/" || pathName === "/login")
        ) {
          router.push("/viewmovie");
        } else if (pathName === "/profile") {
          router.push("/profile");
        }
      }
      
    };
  
    initialize();
  }, [ sessionId,fetchMoviesAndUsers, fetchRole, isLoggedIn]);
  

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
