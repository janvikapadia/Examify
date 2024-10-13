

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import * as XLSX from "xlsx"; // Import the xlsx library
import "react-toastify/dist/ReactToastify.css";
import "./Addexam.css";

// Define custom styles for the modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '400px', // Set width for better appearance
    padding: '20px', // Add some padding
  },
};

const AddExamModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '300px', // Width for the choice modal
    padding: '20px', // Add some padding
  },
};

const cardData = [
  {
    title: "JEE MAIN",
    description:
      "Joint Entrance Examination – Main, formerly All India Engineering Entrance Examination, is an Indian standardized computer-based test for admission to various technical undergraduate programs in engineering, architecture, and planning across colleges in India.",
    duration: 180,
    total_marks: 300,
    total_questions: 3,
  },
  {
    title: "GATE",
    description:
      "The Graduate Aptitude Test in Engineering is an entrance examination conducted in India that primarily tests the comprehensive understanding of undergraduate subjects in engineering and sciences for admission to postgraduate programs.",
    duration: 180,
    total_marks: 100,
    total_questions: 3,
  },
  {
    title: "CAT",
    description:
      "The Common Admission Test is a computer-based test for admission in graduate management programs. The test consists of three sections: Verbal Ability and Reading Comprehension, Data Interpretation and Logical Reasoning and Quantitative Ability.",
    duration: 120,
    total_marks: 198,
    total_questions: 3,
  },
];

export const AddExam = () => {
  const [formData, setFormData] = useState({
    exam_name: "",
    exam_time: "",
    exam_date: "",
    exam_duration: "",
    exam_total_marks: "",
    exam_total_questions: "",
    status: "Upcoming",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false); // State for choice modal
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: { a: "", b: "", c: "", d: "" },
    correctAnswer: "",
  });
  const [examId, setExamId] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsAdded, setQuestionsAdded] = useState(0);

  const [minDate, setMinDate] = useState(getMinDate());
  const [minTime, setMinTime] = useState(getCurrentTime());

  function getMinDate() {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split("T")[0];
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }

  useEffect(() => {
    setMinDate(getMinDate());
    setMinTime(getCurrentTime());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    const selectedExam = cardData.find(
      (exam) => exam.title === formData.exam_name
    );

    if (!selectedExam) {
      toast.error("Please select an exam.");
      return;
    }

    const examDescription = selectedExam.description;
    const examDuration = selectedExam.duration;
    const examTotalMarks = selectedExam.total_marks;
    const examTotalQuestions = selectedExam.total_questions;

    const combinedDateTime = `${formData.exam_date}T${formData.exam_time}:00.000Z`;
    const dateInUTC = new Date(combinedDateTime);

    const dataToSubmit = {
      exam_name: formData.exam_name,
      exam_desc: examDescription,
      exam_time: formData.exam_time,
      exam_date: dateInUTC,
      exam_duration: examDuration,
      exam_total_marks: examTotalMarks,
      exam_total_questions: examTotalQuestions,
      status: "Upcoming",
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addexams",
        dataToSubmit
      );

      if (response.data.status) {
        toast.success("Exam Added!");
        const { _id: newExamId, exam_total_questions: newTotalQuestions } =
          response.data.message;

        setExamId(newExamId);
        setTotalQuestions(newTotalQuestions);

        // Open the choice modal
        setIsChoiceModalOpen(true);
      } else {
        toast.error(response.data.message || "Failed to add exam.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the exam.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the Excel format: Question, Option A, Option B, Option C, Option D, Correct Answer
      for (let i = 1; i < jsonData.length; i++) { // Skipping header row
        const row = jsonData[i];
        const questionData = {
          exam_id: examId,
          question_text: row[0],
          option_a: row[1],
          option_b: row[2],
          option_c: row[3],
          option_d: row[4],
          correct_answer: row[5],
        };

        try {
          const response = await axios.post(
            "http://localhost:3000/admin/addquestions",
            questionData
          );

          if (response.data.status) {
            toast.success("Question added successfully!");
            setQuestionsAdded((prev) => prev + 1);
          } else {
            toast.error("Failed to add question from Excel.");
          }
        } catch (error) {
          toast.error("An error occurred while adding a question from Excel.");
        }
      }

      setIsChoiceModalOpen(false); // Close the choice modal
      toast.info("All questions added successfully!");

      setTimeout(() => {
        window.location.href = "/admin#upcoming";
      }, 1500);
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    const { question, options, correctAnswer } = currentQuestion;

    if (
      !question.trim() ||
      !options.a.trim() ||
      !options.b.trim() ||
      !options.c.trim() ||
      !options.d.trim() ||
      !correctAnswer.trim()
    ) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    const validOptions = [options.a, options.b, options.c, options.d];
    if (!validOptions.includes(correctAnswer.trim())) {
      toast.error(
        "Correct answer must be one of the options provided (A, B, C, D)."
      );
      return;
    }

    const questionData = {
      exam_id: examId,
      question_text: question,
      option_a: options.a,
      option_b: options.b,
      option_c: options.c,
      option_d: options.d,
      correct_answer: correctAnswer,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addquestions",
        questionData
      );

      if (response.data.status) {
        toast.success("Question added successfully!");
        setQuestionsAdded((prev) => prev + 1);

        setCurrentQuestion({
          question: "",
          options: { a: "", b: "", c: "", d: "" },
          correctAnswer: "",
        });

        if (questionsAdded + 1 >= totalQuestions) {
          setIsModalOpen(false);
          toast.info("All questions added successfully!");

          setTimeout(() => {
            window.location.href = "/admin#upcoming";
          }, 1500);
        }
      } else {
        toast.error("Failed to add question.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the question.");
    }
  };

  // Function to handle manual question addition
  const handleManualAddition = () => {
    setIsChoiceModalOpen(false); // Close the choice modal
    setIsModalOpen(true); // Open the question modal
  };

  // Function to handle Excel upload
  const handleExcelUpload = () => {
    document.getElementById("file-input").click(); // Trigger file input
    setIsChoiceModalOpen(false); // Close the choice modal
  };

  return (
    <div>
      <div
        className="container"
        style={{
          marginTop: "120px",
          paddingLeft: "300px",
          paddingRight: "300px",
        }}
      >
        <ToastContainer autoClose={1000} position="top-center" />
        <form className="form" onSubmit={handleAddExam}>
          <div style={{ paddingBottom: "20px" }}>
          <header class="head">ADD EXAM</header>
            <label htmlFor="exam_name" style={{ paddingRight: "7px" }}>
              Exam Name:
            </label>
            <select
              name="exam_name"
              value={formData.exam_name}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                --select--
              </option>
              <option value="JEE MAIN">JEE MAIN</option>
              <option value="GATE">GATE</option>
              <option value="CAT">CAT</option>
            </select>
          </div>

          <div>
            <label htmlFor="exam_time">Exam Time:</label>
            <input
              type="time"
              name="exam_time"
              value={formData.exam_time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="exam_date">Exam Date:</label>
            <input
              type="date"
              name="exam_date"
              value={formData.exam_date}
              onChange={handleChange}
              min={minDate}
              required
            />
          </div>

          <button type="submit" className="Ad-button">Add Exam</button>
        </form>

        {/* Choice Modal for Adding Questions */}
        {/* <Modal
          isOpen={isChoiceModalOpen}
          onRequestClose={() => setIsChoiceModalOpen(false)}
          contentLabel="Choose Question Addition Method"
          style={AddExamModalStyles}
        >
          <h2>Choose Method to Add Questions</h2>
          <p>Do you want to add questions manually or through an Excel sheet?</p>
          <button onClick={handleManualAddition} className="Ad-button">
            Add Manually
          </button>
          <button onClick={handleExcelUpload} className="Ad-button">
            Upload Excel
          </button>
        </Modal> */}


<Modal
  isOpen={isChoiceModalOpen}
  onRequestClose={() => setIsChoiceModalOpen(false)}
  contentLabel="Choose Question Addition Method"
  style={AddExamModalStyles}
  className="choice-modal" // Add this line
>
  
  <p>Do you want to add questions manually or through an Excel sheet?</p>
  <button onClick={handleManualAddition} className="Ad-button">
    Add Manually
  </button>
  <button onClick={handleExcelUpload} className="Ad-button">
    Upload Excel
  </button>
</Modal>


        {/* Modal for Adding Questions Manually */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Add Question"
          style={customModalStyles}
        >
          <h2>Add Question</h2>
          <form onSubmit={handleQuestionSubmit}>
            <input
              type="text"
              placeholder="Question"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Option A"
              value={currentQuestion.options.a}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  options: { ...currentQuestion.options, a: e.target.value },
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Option B"
              value={currentQuestion.options.b}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  options: { ...currentQuestion.options, b: e.target.value },
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Option C"
              value={currentQuestion.options.c}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  options: { ...currentQuestion.options, c: e.target.value },
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Option D"
              value={currentQuestion.options.d}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  options: { ...currentQuestion.options, d: e.target.value },
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Correct Answer (A/B/C/D)"
              value={currentQuestion.correctAnswer}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  correctAnswer: e.target.value,
                })
              }
              required
            />
            <button type="submit" className="Ad-button">
              Add Question
            </button>
          </form>
        </Modal>

        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};