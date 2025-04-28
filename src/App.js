// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Beginner from './pages/Beginner';
import Login from './pages/Login';
import Register from './pages/Register';
import Interests from './components/Interests';
import Dashboard from './pages/Dashboard'; // New import
import QuizFlow from './pages/QuizFlow'; // New import

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Flow */}
        <Route path="/" element={<Beginner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* New User Preferences Flow */}
        <Route path="/interests" element={<Interests />} />
        
        {/* Main App Flow (Protected in real implementation) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<QuizFlow />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Beginner />} />
      </Routes>
    </Router>
  );
}

export default App;