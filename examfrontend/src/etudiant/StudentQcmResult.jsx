import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentQcmResult() {
  const { qcmId } = useParams();
  const studentId = localStorage.getItem("userId");
  const [qcmData, setQcmData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(`http://localhost:5181/api/qcm/history/${studentId}/${qcmId}`);
        setQcmData(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des détails du QCM.");
        console.error(err);
      }
    };

    fetchResult();
  }, [qcmId, studentId]);

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;
  if (!qcmData) return <div style={{ color: "#c9d1d9", padding: 20 }}>Chargement...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: "#58a6ff", textAlign: "center" }}>{qcmData.title}</h2>
      <p style={{ textAlign: "center", color: "#b2ff59", marginBottom: 30 }}>
        Note obtenue : <strong>{qcmData.note}/20</strong>
      </p>

      {qcmData.questions.map((question, qIndex) => (
        <div key={qIndex} style={{
          backgroundColor: "#161b22",
          padding: 15,
          marginBottom: 30,
          borderRadius: 8,
          color: "#c9d1d9"
        }}>
          <h4 style={{ marginBottom: 15 }}>{question.text}</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {question.answers.map((answer, aIndex) => {
              const isSelected = question.selectedIndexes.includes(aIndex);
              const isCorrect = question.correctIndexes.includes(aIndex);

              return (
                <li
                  key={aIndex}
                  style={{
                    padding: "8px 12px",
                    marginBottom: 8,
                    borderRadius: 6,
                    backgroundColor:
                      isSelected && isCorrect
                        ? "#2e7d32" // ✅ choisi et correct
                        : isSelected && !isCorrect
                          ? "#c62828" // ❌ choisi mais faux
                          : !isSelected && isCorrect
                            ? "#1565c0" // ✅ non choisi mais bonne réponse
                            : "#21262d",
                    color: "#ffffff",
                    fontWeight: isCorrect ? "bold" : "normal",
                  }}
                >
                  {answer}
                  {isSelected && isCorrect && " ✅"}
                  {isSelected && !isCorrect && " ❌"}
                  {!isSelected && isCorrect && " 🟦"}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
