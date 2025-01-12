"use client"
import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";

const MovieForm = () => {
  const { setMovies, movies } = useContext(UserContext); // Assuming `setMovies` updates the movie list.
  const [formData, setFormData] = useState({
    name: "",
    ticketPrice: "",
    description: "",
    releaseDate: "", // New field for release date
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files?.[0] || null,
      }));
    }
  };

  const addMovie = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Unauthorized: Token missing");
      }

      const movieData = new FormData();
      movieData.append("name", data.name);
      movieData.append("ticketPrice", data.ticketPrice);
      movieData.append("description", data.description);
      movieData.append("releaseDate", data.releaseDate); // Append release date
      if (data.image) {
        movieData.append("image", data.image);
      }

      const response = await fetch("http://localhost:4000/addMovie", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: movieData,
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      const result = await response.json();
      alert("Movie added successfully!");

      // Assuming `result` is the newly created movie object
      setMovies((prevMovies) => [...prevMovies, result]);

      // Reset form after successful submission
      setFormData({ name: "", ticketPrice: "", description: "", releaseDate: "", image: null });
    } catch (error) {
      console.error("Error adding movie:", error);
      alert(`Failed to add movie: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!formData.image) {
      alert("Please upload an image");
      setIsSubmitting(false);
      return;
    }

    addMovie(formData);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add a New Movie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Movie Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="ticketPrice" className="block font-medium">
            Ticket Price
          </label>
          <input
            id="ticketPrice"
            name="ticketPrice"
            type="text"
            value={formData.ticketPrice}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div>
          <label htmlFor="releaseDate" className="block font-medium">
            Release Date
          </label>
          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium">
            Upload Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 text-white rounded-md ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
