// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} /> {/* Accès direct à l'inscription */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<RegisterForm />} /> {/* Accès direct à l'inscription */}
        <Route path="/login" element={<LoginForm />} />
        {/* Tu peux ajouter d'autres routes ici plus tard */}
      </Routes>
    </BrowserRouter>
  );
}
