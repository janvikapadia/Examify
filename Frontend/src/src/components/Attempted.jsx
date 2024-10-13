import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Attempted.css';

export const Attempted = ({
    buttonColor = '#1689f0',
    buttonText = 'REVIEW',
    backgroundColor = "linear-gradient(to right, #8ec4f4, #1689f0)",
    modalButtonText = "CLOSE"
}) => {
    const [attemptedExams, setAttemptedExams] = useState([]);
    const [attempts, setAttempts] = useState(null);
    const [userId, setUserId] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default

    useEffect(() => {
        const fetchAttemptedExams = async () => {
            try {
                const userResponse = await axios.get('http://localhost:3000/auth/user');
                const fetchedUserId = userResponse.data.user_id._id;
                setUserId(fetchedUserId);

                const response = await axios.post('http://localhost:3000/student/attempted-exams', { userId: fetchedUserId });
                setAttemptedExams(response.data);
            } catch (error) {
                console.error('Error fetching attempted exams:', error);
            }
        };

        fetchAttemptedExams();
    }, []);


    // Filter exams based on selected exam type
    useEffect(() => {
        if (selectedExamType === 'All') {
            setFilteredExams(attemptedExams); // Show all exams
        } else {
            setFilteredExams(attemptedExams.filter(exam => exam.exam_name === selectedExamType));
        }
    }, [selectedExamType, attemptedExams]);

    const handleExamTypeChange = (e) => {
        setSelectedExamType(e.target.value);
    };




    const openReviewModal = async (examId) => {
        try {
            const response = await axios.post('http://localhost:3000/student/review', {
                examID: examId,
                userId: userId
            });
            setAttempts(response.data);
            setSelectedExam(examId);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching review data:', error);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAttempts(null);
        setSelectedExam(null);
    };

    const getExamBackgroundColor = (examName) => {
        if (examName.includes("JEE")) {
            return '#ffffff';
        } else if (examName.includes("GATE")) {
            return '#ffffff';
        } else if (examName.includes("CAT")) {
            return '#ffffff';
        } else {
            return backgroundColor;
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: 0, margin: '15px' }}>
            <div className="filter-dropdown">
                <h4>Exam : &nbsp;</h4>
                <select
                    id="exam-type"
                    className="border rounded-md p-2"
                    value={selectedExamType}
                    onChange={handleExamTypeChange}
                >
                    <option value="All">All</option>
                    <option value="JEE MAIN">JEE MAIN</option>
                    <option value="GATE">GATE</option>
                    <option value="CAT">CAT</option>
                </select>
            </div>
            <div className="exam-container">
                {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                        <div
                            key={index}
                            className="exam-card"
                            style={{ background: getExamBackgroundColor(exam.exam_name) }}
                        >
                            <div className="exam-details">
                                <div className="exam-name">{exam.exam_name}</div>
                                <div className="exam-date">Date: {exam.exam_date.split('T')[0]}</div>
                                <div className="exam-time">Time: {exam.exam_time}</div>
                            </div>
                            <div className="exam-actions">
                                <button
                                    className="review-button"
                                    onClick={() => openReviewModal(exam._id)}
                                    style={{ color: '#fff', backgroundColor: buttonColor }}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No attempted exams found.</p>
                )}

                {/* Modal for Review Data */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Review Modal"
                    shouldCloseOnOverlayClick={false}
                    style={{
                        content: {
                            top: '300px',
                            left: '39.49%',
                            right: '10%',
                            bottom: 'auto',
                            transform: 'translate(-10%, -30%)',
                            width: '400px',
                            maxWidth: '90%',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 1.1)',
                        },
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Result</h2>
                    <div style={{
                        border: '2px solid black',
                        padding: '15px',
                        borderRadius: '10px',
                        marginBottom: '20px'
                    }}>
                        {attempts ? (
                            <>
                                <p><strong>Score: </strong>{attempts.score}</p>
                                <p><strong>Time Taken: </strong>{attempts.time_taken} sec</p>
                                <p><strong>Attempted Questions: </strong>{attempts.no_of_questions_attempted}</p>
                                <p><strong>Unattempted Questions: </strong>{attempts.no_of_unattempted}</p>
                                <p><strong>Correct Answers: </strong>{attempts.no_of_right_questions}</p>
                                <p><strong>Incorrect Answers: </strong>{attempts.no_of_wrong_questions}</p>
                            </>
                        ) : (
                            <p style={{ textAlign: 'center' }}>No review data available.</p>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={closeModal} className='btn btn-danger'
                            style={{ width: '80px', textAlign: 'center', fontSize: '15px' }}>{modalButtonText}</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
