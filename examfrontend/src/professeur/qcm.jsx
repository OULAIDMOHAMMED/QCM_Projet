import React, { useState } from 'react';
import axios from 'axios';


axios.defaults.withCredentials = true;

export default function CreateQCM() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', answers: ['', '', '', ''], correctIndexes: [] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    const corrects = newQuestions[qIndex].correctIndexes;
    if (corrects.includes(aIndex)) {
      newQuestions[qIndex].correctIndexes = corrects.filter(i => i !== aIndex);
    } else {
      newQuestions[qIndex].correctIndexes = [...corrects, aIndex];
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correctIndexes: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Validation des données
      if (!title.trim()) {
        throw new Error('Le titre du QCM est requis');
      }

      const hasValidQuestions = questions.some(
        q => q.question.trim() && q.answers.some(a => a.trim())
      );
      
      if (!hasValidQuestions) {
        throw new Error('Ajoutez au moins une question valide');
      }

      const qcmData = {
        Title: title,
        Questions: questions
          .filter(q => q.question.trim())
          .map(q => ({
            QuestionText: q.question,
            Answers: q.answers.filter(a => a.trim()),
            CorrectIndexes: q.correctIndexes
          }))
      };

      const response = await axios.post(
        'http://localhost:5181/api/qcm/create', 
        qcmData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      
      setTitle('');
      setQuestions([{ question: '', answers: ['', '', '', ''], correctIndexes: [] }]);
      setSuccess(response.data.message || 'QCM créé avec succès!');
      
    } catch (error) {
      let errorMessage = "Erreur lors de la création du QCM";
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Impossible de se connecter au serveur. Vérifiez:";
        errorMessage += "\n1. Que le backend est en cours d'exécution";
        errorMessage += "\n2. Que l'URL est correcte (http://localhost:5181)";
        errorMessage += "\n3. Votre connexion internet";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
      console.error('Erreur détaillée:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ color: '#58a6ff', textAlign: 'center' }}>Créer un QCM</h1>
      
      {}
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
      
      {}
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
        <input
          type="text"
          placeholder="Titre du QCM"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 20, borderRadius: 6, border: '1px solid #30363d', backgroundColor: '#0d1117', color: '#c9d1d9' }}
        />

        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 30, padding: 15, backgroundColor: '#161b22', borderRadius: 8 }}>
            <input
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(i, e.target.value)}
              required
              style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 6, border: '1px solid #30363d', backgroundColor: '#0d1117', color: '#c9d1d9' }}
            />
            {q.answers.map((a, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 8,
                  cursor: 'pointer',
                  userSelect: 'none',
                  backgroundColor: q.correctIndexes.includes(idx) ? '#2a9d8f33' : 'transparent',
                  padding: '6px 10px',
                  borderRadius: 6,
                }}
              >
                <input
                  type="checkbox"
                  name={`correct-${i}-${idx}`}
                  checked={q.correctIndexes.includes(idx)}
                  onChange={() => handleCorrectChange(i, idx)}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
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
                  {q.correctIndexes.includes(idx) ? '✓' : ''}
                </span>
                <input
                  type="text"
                  placeholder={`Réponse ${idx + 1}`}
                  value={a}
                  onChange={(e) => handleAnswerChange(i, idx, e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid #30363d',
                    backgroundColor: '#0d1117',
                    color: '#c9d1d9',
                  }}
                />
              </label>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          style={{ marginBottom: 20, padding: '10px 15px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Ajouter une question
        </button>

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
          {isSubmitting ? 'Envoi en cours...' : 'Enregistrer le QCM'}
        </button>
      </form>
    </div>
  );
}