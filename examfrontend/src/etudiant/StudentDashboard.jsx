import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import QCMList from './QCMList';
import StudentHistoryList from './StudentHistoryList';
import imagee1 from '../assets/profil.jpg';
import EditProfileForm from './EditProfileForm';




export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('qcm');
  const [user, setUser] = useState({ name: 'Nom Étudiant' }); // À remplacer par vrai fetch

  useEffect(() => {
    // Simule une récupération du nom depuis localStorage ou autre
    const storedUser = localStorage.getItem('nameuser');
    console.log(storedUser)
    if (storedUser) {
      setUser({ name: storedUser });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; // Redirige vers la page de connexion
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
            className={activeTab === 'qcm' ? 'active' : ''}
            onClick={() => setActiveTab('qcm')}
          >
            QCM Disponibles
          </button>
          <button
            className={activeTab === 'results' ? 'active' : ''}
            onClick={() => setActiveTab('results')}
          >
            Mes Résultats
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Mon Profil
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">Déconnexion</button>
        </div>
      </aside>

      <main className="content">
        {activeTab === 'qcm' && (
          <section>
            <h1>QCM Disponibles</h1>
            <QCMList />
          </section>
        )}

        {activeTab === 'results' && (
          <section>
            <h1>Mes Résultats</h1>
            <StudentHistoryList />
          </section>
        )}

        {activeTab === 'profile' && (
          <section>
            <h1>Mon Profil</h1>
            <p>Nom : {user.name}</p>
            <EditProfileForm />
          </section>
        )}
      </main>
    </div>
  );
}
