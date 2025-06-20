import React, { useState } from 'react';
import './StudentDashboard.css'; // même style que TeacherDashboard.css
import QCMList from './QCMList'; // pour afficher les QCM disponibles depuis l'API

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('qcm');

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>ExamQCM Étudiant</h2>
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
          </section>
        )}

        {activeTab === 'profile' && (
          <section>
            <h1>Mon Profil</h1>
          </section>
        )}
      </main>
    </div>
  );
}
