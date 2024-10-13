import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const examSchema = new mongoose.Schema({
  exam_name: String,
  exam_desc: String,
  exam_time: String,
  exam_date: Date,
  exam_duration: Number,
  exam_total_marks: Number,
  exam_total_questions: Number,
  status: { type: String, enum: ['Live', 'Completed', 'Upcoming'], default: 'Upcoming' }
});

const attemptSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number },
  no_of_unattempted: { type: Number},
  time_taken: { type: Number }, 
  no_of_wrong_questions: { type: Number},
  no_of_right_questions: { type: Number },
  no_of_questions_attempted: { type: Number},
  date: { type: Date, default: Date.now },
});



const questionSchema = new mongoose.Schema({
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  question_text:{type:String, require:true},
  option_a:{type:String, require:true},
  option_b:{type:String, require:true},
  option_c:{type:String, require:true},
  option_d:{type:String, require:true},
  correct_answer:{type:String, require:true},
});



const UserModel = mongoose.model("User", UserSchema);
const ExamModel = mongoose.model("Exam", examSchema);
const AttModel = mongoose.model("Attempt", attemptSchema);
const QuestionModel = mongoose.model("Question", questionSchema);




export { UserModel as User };
export { ExamModel as Exam };
export { AttModel as Attempt };
export { QuestionModel as Question };