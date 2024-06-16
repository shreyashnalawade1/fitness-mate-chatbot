import React from 'react';
import logo from '../assets/botIcon.png';
import { NavLink, Navigate } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-main text-txt font-sans">
      {/* Logo Section */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-main p-8 md:bg-main-faint">
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-4 bg-main border-rare flex overflow-hidden justify-center items-center">
          <img src={logo} alt="Fitness-Mate Logo" className="w-48 md:w-80 animate-spin-slow" />
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-center bg-main">
        <h1 className="text-4xl md:text-5xl mb-2 font-robotic">Fitness-Mate</h1>
        <p className="text-lg md:text-xl mb-4 hidden md:block">Your Health, Our Priority</p> {/* Tagline hidden on mobile */}
        <p className="text-md md:text-lg max-w-md mb-8">
          Fitness-Mate is your advanced health chatbot, dedicated to providing you with personalized health tips and 24/7 assistance, ensuring your well-being is always a priority.
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <button className="bg-rare text-main font-bold py-2 px-8 md:px-10 rounded w-full md:w-auto" ><NavLink to="/signup">Sign Up</NavLink></button>
          <button className="bg-txt text-main font-bold py-2 px-8 md:px-10 rounded w-full md:w-auto">
          <NavLink to="/login">Sign In</NavLink></button>
        </div>
      </div>
    </div>
  );
}

export default Home;
