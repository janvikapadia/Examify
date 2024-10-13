import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Live.css';

export const Live = ({ buttonText = 'ATTEMPT', modalButtonText = "START EXAM" }) => {
    const [liveExams, setLiveExams] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null); // State to track selected exam for modal
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default

    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const examsResponse = await axios.post('http://localhost:3000/student/exams');
                const exams = examsResponse.data;

                const userResponse = await axios.get("http://localhost:3000/auth/user");
                const fetchedUserId = userResponse.data.user_id._id;
                setUserId(fetchedUserId);

                const liveExams = exams.filter(exam => exam.status === 'Live');

                const nonAttemptedExams = await Promise.all(
                    liveExams.map(async (exam) => {
                        try {
                            const attemptResponse = await axios.get(`http://localhost:3000/exam/check/${fetchedUserId}/${exam._id}`);
                            return attemptResponse.data.attempted ? null : exam;
                        } catch (error) {
                            console.error(`Error checking attempt status for exam ${exam._id}:`, error);
                            return null;
                        }
                    })
                );

                const filteredExams = nonAttemptedExams.filter(exam => exam !== null);
                setLiveExams(filteredExams);

            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, []);







     // Filter exams based on selected exam type
     useEffect(() => {
        if (selectedExamType === 'All') {
            setFilteredExams(liveExams); // Show all exams
        } else {
            setFilteredExams(liveExams.filter(exam => exam.exam_name === selectedExamType));
        }
    }, [selectedExamType, liveExams]);

    const handleExamTypeChange = (e) => {
        setSelectedExamType(e.target.value);
    };




    const handleStartExam = async (examId) => {
        try {
            await axios.post('http://localhost:3000/exam/save', {
                examID: examId,
                userId: userId
            });
            navigate(`/exam/${examId}`);
        } catch (error) {
            console.error('Error starting exam:', error);
        }
    };

    // Open the modal with selected exam details
    const openModal = (exam) => {
        setSelectedExam(exam);
        setShowModal(true);
    };

    // Close the modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedExam(null);
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
                                <div className="exam-time">Time: {exam.exam_time.slice(0, 5)}</div>
                            </div>
                            <div className="exam-actions">
                                <button
                                    className="attempt-button"
                                    onClick={() => openModal(exam)}
                                    style={{ color: '#fff' }}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No live exams found.</p>
                )}
            </div>

            {/* Modal for showing exam details */}
            {showModal && selectedExam && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedExam.exam_name}</h2>
                        <p><strong>Description:</strong> {selectedExam.exam_desc}</p>
                        <p><strong>Date:</strong> {selectedExam.exam_date.split('T')[0]}</p>
                        <p><strong>Time:</strong> {selectedExam.exam_time}</p>
                        <p><strong>Duration:</strong> {selectedExam.exam_duration} minutes</p>
                        <p><strong>Total Marks:</strong> {selectedExam.exam_total_marks}</p>
                        <p><strong>Total Questions:</strong> {selectedExam.exam_total_questions}</p>

                        <div className="modal-buttons">
                            <button className="close-button" onClick={closeModal}>Close</button>
                            <button
                                className="start-button"
                                onClick={() => {
                                    handleStartExam(selectedExam._id);
                                    closeModal(); // Close modal after starting exam
                                }}
                            >
                                {modalButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
