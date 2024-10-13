import express from "express";
import { Exam } from "../models/User.js";
import { Question } from "../models/User.js";
import { Attempt } from "../models/User.js";
import { User } from "../models/User.js";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail, but you can configure any SMTP service
    auth: {
        user: process.env.Email,
        pass: process.env.PASS,
    },
});

const app = express();
let tempExamId;

app.post('/addexams', async (req, res) => {
    try {
        const newExam = new Exam(req.body);
        tempExamId = newExam._id;
        await newExam.save();

        return res.json({ status: true, message: newExam });
        // return res.json({ status: true, message: 'Exam added successfully!' });
    } catch (error) {
        console.error('Error adding exam:', error);
        res.status(400).json({ status: false, message: 'Failed to add exam.', error: error.message });
    }


});

app.post('/exams', async (req, res) => {
    try {

        const exams = await Exam.find();
        console.log(exams)

        return res.status(200).json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Failed to fetch exams' });
    }
});




app.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedExam = req.body;
        // console.log(Updating exam with ID: ${id}, updatedExam);

        const exam = await Exam.findOneAndUpdate({ _id: id }, updatedExam, { new: true, runValidators: true });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (updatedExam.status === "Live") {
            // Fetch all users with the role of "user" (students)
            const students = await User.find({ role: 'user' });

            // Send an email to each student
            students.forEach(student => {
                const mailOptions = {
                    from: process.env.Email, 
                    to: student.email, 
                    subject: `Exam ${exam.exam_name} is Now Live!`,
                    text: `Dear ${student.username},\n\nThe exam "${exam.exam_name}" is now live. \n\nDate: ${new Date(exam.exam_date).toLocaleDateString()} \nTime: ${new Date(exam.exam_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.\n\nYou can start attempting it.\nBest of luck!\n\nRegards,\nExam Admin`,
                };

                // Send the email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
            });
        }


        res.status(200).json(exam);
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ message: 'Failed to update exam' });
    }
});










app.delete('/delete/:id', async (req, res) => {
    try {
        const examId = req.params.id;
        

        try{
            await Question.deleteMany({ exam_id: examId }); 
            await Exam.findByIdAndDelete(examId); 
            const attempts = await Attempt.find({ exam_id: examId });
            if(attempts.length > 0){
                await Attempt.deleteMany({ exam_id: examId }); 
                return res.status(200).json({ message: 'Exam Deleted ' });
            }
               
              
        }
        catch{
            await Question.deleteMany({ exam_id: examId }); 
            await Exam.findByIdAndDelete(examId);

        }

        res.status(200).send({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting exam' });
    }
});









app.post('/addquestions', async (req, res) => {
    try {
        const questions = req.body; // Array of question objects
        const savedQuestions = await Question.insertMany(questions);
        return res.json({ status: true, message: savedQuestions });
    } catch (error) {
        console.error('Error saving questions:', error);
        res.status(500).json({ message: 'Failed to save questions' });
    }
});

app.post('/review/:examId', async (req, res) => {
    try {
        const examId = req.params.examId;

        // Fetch attempts for the given examId
        const attempts = await Attempt.find({ exam_id: examId })
            .populate('user_id', 'username') // Assuming 'user_id' references the 'User' model with a 'username' field
            .exec();

        // If no attempts found, return a message
        if (!attempts || attempts.length === 0) {
            return res.status(404).json({ message: 'No review data available for this exam.' });
        }

        // Return the review data
        res.json(attempts);
    } catch (error) {
        console.error('Error fetching review data:', error);
        res.status(500).json({ error: 'Server error fetching review data.' });
    }
});


export { app as Admin };