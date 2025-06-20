import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentHistoryList() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5181/api/submit/passed/${studentId}`);
        setHistory(res.data);
      } catch (err) {
        setError("Erreur lors de la récupération de l’historique.");
        console.error(err);
      }
    };

    fetchHistory();
  }, [studentId]);

  const handleClick = (qcmId) => {
    navigate(`/history/${qcmId}`);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Historique des QCMs passés</h1>

      {error && <p role="alert" style={styles.error}>{error}</p>}

      {history.length === 0 && !error && (
        <p style={{ textAlign: "center", opacity: 0.8 }}>Aucun QCM passé.</p>
      )}

      <ul style={styles.list}>
        {history.map((qcm) => (
          <li key={qcm.id} style={styles.listItem}>
            <button
              onClick={() => handleClick(qcm.id)}
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#155abf"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1f6feb"}
            >
              <span style={styles.qcmTitle}>{qcm.title}</span>
              <div style={styles.qcmDetails}>
                <span>Voir détails</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: 650,
    margin: "2rem auto",
    padding: "1.5rem 2rem",
    backgroundColor: "#0d1117",
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
    color: "#c9d1d9",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#58a6ff",
  },
  error: {
    backgroundColor: "#b00020",
    padding: "0.8rem 1rem",
    borderRadius: 6,
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
    color: "#fff",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "1.25rem",
  },
  button: {
    width: "100%",
    backgroundColor: "#1f6feb",
    border: "none",
    borderRadius: 10,
    padding: "1.25rem 1.75rem",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 3px 10px rgba(31,111,235,0.5)",
    transition: "background-color 0.25s ease, transform 0.15s ease",
    fontSize: "1.15rem",
    fontWeight: "600",
    userSelect: "none",
    color: "#fff"
  },
  qcmTitle: {
    marginBottom: 8,
  },
  qcmDetails: {
    fontSize: "0.9rem",
    opacity: 0.85,
  },
};
