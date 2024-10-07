import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './ExamPage.css';

Modal.setAppElement('#root');

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [examName, setExamName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [warnCount, setWarnCount] = useState(0);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
    const [autoSubmitTimer, setAutoSubmitTimer] = useState(null);
    const [examDuration, setExamDuration] = useState(0);
    const [pattern, setPattern] = useState({});

    const paperPattern = {
        "JEE MAIN": {
            "sections": ["Physics", "Chemistry", "Mathematics"],
            "marks_per_question": 4,
            "negative_marking": -1,
        },
        "GATE": {
            "sections": ["General Aptitude", "Core Subject"],
            "marks_per_question": 2,
            "negative_marking": -1,
        },
        "CAT": {
            "sections": ["Verbal Ability and Reading Comprehension", "Data Interpretation and Logical Reasoning", "Quantitative Ability"],
            "marks_per_question": 3,
            "negative_marking": -1,
        }
    };

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const userResponse = await axios.get("http://localhost:3000/auth/user");
                const fetchedUserId = userResponse.data.user_id._id;
                setUserId(fetchedUserId);
                console.log('Fetched User ID:', fetchedUserId);

                const response = await axios.get(`http://localhost:3000/exam/details/${examId}`);
                const examDetails = response.data;
                setQuestions(examDetails.questions);
                setExamDuration(examDetails.exam_duration * 60); // Convert minutes to seconds
                setExamName(examDetails.exam_name); // Set exam name
                setStartTime(Date.now()); // Set the start time when exam details are fetched

                // Set pattern based on exam name
                const examPattern = paperPattern[examDetails.exam_name] || {};
                setPattern(examPattern);
                console.log(examId);
            } catch (error) {
                console.error('Error fetching exam details:', error);
            }
        };

        fetchExamDetails();
    }, [examId]);

    useEffect(() => {
        if (examDuration > 0 && startTime) {
            setTimer(examDuration);
        }
    }, [examDuration, startTime]);

    useEffect(() => {
        if (timer > 0 && !showResults) {
            const intervalId = setInterval(() => {
                setTimer(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(intervalId);
                        handleSubmitExam();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [timer, showResults]);

   useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.hidden && !showResults) {
            if (warnCount < 3) {
                setWarnCount(prevCount => prevCount + 1);
                setIsWarningModalOpen(true);

                if (warnCount === 2) {
                    // On third warning, notify user about auto-submit
                    setIsWarningModalOpen(false); // Close warning modal
                    setIsCountdownModalOpen(true); // Open countdown modal
                    setAutoSubmitTimer(setTimeout(() => {
                        handleSubmitExam();
                    }, 5000)); // 5 seconds countdown before auto-submit
                }
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (autoSubmitTimer) clearTimeout(autoSubmitTimer); // Clean up timer on unmount
    };
}, [warnCount, showResults, autoSubmitTimer]);

    const handleAnswerChange = (answer) => {
        setUserAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers };
            if (updatedAnswers[currentIndex] === answer) {
                delete updatedAnswers[currentIndex]; // Deselect answer
            } else {
                updatedAnswers[currentIndex] = answer;
            }
            return updatedAnswers;
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNavigate = (index) => {
        setCurrentIndex(index);
    };

    const handleSubmitExam = async () => {
        setShowResults(true);
        setIsModalOpen(true);
        setIsCountdownModalOpen(false);
        setTimer(0);

        const score = calculateScore();
        const { attempted, correct, wrong, unattempted } = getStats();
        const timeTaken = calculateTimeTaken();

        try {
            await axios.post('http://localhost:3000/exam/submit-results', {
                userId,
                examId,
                score,
                timeTaken,
                noOfWrongQuestions: wrong,
                noOfRightQuestions: correct,
                noOfQuestionsAttempted: attempted,
                noOfUnattempted: unattempted
            });
        } catch (error) {
            console.error('Error submitting exam results:', error);
        }

        setTimeout(() => {
            navigate('/student');
        }, 10000);
    };

    const calculateScore = () => {
        let score = 0;
        const marksPerQuestion = pattern.marks_per_question || 0;
        const negativeMarking = pattern.negative_marking || 0;

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer === question.correct_answer) {
                score += marksPerQuestion;
            } else if (userAnswer) {
                score += negativeMarking;
            }
        });

        return score;
    };

    const getStats = () => {
        const attempted = Object.keys(userAnswers).length;
        const correct = questions.filter((q, i) => userAnswers[i] === q.correct_answer).length;
        const wrong = attempted - correct;
        const unattempted = questions.length - attempted;

        return { attempted, correct, wrong, unattempted };
    };

    const calculateTimeTaken = () => {
        if (!startTime) return 0;
        return Math.floor((Date.now() - startTime) / 1000); // Time taken in seconds
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="exam-page">
            <div className="exam-navbar">
                <div className="exam-name">{examName}</div>
                <div className="timer">{formatTime(timer)}</div>
                <div className="question-info">
                    {showResults ? 'Submitted Successfully' : `Question ${currentIndex + 1} of ${questions.length}`}
                </div>
            </div>

            {!showResults ? (
                <div className="content">
                    {questions.length > 0 && (
                        <div className="question-container">
                            <h4>{questions[currentIndex].question_text}</h4>
                            <div className="options-container">
                                <button
                                    className={`option-button ${userAnswers[currentIndex] === questions[currentIndex].option_a ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(questions[currentIndex].option_a)}
                                >
                                    1. {questions[currentIndex].option_a}
                                </button>
                                <button
                                    className={`option-button ${userAnswers[currentIndex] === questions[currentIndex].option_b ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(questions[currentIndex].option_b)}
                                >
                                    2. {questions[currentIndex].option_b}
                                </button>
                                <button
                                    className={`option-button ${userAnswers[currentIndex] === questions[currentIndex].option_c ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(questions[currentIndex].option_c)}
                                >
                                    3. {questions[currentIndex].option_c}
                                </button>
                                <button
                                    className={`option-button ${userAnswers[currentIndex] === questions[currentIndex].option_d ? 'selected' : ''}`}
                                    onClick={() => handleAnswerChange(questions[currentIndex].option_d)}
                                >
                                    4. {questions[currentIndex].option_d}
                                </button>
                            </div>
                            <div className="navigation-buttons">
                                <button className="prev-button" onClick={handlePrevious} disabled={currentIndex === 0}>Previous</button>
                                <button className="submit-button" onClick={handleSubmitExam}>Submit Exam</button>
                                <button className="next-button" onClick={handleNext} disabled={currentIndex === questions.length - 1}>Next</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            <div className="navigation-panel">
                <h3>Question Navigation</h3>
                <div className="navigation-buttons">
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            className={`nav-button ${userAnswers[index] ? 'answered' : ''} ${currentIndex === index ? 'active' : ''}`}
                            onClick={() => handleNavigate(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isWarningModalOpen}
                onRequestClose={() => setIsWarningModalOpen(false)}
                contentLabel="Warning"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        textAlign: 'center'
                    }
                }}
            >
                <h2>Warning {warnCount} of 3</h2>
                <p>You have switched tabs. Please complete the exam.</p>
            </Modal>

            <Modal
                isOpen={isCountdownModalOpen}
                onRequestClose={() => setIsCountdownModalOpen(false)}
                contentLabel="Countdown"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        textAlign: 'center'
                    }
                }}
            >
                <h2>Warning {warnCount} of 3</h2>
                <p>Submitting automatically in 5 seconds...</p>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Results"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        textAlign: 'center'
                    }
                }}
            >
                <h2>Exam Results</h2>
                <p>Time Taken: {formatTime(calculateTimeTaken())}</p>
                <p>Questions Attempted: {getStats().attempted}</p>
                <p>Questions Unattempted: {getStats().unattempted}</p>
                <button onClick={() => navigate('/student')}>Okay</button>
            </Modal>
        </div>
    );
};

export default ExamPage;



