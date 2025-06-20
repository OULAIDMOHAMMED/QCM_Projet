import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QCMList() {
  const [qcms, setQcms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQCMs = async () => {
      try {
        const response = await axios.get("http://localhost:5181/api/qcm/all");
        setQcms(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des QCMs.");
        console.error(err);
      }
    };

    fetchQCMs();
  }, []);

  const handleClick = (qcmId) => {
    localStorage.setItem("selectedQcmId", qcmId);
    navigate(`/RS/${qcmId}`);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Liste des QCMs disponibles</h1>

      {error && <p role="alert" style={styles.error}>{error}</p>}

      <ul style={styles.list} aria-live="polite">
        {qcms.map((qcm) => (
          <li key={qcm.id} style={styles.listItem}>
            <button
              onClick={() => handleClick(qcm.id)}
              aria-label={`Accéder au QCM ${qcm.title} contenant ${qcm.questionsCount} question${qcm.questionsCount > 1 ? "s" : ""}`}
              style={styles.button}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#155abf"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1f6feb"}
            >
              <span style={styles.qcmTitle}>{qcm.title}</span>
              <div style={styles.qcmDetails}>
                <div style={styles.detailItem}>
                  <span>{qcm.questionsCount} question{qcm.questionsCount > 1 ? "s" : ""}</span>
                </div>
                <div style={styles.detailItem}>
                  <time dateTime={qcm.creationDate}>
                    {new Date(qcm.creationDate).toLocaleDateString("fr-FR")}
                  </time>
                </div>
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
    backgroundColor: "#0d47a1",
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(13,71,161,0.4)",
    color: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "2rem",
    textAlign: "center",
    textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
  },
  error: {
    backgroundColor: "#b00020",
    padding: "0.8rem 1rem",
    borderRadius: 6,
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "600",
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
  },
  qcmTitle: {
    marginBottom: 8,
  },
  qcmDetails: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    opacity: 0.85,
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
  },
};
