import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QCMStats.css';

export default function QCMStats() {
  const [qcmData, setQcmData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacherId = localStorage.getItem('userId');
    if (!teacherId) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5181/api/submit/results/${teacherId}`)
      .then(res => setQcmData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setQcmData([]))
      .finally(() => setLoading(false));
  }, []);

  const computeStats = (responses) => {
    const notes = responses.map(r => r.note).filter(n => typeof n === 'number');
    if (notes.length === 0) return null;

    const total = notes.length;
    const moyenne = (notes.reduce((a, b) => a + b, 0)) / total;
    const max = Math.max(...notes);
    const min = Math.min(...notes);
    const successRate = (notes.filter(n => n >= 10).length / total) * 100;

    return { moyenne, max, min, total, successRate };
  };

  if (loading) return <p className="loading">Chargement des statistiques...</p>;
  if (qcmData.length === 0) return <p className="empty">Aucune donnée trouvée.</p>;

  return (
    <div className="qcm-stats-container">
      <h2 className="stats-title">Statistiques des QCM</h2>
      {qcmData.map((qcm, index) => {
        const stats = computeStats(qcm.responses || []);
        return (
          <div key={index} className="qcm-stat-card">
            <h3 className="qcm-title">{qcm.qcmTitle}</h3>
            {stats ? (
              <ul className="stats-list">
                <li><strong>Nombre de participants :</strong> {stats.total}</li>
                <li><strong>Moyenne :</strong> {stats.moyenne.toFixed(2)} / 20</li>
                <li><strong>Note maximale :</strong> {stats.max}</li>
                <li><strong>Note minimale :</strong> {stats.min}</li>
                <li><strong>Taux de réussite :</strong> {stats.successRate.toFixed(1)}%</li>
              </ul>
            ) : (
              <p className="no-data">Aucune réponse enregistrée</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
