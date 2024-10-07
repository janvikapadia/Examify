

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; 

export const Upcoming = ({ buttonColor = '#a20ee0', buttonText = 'VIEW', modalButtonText = "" }) => {
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/exams');
                const exams = response.data;
                const currentDateTimeUTC = new Date();
                const filteredExams = exams.filter(exam => {
                    const examDateTimeUTC = new Date(exam.exam_date);
                    return examDateTimeUTC > currentDateTimeUTC && exam.status === 'Upcoming';
                });
                setUpcomingExams(filteredExams);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };
        fetchExams();
    }, []);

    




    // Filter exams based on selected exam type
    useEffect(() => {
        if (selectedExamType === 'All') {
            setFilteredExams(upcomingExams); // Show all exams
        } else {
            setFilteredExams(upcomingExams.filter(exam => exam.exam_name === selectedExamType));
        }
    }, [selectedExamType, upcomingExams]);

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


    const openModal = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                                    className="review-button" 
                                    onClick={() => openModal(exam)}
                                    style={{ color: '#fff' }}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No upcoming exams found.</p>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} exam={selectedExam} />
        </div>
    );
};
