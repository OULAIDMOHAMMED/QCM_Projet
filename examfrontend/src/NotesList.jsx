import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const teacherId = localStorage.getItem('userId');
    console.log('Fetching results for teacherId:', teacherId);
    if (!teacherId) {
      console.error("Aucun ID d'utilisateur trouvé dans localStorage.");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5181/api/submit/results/${teacherId}`)
      .then(res => {
        console.log('Données reçues:', res.data);
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else if (res.data) {
          setData([res.data]);
        } else {
          setData([]);
        }
      })
      .catch(err => {
        console.error(err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des notes...</p>;

  if (!Array.isArray(data) || data.length === 0) return <p>Aucun QCM trouvé.</p>;

  return (
    <div>
      <h2>Résultats des QCM</h2>
      {data.map((qcm, index) => (
        <div key={qcm.qcmId ?? index} className="qcm-section">
          <h3>{qcm.qcmTitle}</h3>
          <table className="notes-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {qcm.responses && qcm.responses.length > 0 ? (
                qcm.responses.map((resp, idx) => (
                  <tr key={`${qcm.qcmId}-${resp.studentId ?? idx}-${idx}`}>
                    <td>{resp.studentName || "Inconnu"}</td>
                    <td>{resp.note != null ? resp.note.toFixed(2) : "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr key="no-responses">
                  <td colSpan="2" style={{ textAlign: 'center' }}>Aucune réponse pour ce QCM</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
