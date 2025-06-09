import React, { useState } from 'react';
import axios from 'axios';
import {
  Grid, Box, Typography, TextField, Button, Paper,
  Avatar, Checkbox, FormControlLabel, Link, CssBaseline,
  ThemeProvider, createTheme, LinearProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0d1117', paper: '#161b22' },
    primary: { main: '#1976d2' }
  }
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5181/api/auth/register', {
        email, password, role
      });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data || "Erreur d'inscription ❌"
      );
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Messages de statut */}
      {message && (
        <Box sx={{ position: 'fixed', top: 10, left: 0, right: 0, textAlign: 'center', zIndex: 9999 }}>
          <Paper elevation={3} sx={{ display: 'inline-block', px: 4, py: 2, bgcolor: 'success.main', color: '#fff' }}>
            <Typography>{message}</Typography>
            <LinearProgress color="success" sx={{ mt: 1 }} />
          </Paper>
        </Box>
      )}
      {error && (
        <Box sx={{ position: 'fixed', top: 10, left: 0, right: 0, textAlign: 'center', zIndex: 9999 }}>
          <Paper elevation={3} sx={{ display: 'inline-block', px: 4, py: 2, bgcolor: 'error.main', color: '#fff' }}>
            <Typography>{error}</Typography>
            <LinearProgress color="error" sx={{ mt: 1 }} />
          </Paper>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {/* Bloc gauche : descriptif produit (en haut sur mobile) */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#0d1117',
            color: '#c9d1d9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 6,
            order: { xs: 1, md: 1 } // Toujours en premier
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#58a6ff' }}>
            ⚡ Sitemark
          </Typography>
          <Box mb={4}>
            <Typography variant="h6">🛠️ Adaptable performance</Typography>
            <Typography>Boost efficiency by adapting to your needs.</Typography>
          </Box>
          <Box mb={4}>
            <Typography variant="h6">🧱 Built to last</Typography>
            <Typography>Durability and reliability that endures.</Typography>
          </Box>
          <Box mb={4}>
            <Typography variant="h6">👍 Great UX</Typography>
            <Typography>Seamless integration with intuitive interfaces.</Typography>
          </Box>
          <Box>
            <Typography variant="h6">🚀 Innovation</Typography>
            <Typography>Features that exceed expectations.</Typography>
          </Box>
        </Box>

        {/* Bloc droit : formulaire (en bas sur mobile) */}
        <Box
          component={Paper}
          elevation={6}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 4,
            order: { xs: 2, md: 2 }, // En second sur mobile
            minHeight: { xs: 'auto', md: '100vh' }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 400,
              mx: 'auto',
              width: '100%'
            }}
          >
            <Typography component="h1" variant="h5">Inscription</Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Adresse Email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Rôle"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="Student">Étudiant</option>
                <option value="Professor">Professeur</option>
              </TextField>

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Se souvenir de moi"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Chargement...' : "S'inscrire"}
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">Mot de passe oublié ?</Link>
                </Grid>
                <Grid item>
                  <Link href="/login" variant="body2">Déjà inscrit ? Connexion</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}