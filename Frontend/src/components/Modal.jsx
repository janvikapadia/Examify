import React from 'react';
import './Modal.css'

const Modal = ({ isOpen, onClose, exam }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{exam.exam_name}</h2>
                <p>Date: {exam.exam_date.split('T')[0]}</p>
                <p>Time: {exam.exam_time}</p>
                <p>Duration: {exam.exam_duration}</p>
                <p>Total Marks: {exam.exam_total_marks}</p>
                <p>Total Questions: {exam.exam_total_questions}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
