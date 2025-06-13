// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import CreateQCM from './qcm';
import TeacherDashboard from './TeacherDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<RegisterForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/qcm" element={<CreateQCM />} />
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
