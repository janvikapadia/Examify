import express from "express";
import bcryt from "bcrypt";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import axios from "axios";

var UserEmail = "";
var adminEmail = "";
var Email = ""

router.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res.json({ message: "User already exist!" });
  }

  const hashpassword = await bcryt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashpassword,
    role: role,
  });

  await newUser.save();
  return res.json({ status: true, message: "record registered" });
});


router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Email not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.Email,
      to: email,
      subject: "Reset Password",
      text: `http://localhost:3000/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcryt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "updated password" });
  } catch (err) {
    return res.json("invalid token");
  }
});



router.post("/login", async (req, res) => {
  const { email, password, captcha } = req.body;

  Email = email;

  try {
    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captcha,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: "CAPTCHA verification failed." });
    }

    const user = await User.findOne({ email });



    if (!user) {
      return res.json({ message: "Email is not registered!" });
    }

    if(user.role === 'user'){
      console.log('user')
      UserEmail = email
    }
    if(user.role === 'admin'){
      console.log('admin')
      adminEmail = email
    }

    const validPassword = await bcryt.compare(password, user.password);

    if (!validPassword) {
      return res.json({ message: "Password is incorrect!" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    return res.json({
      status: true,
      message: "Login Successfully",
      role: user.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

router.get("/admin", async (req, res) => {
  const user = await User.findOne({ email: adminEmail });
  console.log(user)

  res.json({ username: user.username });
});

router.get("/user", async (req, res) => {
  const id = await User.findOne({ email: UserEmail }).select('_id');
  const user = await User.findOne({ email: UserEmail });

  res.json({ username: user.username , user_id : id});
});

export { router as UserRouter };