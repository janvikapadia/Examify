import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { UserRouter } from "./routes/user.js";
import { Student } from './routes/student.js';
import { Exam } from "./routes/attempt.js";
import { Admin } from "./routes/addexam.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use("/auth", UserRouter);
app.use("/student", Student);
app.use("/exam", Exam)
app.use('/admin', Admin)

mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
