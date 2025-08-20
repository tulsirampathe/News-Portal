import React, { useState } from "react";

const LoginModal = ({ isOpen, onClose, onLoginClick }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  // Controlled state for sign-up form
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  if (!isOpen) return null;

  const showSignUp = () => setIsLoginView(false);
  const showLogin = () => setIsLoginView(true);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    // Here you can do validation or API call with signUpData
    alert(`Sign Up Successful!\n\nName: ${signUpData.name}\nEmail: ${signUpData.email}\nPhone: ${signUpData.phone}`);
    onClose();
    setSignUpData({ name: "", email: "", phone: "", password: "" });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-96 p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent modal close on inside click
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {isLoginView ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onLoginClick();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                New user?{" "}
                <button
                  className="text-red-600 font-semibold hover:underline"
                  onClick={showSignUp}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  required
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={signUpData.phone}
                  onChange={handleSignUpChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  required
                  placeholder="Create a password"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  className="text-red-600 font-semibold hover:underline"
                  onClick={showLogin}
                >
                  Login
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
