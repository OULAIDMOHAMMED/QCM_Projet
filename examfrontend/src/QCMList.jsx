// QCMList.jsx
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
    <div style={{ padding: "2rem" }}>
      <h2>Liste des QCMs disponibles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {qcms.map((qcm) => (
          <li key={qcm.id}>
            <button
              style={{
                background: "#1f6feb",
                color: "#fff",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                marginBottom: "10px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => handleClick(qcm.id)}
            >
              {qcm.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
