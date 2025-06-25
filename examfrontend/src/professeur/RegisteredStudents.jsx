import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisteredStudents.css'; 

export default function RegisteredStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5181/api/auth/students');
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des étudiants :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="students-container">
      <h1>Étudiants inscrits</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : students.length === 0 ? (
        <p>Aucun étudiant trouvé.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
