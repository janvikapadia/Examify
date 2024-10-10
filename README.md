# Examify

**Examify** is a MERN stack-based platform designed to conduct MCQ-based exams. It currently supports JEE, CAT, and GATE exams, providing a free resource for students to attempt mock exams. Institutions can also use Examify to conduct formal exams.

## Features

- **Real-time MCQ Exams**: Conduct multiple-choice exams with time limits, automatic scoring, and immediate results.
- **Cheating Detection**: Tracks tab switching and auto-submits the exam after multiple warnings, helping ensure fair exams.
- **Responsive UI**: Easy-to-use interface for both students and institutions, designed with accessibility and simplicity in mind.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Other**: Tailwind CSS for styling, JWT for authentication

## Installation

Follow these steps to set up Examify on your local machine.

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/janvikapadia/Examify.git
   cd examify
   ```

2. **Install dependencies:**

   - For the backend:
     ```bash
     cd backend
     npm install
     ```

   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Configure environment variables:**

   Create a `.env` file in the backend folder and add the following:
   ```bash
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the project:**

   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```

   - Start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```

5. **Access the application:**

   The frontend will be running on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000).

## Screenshots

### 1. Home Page
![Home Page](./screenshots/homepage.png)

### 2. Admin Interface
![Exam Interface](./screenshots/admininterface1.png)
![Exam Interface](./screenshots/admininterface2.png)
![Exam Interface](./screenshots/admininterface3.png)
![Exam Interface](./screenshots/admininterface4.png)

### 3. Student Interface
![Exam Interface](./screenshots/studentinterface1.png)
![Exam Interface](./screenshots/studentinterface2.png)

### 4. Cheating Detection Warning
![Cheating Detection](./screenshots/detection1.png)
![Cheating Detection](./screenshots/detection2.png)

## Contribution

Feel free to fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
