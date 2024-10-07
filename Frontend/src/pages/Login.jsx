import React, { useState } from "react";
import "./login.css";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import login from "./login.svg"; 

const RECAPTCHA_SITE_KEY = "6LdNBC8qAAAAABsbQI12GsvrL6pjtJmJVRg8qTHN";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaKey, setRecaptchaKey] = useState(Date.now());

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const reloadCaptcha = () => {
    setRecaptchaKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !captchaValue) {
      toast.error("Please fill in all fields and complete the CAPTCHA.");
      return;
    }

    setLoading(true);

    try {
      const response = await Axios.post("http://localhost:3000/auth/login", {
        email,
        password,
        captcha: captchaValue,
      });
      if (response.data.status) {
        toast.success("Login successful!");
        if (response.data.role === "admin") {
          setTimeout(() => navigate("/admin"), 1500);
        } else {
          setTimeout(() => navigate("/student"), 3500);
        }
      } else {
        setLoading(false);
        toast.error(response.data.message || "Login failed.");
        setTimeout(reloadCaptcha, 3500);
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={login} alt="Exam Illustration" className="login-svg" />
      </div>

      <div className="login-right">
        <ToastContainer
          autoClose={1000}
          position="top-center"
          hideProgressBar={false}
        />
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle-button "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              key={recaptchaKey}
            />
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link to="/forgotPassword">Forgot Password?</Link>

          <p>
            Don't have an Account? &nbsp;
            <u>
              <Link to="/signup">Sign Up</Link>
            </u>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;