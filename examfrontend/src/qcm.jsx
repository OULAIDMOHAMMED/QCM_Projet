import React, { useState } from 'react';

export default function CreateQCM() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', answers: ['', '', '', ''], correctIndexes: [] } // correctIndexes est un tableau
  ]);

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

  // Gère la sélection/désélection d'une réponse correcte
  const handleCorrectChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    const corrects = newQuestions[qIndex].correctIndexes;
    if (corrects.includes(aIndex)) {
      // Désélectionner si déjà présent
      newQuestions[qIndex].correctIndexes = corrects.filter(i => i !== aIndex);
    } else {
      // Ajouter à la sélection
      newQuestions[qIndex].correctIndexes = [...corrects, aIndex];
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correctIndexes: [] }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, envoyer le QCM au backend ou le stocker
    console.log({ title, questions });
    alert("QCM créé avec succès !");
    setTitle('');
    setQuestions([{ question: '', answers: ['', '', '', ''], correctIndexes: [] }]);
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1 style={{ color: '#58a6ff', textAlign: 'center' }}>Créer un QCM</h1>
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
          style={{ padding: '14px', backgroundColor: '#1f6feb', color: 'white', fontSize: '1rem', borderRadius: 6, cursor: 'pointer' }}
        >
          Enregistrer le QCM
        </button>
      </form>
    </div>
  );
}
