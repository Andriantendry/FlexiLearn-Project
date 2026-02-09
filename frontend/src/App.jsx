import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/signup.jsx";
import SigninPage from "./pages/signin.jsx";
import Quiz from "./pages/quiz.jsx";
import Home from "./pages/home.jsx";
import QuizResult from "./pages/QuizResult";
import ChatPage from "./pages/chat.jsx";
import Feedback from "./pages/feedback.jsx";
import VerifyCode from "./pages/verify_code.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/quiz_result" element={<QuizResult />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}
export default App;
