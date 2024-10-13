


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './UpcomingAd.css'

export const UpcomingAd = ({ buttonColor1 = '#a20ee0', buttonText1 = 'LIVE', buttonText2 = 'Delete' }) => {
    const [upcomingExams, setUpcomingExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/exams');
                const exams = response.data;
                const currentDateTimeUTC = new Date();

                // Filter exams based on date and time
                const filteredExams = exams.filter(exam => {
                    const examDateTimeUTC = new Date(exam.exam_date);
                    return exam.status === 'Upcoming';
                });

                setUpcomingExams(filteredExams);
                setFilteredExams(filteredExams);
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


    



    // Function to set background color based on exam name
    const getBackgroundColor = (examName) => {
        if (examName.includes("JEE Main")) {
            return "#ffffff";
        } else if (examName.includes("GATE")) {
            return "#ffffff";
        } else if (examName.includes("CAT")) {
            return "#ffffff";
        } else {
            return "rgba(255, 255, 255)"; // Default glassy effect for other exams
        }
    };

    // const handleLiveClick = async (exam) => {
    //     try {
    //         const updatedExam = {
    //             ...exam,
    //             status: "Live"
    //         };

    //         await axios.put(`http://localhost:3000/admin/update/${exam._id}`, updatedExam);

    //         setUpcomingExams(prevExams => prevExams.filter(e => e._id !== exam._id));
    //     } catch (error) {
    //         console.error('Error updating exam:', error);
    //     }
    // };




    const handleLiveClick = async (exam) => {
        try {
            const updatedExam = {
                ...exam,
                status: "Live"
            };

            // Trigger the live status change and send email notification
            await axios.put(`http://localhost:3000/admin/update/${exam._id}`, updatedExam);

            setUpcomingExams(prevExams => prevExams.filter(e => e._id !== exam._id));

            toast.success("Exam is now live, and notifications have been sent!");

        } catch (error) {
            console.error('Error updating exam:', error);
            toast.error("Failed to make the exam live!");
        }
    };

    // const handleDeleteClick = async (examId) => {
    //     try {
    //         await axios.delete(`http://localhost:3000/admin/delete/${examId}`);
    //         toast.success("Exam Deleted!");

    //         // Remove the deleted exam from the state
    //         setUpcomingExams(prevExams => prevExams.filter(e => e._id !== examId));
    //     } catch (error) {
    //         console.error('Error deleting exam:', error);
    //     }
    // };


    const handleDeleteClick = async (examId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/admin/delete/${examId}`);
            console.log('Delete Response:', response);
            toast.success("Exam Deleted!");
            setUpcomingExams(prevExams => prevExams.filter(e => e._id !== examId));
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    };

    return (
        <div style={{  minHeight: '100vh', padding: 0, margin: '15px' }}>
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
                <ToastContainer autoClose={1000} position="top-center" />
                {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                        <div key={index} className="exam-card" style={{ backgroundColor: getBackgroundColor(exam.exam_name) , border: '1px solid'}}>
                            <div className="exam-details">
                                <span className="exam-name">{exam.exam_name}</span>
                                <span className="exam-date">{exam.exam_date.split('T')[0]}</span>
                                <span className="exam-time">{exam.exam_date.split('T')[1].slice(0, 5)}</span>
                            </div>
                            <div className="exam-actions">
                                <button
                                    className="live-button"
                                    onClick={() => handleLiveClick(exam)}
                                >
                                    {buttonText1}
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteClick(exam._id)}
                                >
                                    {buttonText2}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No upcoming exams found.</p>
                )}
            </div >
        </div >
    );
};

