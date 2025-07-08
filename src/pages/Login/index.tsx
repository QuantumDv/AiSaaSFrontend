import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success) {
      timer = setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("https://api.freezygig.com/api/auth/login", {
        email,
        password,
      }, {withCredentials: true});
      setSuccess("Login successful! Redirecting...");
      console.log("Login success:", response.data);
      await refreshAuth();
      navigate("/");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
      <div className="backdrop-blur-xl bg-white bg-opacity-10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md transition-transform hover:scale-105 duration-300">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 mb-8 drop-shadow-lg">
          Welcome Back
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-20 backdrop-blur-md text-black placeholder:text-grey border-white/30 focus:border-pink-300 focus:ring-2 focus:ring-pink-400 transition-all"
            />
          </div>
          <div className="form-control">
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-white bg-opacity-20 backdrop-blur-md text-black placeholder:text-grey border-white/30 focus:border-pink-300 focus:ring-2 focus:ring-pink-400 transition-all"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm mb-2">
              {success}
            </div>
          )}
          <div className="flex justify-between items-center text-white text-sm">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-accent" />
              Remember me
            </label>
            <a href="/signup" className="link text-black link-hover hover:text-yellow-300 transition-colors">
              Don't have an account?
            </a>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full btn-lg bg-gradient-to-r from-pink-400 to-purple-500 border-none shadow-xl hover:brightness-110 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
