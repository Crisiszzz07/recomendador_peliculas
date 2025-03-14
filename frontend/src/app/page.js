"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [title, setTitle] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [multipleMatches, setMultipleMatches] = useState([]);
  const [error, setError] = useState('');

  // Llama al endpoint /recommend usando el título ingresado
  const handleSearch = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/recommend', {
        params: { title }
      });
      // Si la respuesta trae recomendaciones (única coincidencia)
      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        setMultipleMatches([]);
        setError('');
      }
      // Si se encontraron múltiples coincidencias, se muestran para que el usuario elija
      else if (response.data.results) {
        setMultipleMatches(response.data.results);
        setRecommendations([]);
        setError('');
      }
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
      setRecommendations([]);
      setMultipleMatches([]);
      setError('No se encontraron recomendaciones o la película no existe.');
    }
  };

  // Se llama cuando el usuario selecciona una opción de múltiples coincidencias
  const handleSelectMovie = async (movieId) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/recommend', {
        params: { movie_id: movieId }
      });
      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        setMultipleMatches([]);
        setError('');
      }
    } catch (err) {
      console.error('Error al obtener recomendaciones:', err);
      setRecommendations([]);
      setMultipleMatches([]);
      setError('Error al obtener recomendaciones.');
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Recomendador de Películas</h1>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Ingresa el título de una película..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSearch} style={styles.button}>
            Buscar
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        
        {/* Muestra opciones si hay múltiples coincidencias */}
        {multipleMatches.length > 0 && (
          <div style={styles.resultsContainer}>
            <h2 style={styles.subtitle}>Se encontraron varias coincidencias:</h2>
            <ul style={styles.list}>
              {multipleMatches.map((movie) => (
                <li key={movie.id} style={styles.listItem}>
                  <span style={styles.movieInfo}>
                    {movie.title} ({movie.release_date}) - Votos: {movie.vote_count}
                  </span>
                  <button 
                    onClick={() => handleSelectMovie(movie.id)}
                    style={styles.selectButton}
                  >
                    Seleccionar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Muestra las recomendaciones si existen */}
        {recommendations.length > 0 && (
          <div style={styles.resultsContainer}>
            <h2 style={styles.subtitle}>Recomendaciones:</h2>
            <ul style={styles.list}>
              {recommendations.map((rec, index) => (
                <li key={index} style={styles.listItem}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '2rem',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    marginRight: '0.5rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#38a169',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: '#ff6b6b',
    marginBottom: '1rem',
  },
  resultsContainer: {
    marginTop: '2rem',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem',
    borderRadius: '5px',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieInfo: {
    fontSize: '1rem',
  },
  selectButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3182ce',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
