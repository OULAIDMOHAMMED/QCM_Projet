// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './Register/RegisterForm';
import LoginForm from './Login/LoginForm';
import CreateQCM from './qcm';
import TeacherDashboard from './TeacherDashboard';
import RespondQCM from './qcmetu';
import QCMList from './QCMList';
import RegisteredStudents from './RegisteredStudents';
import NotesList from './NotesList';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<RegisterForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/qcm" element={<CreateQCM />} />
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="/RS/:qcmId" element={<RespondQCM />} />
        <Route path="/qcmm" element={<QCMList />} />
        <Route path="/inscri" element={<RegisteredStudents />} />
        <Route path="/note" element={<NotesList /> } />
      </Routes>
    </BrowserRouter>
  );
}
