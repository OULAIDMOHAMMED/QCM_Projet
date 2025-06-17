import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function RespondQCM() {
  const { qcmId } = useParams();
  const [qcm, setQcm] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const studentId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchQCM = async () => {
      try {
        const response = await axios.get(`http://localhost:5181/api/qcm/${qcmId}`);
        setQcm(response.data);
        setSelectedAnswers(response.data.questions.map(() => []));
      } catch (err) {
        setError("Erreur lors de la récupération du QCM.");
        console.error(err);
      }
    };

    fetchQCM();
  }, [qcmId]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const updated = [...selectedAnswers];
    if (updated[questionIndex].includes(answerIndex)) {
      updated[questionIndex] = updated[questionIndex].filter(i => i !== answerIndex);
    } else {
      updated[questionIndex].push(answerIndex);
    }
    setSelectedAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!studentId) {
      setError("Utilisateur non identifié.");
      setIsSubmitting(false);
      return;
    }

    const allAnswered = selectedAnswers.every(ans => ans.length > 0);
    if (!allAnswered) {
      setError("Veuillez sélectionner au moins une réponse pour chaque question.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      QCMId: parseInt(qcmId, 10),
      StudentId: studentId,
      SelectedAnswers: selectedAnswers,
    };

    try {
      await axios.post("http://localhost:5181/api/submit/submit", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccess("Réponses soumises avec succès !");
      setSelectedAnswers(qcm.questions.map(() => []));
    } catch (error) {
      let msg = "Erreur lors de la soumission des réponses.";
      if (error.response?.data?.Message) msg = error.response.data.Message;
      setError(msg);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!qcm) return <div style={{ color: "#c9d1d9", padding: 20 }}>Chargement...</div>;

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ color: "#58a6ff", textAlign: "center" }}>{qcm.title}</h1>

      {error && (
        <div style={{
          color: '#ff6b6b',
          backgroundColor: '#ffebee',
          padding: 15,
          borderRadius: 6,
          marginBottom: 20,
          border: '1px solid #ffcdd2',
          whiteSpace: 'pre-line'
        }}>{error}</div>
      )}

      {success && (
        <div style={{
          color: '#3fb950',
          backgroundColor: '#ebfbee',
          padding: 15,
          borderRadius: 6,
          marginBottom: 20,
          border: '1px solid #b7eb8f'
        }}>{success}</div>
      )}

      <form onSubmit={handleSubmit}>
        {qcm.questions.map((question, qIndex) => (
          <div key={question.id} style={{
            marginBottom: 30,
            padding: 15,
            backgroundColor: "#161b22",
            borderRadius: 8,
            color: "white"
          }}>
            <h4 style={{ marginBottom: 15 }}>{question.questionText}</h4>
            {question.answers.map((answer, aIndex) => (
              <label
                key={aIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                  cursor: 'pointer',
                  backgroundColor: selectedAnswers[qIndex].includes(aIndex) ? '#2a9d8f33' : 'transparent',
                  padding: '6px 10px',
                  borderRadius: 6,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedAnswers[qIndex]?.includes(aIndex) || false}
                  onChange={() => handleAnswerChange(qIndex, aIndex)}
                  style={{ position: 'absolute', opacity: 0 }}
                />
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid #1976d2',
                    display: 'inline-block',
                    marginRight: 10,
                    textAlign: 'center',
                    lineHeight: '18px',
                    color: '#1976d2',
                    fontWeight: 'bold',
                  }}
                >
                  {selectedAnswers[qIndex]?.includes(aIndex) ? '✓' : ''}
                </span>
                <span style={{ color: '#c9d1d9' }}>{answer}</span>
              </label>
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '14px',
            backgroundColor: isSubmitting ? '#1f6feb90' : '#1f6feb',
            color: 'white',
            fontSize: '1rem',
            borderRadius: 6,
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            border: 'none'
          }}
        >
          {isSubmitting ? "Envoi en cours..." : "Soumettre les réponses"}
        </button>
      </form>
    </div>
  );
}
