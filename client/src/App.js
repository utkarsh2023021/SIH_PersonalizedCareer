import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./components/Quiz";
import Recommendations from "./components/Recommendations";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/quiz" element={<Quiz />} />
         <Route path="/recommendations" element={<Recommendations/>}/>
         <Route path="/chatbot" element={<Chatbot/>}/>
      </Routes>
    </Router>
  );
}
