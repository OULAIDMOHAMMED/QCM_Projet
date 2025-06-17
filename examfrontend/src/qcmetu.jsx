import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Configure axios une fois au niveau de l'application (à mettre dans index.js)
axios.defaults.withCredentials = true;

export default function RespondQCM() {
  const { qcmId } = useParams();
  const [qcm, setQcm] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Ici on simule l'id étudiant (à remplacer par la vraie valeur)
  const studentId = "123"; // Ex: "123" ou récupérer depuis localStorage ou contexte

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
    const newSelectedAnswers = selectedAnswers.map(answers => [...answers]);

    if (newSelectedAnswers[questionIndex].includes(answerIndex)) {
      newSelectedAnswers[questionIndex] = newSelectedAnswers[questionIndex].filter(i => i !== answerIndex);
    } else {
      newSelectedAnswers[questionIndex].push(answerIndex);
    }

    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (selectedAnswers.length === 0 || selectedAnswers.every(ans => ans.length === 0)) {
      setError("Veuillez sélectionner au moins une réponse pour chaque question.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:5181/api/submit/submit',
        {
          QCMId: parseInt(qcmId, 10),  // Assure que c’est un nombre
          StudentId: studentId,         // <-- Obligatoire !
          SelectedAnswers: selectedAnswers
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess("Réponses soumises avec succès !");
      setSelectedAnswers(qcm.questions.map(() => []));
    } catch (error) {
      let errorMessage = "Erreur lors de la soumission des réponses.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error('Erreur détaillée:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!qcm) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ color: '#58a6ff', textAlign: 'center' }}>{qcm.title}</h1>

      {error && (
        <div style={{
          color: '#ff6b6b',
          backgroundColor: '#ffebee',
          padding: 15,
          borderRadius: 6,
          marginBottom: 20,
          border: '1px solid #ffcdd2',
          whiteSpace: 'pre-line'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          color: '#3fb950',
          backgroundColor: '#ebfbee',
          padding: 15,
          borderRadius: 6,
          marginBottom: 20,
          border: '1px solid #b7eb8f'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {qcm.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: 30, padding: 15, backgroundColor: '#161b22', borderRadius: 8 }}>
            <h4>{question.questionText}</h4>
            {question.answers.map((answer, aIndex) => (
              <label key={aIndex} style={{ display: 'block', marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={selectedAnswers[index] && selectedAnswers[index].includes(aIndex)}
                  onChange={() => handleAnswerChange(index, aIndex)}
                />
                {answer}
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
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre les réponses'}
        </button>
      </form>
    </div>
  );
}
