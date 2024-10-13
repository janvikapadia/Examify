import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Student from "./pages/Student.jsx";
import ExamPage  from "./pages/ExamPage.jsx";
import Admin from "./pages/Admin.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
        <Route path="/student" element={<Student />}></Route>
        <Route path="/exam/:examId" element={<ExamPage />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
