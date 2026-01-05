import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/signup.jsx";
import SigninPage from "./pages/signin.jsx";
import Quiz from "./pages/quiz.jsx";
import Home from "./pages/home.jsx";
import QuizResult from "./pages/quiz_result.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz_result" element={<QuizResult />} />
      </Routes>
    </Router>
  );
}
export default App;
