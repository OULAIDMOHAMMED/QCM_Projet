// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterForm from './RegisterForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterForm />} /> {/* Accès direct à l'inscription */}
        <Route path="/register" element={<RegisterForm />} />
        {/* Tu peux ajouter d'autres routes ici plus tard */}
      </Routes>
    </BrowserRouter>
  );
}
