import React, { useState, useEffect } from 'react';
import './TeacherDashboard.css';
import CreateQCM from './qcm';
import NotesList from './NotesList';
import RegisteredStudents from './RegisteredStudents';
import imagee1 from '../assets/profil.jpg';
import QCMStats from './QCMStats';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [user, setUser] = useState({ name: 'Nom Professeur' });

  useEffect(() => {
    const storedUser = localStorage.getItem('nameuser');
    if (storedUser) {
      setUser({ name: storedUser });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img src={imagee1} alt="Profile" className="profile-pic" />
          <span className="user-name">{user.name}</span>
        </div>

        <nav className="menu">
          <button
            className={activeTab === 'students' ? 'active' : ''}
            onClick={() => setActiveTab('students')}
          >
            Étudiants inscrits
          </button>
          <button
            className={activeTab === 'grades' ? 'active' : ''}
            onClick={() => setActiveTab('grades')}
          >
            Notes
          </button>
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
          <button
            className={activeTab === 'create-qcm' ? 'active' : ''}
            onClick={() => setActiveTab('create-qcm')}
          >
            Créer QCM
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Déconnexion</button>
        </div>
      </aside>

      <main className="content">
        {activeTab === 'students' && (
          <section>
            <h1>Étudiants inscrits</h1>
            <RegisteredStudents />
          </section>
        )}

        {activeTab === 'grades' && (
          <section>
            <h1>Notes</h1>
            <NotesList />
          </section>
        )}

        {activeTab === 'stats' && (
          <section>
            <QCMStats />
          </section>
        )}

        {activeTab === 'create-qcm' && (
          <section>
            <h1>Créer un QCM</h1>
            <CreateQCM />
          </section>
        )}
      </main>
    </div>
  );
}
