// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './Register/RegisterForm';
import LoginForm from './Login/LoginForm';
import CreateQCM from './professeur/qcm';
import TeacherDashboard from './professeur/TeacherDashboard';
import RespondQCM from './etudiant/qcmetu';
import QCMList from './etudiant/QCMList';
import RegisteredStudents from './professeur/RegisteredStudents';
import NotesList from './professeur/NotesList';
import StudentDashboard from './etudiant/StudentDashboard';
import StudentHistoryList from './etudiant/StudentHistoryList';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<RegisterForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/qcm" element={<CreateQCM />} />
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/RS/:qcmId" element={<RespondQCM />} />
        <Route path="/qcmm" element={<QCMList />} />
        <Route path="/inscri" element={<RegisteredStudents />} />
        <Route path="/note" element={<NotesList /> } />
        <Route path="/hist" element={<StudentHistoryList /> } />
      </Routes>
    </BrowserRouter>
  );
}
