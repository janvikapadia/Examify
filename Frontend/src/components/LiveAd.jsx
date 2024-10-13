
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LiveAd.css';

export const LiveAd = ({
    buttonColor = '#FE0000', 
    buttonText = 'END',
}) => {
    const [liveExams, setLiveExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredExams, setFilteredExams] = useState([]); // Filtered exams based on user selection
    const [selectedExamType, setSelectedExamType] = useState('All'); // 'All' is default

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.post('http://localhost:3000/admin/exams');
                const exams = response.data;

                const currentDateTimeUTC = new Date();
                const offsetInMillis = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
                const dateInIST = new Date(currentDateTimeUTC.getTime() + offsetInMillis);

                const filteredExams = exams.filter(exam => {
                    const examDateTimeUTC = new Date(exam.exam_date);
                    const examDuration = Number(exam.exam_duration);
                    const examEndDateTimeUTC = new Date(examDateTimeUTC.getTime() + (examDuration * 60000));

                    return (exam.status === 'Live');
                });

                setLiveExams(filteredExams);
            } catch (error) {
                console.error('Error fetching exams:', error);
                setError('Failed to load live exams.');
            } finally {
                setLoading(false);
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




    const handleEndClick = async (exam) => {
        try {
            const updatedExam = {
                exam_name: exam.exam_name,
                exam_desc: exam.exam_desc,
                exam_duration: exam.exam_duration,
                exam_total_marks: exam.exam_total_marks,
                exam_total_questions: exam.exam_total_questions,
                status: "Completed"
            };

            await axios.put(`http://localhost:3000/admin/update/${exam._id}`, updatedExam);
            setLiveExams(prevExams => prevExams.filter(e => e._id !== exam._id));
        } catch (error) {
            console.error('Error updating exam:', error);
        }
    };

    const handleUpcomingClick = async (exam) => {
        try {
            const updatedExam = {
                exam_name: exam.exam_name,
                exam_desc: exam.exam_desc,
                exam_duration: exam.exam_duration,
                exam_total_marks: exam.exam_total_marks,
                exam_total_questions: exam.exam_total_questions,
                status: "Upcoming"
            };

            await axios.put(`http://localhost:3000/admin/update/${exam._id}`, updatedExam);
            setLiveExams(prevExams => prevExams.filter(e => e._id !== exam._id));
        } catch (error) {
            console.error('Error updating exam status to Upcoming:', error);
        }
    };

    const getExamBackgroundColor = (examName) => {
        if (examName.includes("JEE")) {
            return '#ffffff'; // JEE Main - Light Blue
        } else if (examName.includes("GATE")) {
            return '#ffffff'; // GATE - Light Yellow
        } else if (examName.includes("CAT")) {
            return '#ffffff'; // CAT - Light Green
        } else {
            return '#e9e9ff'; // Default background color
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{minHeight: '100vh', padding: 0, margin: '15px' }}>
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
                                <div className="exam-time">Time: {exam.exam_time}</div>
                            </div>
                            <div className="exam-actions">
                                <button 
                                    className="live-button" 
                                    onClick={() => handleEndClick(exam)}
                                >
                                    {buttonText}
                                </button>
                                <button 
                                    className="upcoming-button" 
                                    onClick={() => handleUpcomingClick(exam)}
                                    style={{  color: '#fff' }} // You can customize the button style
                                >
                                    Upcoming
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Live exams found.</p>
                )}
            </div>
        </div>
    );
};

export default LiveAd;
