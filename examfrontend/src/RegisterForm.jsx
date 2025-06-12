import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');


  useEffect(() => {
    const timer = setTimeout(() => {
      if (message) setMessage('');
      if (error) setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5181/api/auth/register', {
        name,email, password, role
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data || "Erreur d'inscription");
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {message && (
        <div className="alert success">
          <p>{message}</p>
          <div className="bar success-bar"></div>
        </div>
      )}
      {error && (
        <div className="alert error">
          <p>{error}</p>
          <div className="bar error-bar"></div>
        </div>
      )}

      <div className="register-container">
        <div className="left">
          <h1>⚡ ExamQCM Platform</h1>
          <div className="feature">
            <h3>📝 Création d'examens simplifiée</h3>
            <p>Les enseignants peuvent créer facilement des QCM avec différents types de questions.</p>
          </div>
          <div className="feature">
            <h3>⏱️ Examens chronométrés</h3>
            <p>Configuration flexible du temps alloué pour chaque examen.</p>
          </div>
          <div className="feature">
            <h3>✅ Correction automatique</h3>
            <p>Résultats instantanés avec correction automatique et calcul des notes.</p>
          </div>
          <div className="feature">
            <h3>📊 Suivi des performances</h3>
            <p>Historique complet des examens passés avec statistiques détaillées.</p>
          </div>
        </div>

        <div className="right">
          <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Adresse Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="Student">Étudiant</option>
              <option value="Professor">Professeur</option>
            </select>
            <div className="checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Se souvenir de moi</label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Chargement...' : "S'inscrire"}
            </button>
            <div className="footer-links">
              <a href="#">Mot de passe oublié ?</a>
              <a href="/login">Déjà inscrit ? Connexion</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}