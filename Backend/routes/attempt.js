import express from 'express';
import { Question, Exam } from "../models/User.js";  
import { Attempt } from '../models/User.js';
const router = express.Router();


router.get('/questions/:examId', async (req, res) => {
    const { examId } = req.params;

    try {
       
        const questions = await Question.find({ exam_id: examId });

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam.' });
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

router.post('/save', async (req, res) => {
    console.log('Request body:', req.body);
    const { examID, userId } = req.body;

    try {
        const newAttempt = new Attempt({
            user_id: userId,
            exam_id: examID,
            score: 0, // Initially zero
            no_of_unattempted: 0, // Initially zero, can be updated later
            time_taken: 0, // Can be updated after exam completion
            no_of_wrong_questions: 0, // Initially zero
            no_of_right_questions: 0, // Initially zero
            no_of_questions_attempted: 0, // Initially zero
        });

        await newAttempt.save();

        res.status(201).json({ message: 'Exam attempt saved successfully' });
    } catch (error) {
        console.error('Error saving exam attempt:', error);
        res.status(500).json({ message: 'Error saving exam attempt' });
    }
});



router.get('/check/:userId/:examId', async (req, res) => {
    try {
        const { userId, examId } = req.params;
        console.log(userId)
        console.log(examId)

        // Find an attempt with the matching userId and examId
        const attempt = await Attempt.findOne({ user_id: userId, exam_id:examId });

        if (attempt) {
            // User has already attempted the exam
            res.status(200).json({ attempted: true });
        } else {
            // User has not attempted the exam
            res.status(200).json({ attempted: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking exam attempt', error });
    }
});




router.get('/details/:examId', async (req, res) => {
    const { examId } = req.params;

    console.log('Received examId:', examId);

    try {
        const exam = await Exam.findById(examId);
        if (!exam) {
            console.log('Exam not found:', examId);
            return res.status(404).json({ message: 'Exam not found' });
        }

        console.log('Exam found:', exam);

        const questions = await Question.find({ exam_id: examId });
        console.log('Questions found:', questions);

        res.status(200).json({
            ...exam.toObject(),
            questions
        });
    } catch (error) {
        console.error('Error fetching exam details:', error);
        res.status(500).json({ message: 'Error fetching exam details' });
    }
});




router.post('/submit-results', async (req, res) => {
    const { userId, examId, score, timeTaken, noOfWrongQuestions, noOfRightQuestions, noOfQuestionsAttempted, noOfUnattempted } = req.body;

    try {
        // Find and update the attempt record for the given user and exam
        const updatedAttempt = await Attempt.findOneAndUpdate(
            { user_id: userId, exam_id: examId },
            {
                score,
                time_taken: timeTaken,
                no_of_wrong_questions: noOfWrongQuestions,
                no_of_right_questions: noOfRightQuestions,
                no_of_questions_attempted: noOfQuestionsAttempted,
                no_of_unattempted: noOfUnattempted
            },
            { new: true } // Return the updated document
        );

        if (!updatedAttempt) {
            return res.status(404).json({ message: 'Attempt record not found' });
        }

        res.status(200).json({ message: 'Results updated successfully', updatedAttempt });
    } catch (error) {
        console.error('Error updating exam results:', error);
        res.status(500).json({ message: 'Error updating exam results' });
    }
});



export { router as Exam };  
