import React, { useState } from "react";
import "./Signup.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setLoading(false);
      toast.error("Please enter a valid email address.");
      return;
    }

    Axios.post("http://localhost:3000/auth/forgot-password", { email })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          toast.success("Check your email for reset password link");
          setTimeout(() => {
            navigate("/login");
          }, 3500);
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
        <h2>Forgot Password</h2>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
