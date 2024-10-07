

import express from 'express'

import { Exam } from "../models/User.js";
import { Attempt } from "../models/User.js";

const app = express();

app.post('/exams', async (req, res) => {
    try {
        const exams = await Exam.find();
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching exams' });
    }
})

app.post('/review', async (req, res) => {
    try {
        const { examID, userId } = req.body;

        const attemptDetails = await Attempt.findOne({ 
            exam_id: examID, 
            user_id: userId 
        }).populate('user_id', 'username'); 

        if (attemptDetails) {
            res.json(attemptDetails);
        } else {
            res.status(200).json({ attempted: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking exam attempt', error });
    }
});



app.post('/attempted-exams', async (req, res) => {
    const { userId } = req.body;

    try {
        // Fetch exams attempted by the user from the Attempt table
        const attempts = await Attempt.find({ user_id: userId }).populate('exam_id'); // populate to get exam details
        
        if (!attempts || attempts.length === 0) {
            return res.status(404).json({ message: 'No attempted exams found for this user.' });
        }

        // Extract exam details from attempts and remove duplicates
        const attemptedExams = attempts.map(attempt => attempt.exam_id);

        return res.json(attemptedExams);
    } catch (error) {
        console.error('Error fetching attempted exams:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



export { app as Student };