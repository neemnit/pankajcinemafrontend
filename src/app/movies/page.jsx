"use client";
import React, { useContext } from 'react';
import UserContext from '../context/UserContext';

const Movies = () => {
  const { movies } = useContext(UserContext);

  return (
    <div>
      {movies.length === 0 ? (
        <h1>No movies currently</h1>
      ) : (
        <h1>Now Showing Movies</h1>
      )}
    </div>
  );
};

export default Movies;
