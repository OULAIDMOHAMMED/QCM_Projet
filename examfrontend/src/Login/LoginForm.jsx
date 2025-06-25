import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const timer = setTimeout(() => {
      if (message) setMessage('');
      if (error) setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5181/api/auth/login', { email, password });

      const userId = response.data.userId || response.data.id;
      const nameuser=response.data.nameuser;
      localStorage.setItem('nameuser', nameuser);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      console.log(userId);
      if (userId) {
        localStorage.setItem('userId', userId);
        
      }

      setMessage(response.data.message || "Connexion réussie.");

      setTimeout(() => {
        if (response.data.role === 'Professor') {
          navigate('/TeacherDashboard');
        } else {
          navigate('/StudentDashboard');
        }
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
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

      <div className="login-container">
        <div className="login-header">
          <h1> ExamQCM Platform</h1>
          <p>Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
          <div className="login-options">
            <div className="checkbox">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Se souvenir de moi</label>
            </div>
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Se connecter'}
          </button>
          <div className="login-footer">
            <p>Pas encore inscrit ? <a href="/register">Créer un compte</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
