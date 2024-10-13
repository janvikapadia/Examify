



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Completed.css';
import * as XLSX from 'xlsx';



export const Completed = ({
    buttonColor = '#1689f0',
    buttonText = 'REVIEW',
}) => {
    const [completedExams, setCompletedExams] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [attempts, setAttempts] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default


    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/exams');
                const exams = response.data;

                const offset = 330; // IST is UTC+5:30
                const currentDateTimeUTC = new Date();
                const currentDateTimeIST = new Date(currentDateTimeUTC.getTime() + offset * 60 * 1000);

                const filteredExams = exams.filter(exam => {
                    const examStartDateTimeUTC = new Date(`${exam.exam_date.slice(0, 10)}T${exam.exam_time}:00Z`);
                    const examStartDateTimeIST = new Date(examStartDateTimeUTC.getTime() + offset * 60 * 1000);

                    const examDurationMinutes = Number(exam.exam_duration);
                    const examEndDateTimeUTC = new Date(examStartDateTimeUTC.getTime() + examDurationMinutes * 60000);
                    const examEndDateTimeIST = new Date(examEndDateTimeUTC.getTime() + offset * 60 * 1000);

                    const isCompleted = exam.status === 'Completed';

                    return isCompleted;
                });

                setCompletedExams(filteredExams);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);



    // Filter exams based on selected exam type
    useEffect(() => {
        if (selectedExamType === 'All') {
            setFilteredExams(completedExams); // Show all exams
        } else {
            setFilteredExams(completedExams.filter(exam => exam.exam_name === selectedExamType));
        }
    }, [selectedExamType, completedExams]);

    const handleExamTypeChange = (e) => {
        setSelectedExamType(e.target.value);
    };




    const getExamBackgroundColor = (examName) => {
        if (examName.includes("JEE")) {
            return '#ffffff';
        } else if (examName.includes("GATE")) {
            return '#ffffff';
        } else if (examName.includes("CAT")) {
            return '#ffffff';
        } else {
            return 'linear-gradient(to right, #8ec4f4, #1689f0)';
        }
    };

    const openModal = async (examId) => {
        try {
            // Fetch the review data even if no attempts are found
            const response = await axios.post(`http://localhost:3000/admin/review/${examId}`);
            setAttempts(response.data);  // It will be an empty array if no attempts exist
        } catch (error) {
            console.error('Error fetching review data:', error);
        }

        // Always open the modal, even if no attempts are found
        setSelectedExam(examId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAttempts([]);
        setSelectedExam(null);
    };







    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(attempts.map(attempt => ({
            UserID: attempt.user_id._id,
            Username: attempt.user_id.username,
            Score: attempt.score,
            CorrectAnswers: attempt.no_of_right_questions,
            IncorrectAnswers: attempt.no_of_wrong_questions,
            TimeTaken: attempt.time_taken,
            AttemptedQuestions: attempt.no_of_questions_attempted,
            UnattemptedQuestions: attempt.no_of_unattempted,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Exam Review');

        // Export the Excel file
        XLSX.writeFile(workbook, 'exam_review.xlsx');
    };


    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '1000px',
            padding: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
                            style={{ background: getExamBackgroundColor(exam.exam_name) , border: '1px solid'}}
                        >
                            <div className="exam-details">
                                <div className="exam-name">{exam.exam_name}</div>
                                <div className="exam-date">Date: {exam.exam_date.split('T')[0]}</div>
                                <div className="exam-time">Time: {exam.exam_time.slice(0, 5)}</div>
                            </div>
                            <div className="exam-actions">
                                <button
                                    className="review-button"
                                    onClick={() => openModal(exam._id)}
                                    style={{ color: '#fff' }}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Completed exams found.</p>
                )}

                {/* Modal for Review Data */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Review Modal"
                    shouldCloseOnOverlayClick={false}
                >
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Review for Exam</h3>

                    {attempts.length > 0 ? (
                        <>
                        <button onClick={exportToExcel} style={{ marginBottom: '20px' }} className='btn btn-primary'>
                        Export to Excel
                    </button>
                        <table style={{ border: '1px solid black', margin: 'auto', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>UserID</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Username</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Score</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Correct Answers</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Incorrect Answers</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Time Taken (sec)</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Attempted Questions</th>
                                    <th style={{ padding: '10px', border: '1px solid black' }}>Unattempted Questions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map((attempt, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.user_id._id}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.user_id.username}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.score}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.no_of_right_questions}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.no_of_wrong_questions}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.time_taken}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.no_of_questions_attempted}</td>
                                        <td style={{ padding: '10px', border: '1px solid black' }}>{attempt.no_of_unattempted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </>
                    ) : (
                        <p style={{ textAlign: 'center' }}>No students have attempted this exam yet.</p>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button onClick={closeModal} className='btn btn-danger'>Close</button>
                    </div>
                
                </Modal>
            </div>
        </div>
        
    );
};

export default Completed;
