import React, { useEffect, useState } from 'react';
import svgImage from '../assets/login.svg'; // Make sure to use the correct path for your SVG file
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate=useNavigate();
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
        navigate('/chat');
    }
  },[])

  const handleLogin = async (e) => {

    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://fitness-mate-backend.onrender.com/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Handle successful login (e.g., storing the token, redirecting the user)
      localStorage.setItem('token',data.token);
      navigate("/chat")
      console.log('Login successful:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:min-h-screen flex flex-col md:flex-row bg-main text-txt font-sans">
      {/* SVG Image Section - Hidden on mobile */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-rare p-8">
        <img src={svgImage} alt="Fitness-Mate" className="object-cover" />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-center bg-main">
        <h1 className="text-4xl md:text-5xl mb-2 font-robotic">Login</h1>
        <form onSubmit={handleLogin} className="w-full md:w-80 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-txt text-main py-2 px-4 rounded w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-txt text-main py-2 px-4 rounded w-full"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-rare text-main font-bold py-2 px-8 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
