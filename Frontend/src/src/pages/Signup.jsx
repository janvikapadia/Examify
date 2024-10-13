import React, { useState } from "react";
import "./Signup.css";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login from "./login.svg";  


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasDigit &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, digits, and special characters."
      );
      setIsLoading(false);
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3000/auth/signup", {
        username,
        email,
        password,
        role: isAdmin,
      });

      if (response.data.status) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          setIsLoading(false);
          navigate("/login");
        }, 3500);
      } else {
        toast.error(response.data.message || "Signup failed.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Signup error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="sign-up-container">
        <ToastContainer
          autoClose={2000}
          position="top-center"
          hideProgressBar={false}
        />
        <img src={login} alt="Signup illustration" className="signup-image" /> 
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h2>Signup</h2>
          <label htmlFor="username">Username:</label>
          <input
            className="username"
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
          />

          <label htmlFor="email">Email:</label>
          <input
            className="email"
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />

          <div className="password-container">
            <div className="password-input">
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="password"
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>

            <div className="password-input">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                className="password"
                id="confirm-password"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
              />
            </div>
          </div>

          <div className="password-container">
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          <div className="admin-selection">
            <label>Sign up as Admin:</label>
            <div className="radio-group">
              <div>
                <input
                  type="radio"
                  id="admin-yes"
                  name="admin"
                  value="yes"
                  checked={isAdmin === "admin"}
                  onChange={() => setIsAdmin("admin")}
                  aria-label="Sign up as Admin Yes"
                />
                <label htmlFor="admin-yes">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="admin-no"
                  name="admin"
                  value="no"
                  checked={isAdmin === "user"}
                  onChange={() => setIsAdmin("user")}
                  aria-label="Sign up as Admin No"
                />
                <label htmlFor="admin-no">No</label>
              </div>
            </div>
          </div>

          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </button>

          <p>
            Have an account?
            <u>
              <Link to="/login">Login</Link>
            </u>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
