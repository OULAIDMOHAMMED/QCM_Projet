import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditProfileForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const storedName = localStorage.getItem('nameuser');
    const storedEmail = localStorage.getItem('rememberedEmail');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5181/api/auth/update/${userId}`, {
        name,
        email,
        password
      });

      setMessage("✅ Profil mis à jour avec succès");
      localStorage.setItem('nameuser', name);
      localStorage.setItem('rememberedEmail', email);
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur lors de la mise à jour");
    }
  };

  return (
    <div>
      <h2>Modifier le Profil</h2>
      {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe (laisser vide pour ne pas changer)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
}
