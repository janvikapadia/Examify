import React, { useState } from "react";
import "./Signup.css";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePassword(password)) {
      setLoading(false);
      toast.error(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      toast.error("Passwords do not match.");
      return;
    }

    Axios.post(`http://localhost:3000/auth/reset-password/` + token, {
      password,
    })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          toast.success("Password reset successfully. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          toast.error(
            response.data.message || "Something went wrong. Please try again."
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("An error occurred. Please try again.");
        console.log(err);
      });
  };

  return (
    <div className="sign-up-container">
      <ToastContainer
        autoClose={3000}
        position="top-center"
        hideProgressBar={false}
      />
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <label htmlFor="password">New Password: </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirm-password">Confirm Password: </label>
        <input
          type={showPassword ? "text" : "password"}
          id="confirm-password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="password-container">
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
