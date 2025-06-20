import React, { useState } from 'react';
import './TeacherDashboard.css';
import CreateQCM from './qcm';
import NotesList from './NotesList';
import RegisteredStudents from './RegisteredStudents';


export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>ExamQCM Prof</h2>
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
      </aside>

      <main className="content">
        {activeTab === 'students' && (
          <section>
            <RegisteredStudents />
            {}
          </section>
        )}

        {activeTab === 'grades' && (
          <section>
            <h1>Notes</h1>
            <NotesList /> 
            {}
          </section>
        )}

        {activeTab === 'stats' && (
          <section>
            <h1>Statistiques</h1>
            <p>Graphiques et suivi des performances...</p>
            {}
          </section>
        )}

        {activeTab === 'create-qcm' && (
          <section>
            <CreateQCM />
          </section>
        )}
      </main>
    </div>
  );
}
