from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Cargar y preprocesar el dataset
df = pd.read_csv("./datasets/Top_10000_Movies.csv", engine="python")
df['overview'] = df['overview'].fillna('')

# Procesar el campo 'genre'
# Suponemos que el campo 'genre' es un string con formato similar a: "['Science Fiction', 'Action', 'Adventure']"
df['genre'] = df['genre'].fillna('')
df['genres_processed'] = df['genre'].apply(
    lambda x: " ".join([genre.strip() for genre in x.strip("[]").replace("'", "").replace('"', "").split(",")]) if x else ""
)

# Vectorización del texto usando TF-IDF para la descripción (overview)
tfidf_vectorizer_overview = TfidfVectorizer(stop_words='english')
tfidf_matrix_overview = tfidf_vectorizer_overview.fit_transform(df['overview'])

# Vectorización del texto usando TF-IDF para el género (genres_processed)
tfidf_vectorizer_genre = TfidfVectorizer(stop_words='english')
tfidf_matrix_genre = tfidf_vectorizer_genre.fit_transform(df['genres_processed'])

# Calcular similitudes coseno para cada componente
cosine_sim_overview = cosine_similarity(tfidf_matrix_overview, tfidf_matrix_overview)
cosine_sim_genre = cosine_similarity(tfidf_matrix_genre, tfidf_matrix_genre)

# Combinar ambas similitudes con pesos: 0.7 para descripción y 0.3 para género
alpha = 0.7
beta = 0.3
cosine_sim = alpha * cosine_sim_overview + beta * cosine_sim_genre

# Crear la API con FastAPI
app = FastAPI(title="API de Recomendación de Películas")

# Habilitar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringe este valor (por ejemplo, "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint raíz
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Recomendación de Películas"}

# Endpoint para buscar películas por título (o parte del mismo)
@app.get("/search")
def search_movies(title: str):
    matching_rows = df[df['original_title'].str.contains(title, case=False, na=False, regex=False)]
    if matching_rows.empty:
        raise HTTPException(status_code=404, detail="No se encontraron películas con ese título")
    results = []
    for idx, row in matching_rows.iterrows():
        results.append({
            "id": int(idx),
            "title": row["original_title"],
            "release_date": row["release_date"],
            "vote_count": int(row["vote_count"]),
            "overview": row["overview"],
            "genre": row["genre"]
        })
    return {"results": results}

# Endpoint para obtener recomendaciones basado en un movie_id específico o título
@app.get("/recommend")
def get_recommendations(movie_id: int = Query(None), title: str = Query(None)):
    # Si no se proporciona movie_id, se intenta buscar por título y se devuelven las opciones
    if movie_id is None:
        if title is None:
            raise HTTPException(status_code=400, detail="Debes proporcionar 'movie_id' o 'title'.")
        matching_rows = df[df['original_title'].str.contains(title, case=False, na=False, regex=False)]
        if matching_rows.empty:
            raise HTTPException(status_code=404, detail="Película no encontrada")
        # Si hay una única coincidencia, se usa ese movie_id automáticamente
        if len(matching_rows) == 1:
            movie_id = matching_rows.index[0]
        else:
            results = []
            for idx, row in matching_rows.iterrows():
                results.append({
                    "id": int(idx),
                    "title": row["original_title"],
                    "release_date": row["release_date"],
                    "vote_count": int(row["vote_count"]),
                    "overview": row["overview"],
                    "genre": row["genre"]
                })
            return {"message": "Múltiples coincidencias encontradas, selecciona una", "results": results}
    
    # Si se proporciona movie_id (o se obtuvo de forma automática), se calculan las recomendaciones
    if movie_id not in df.index:
        raise HTTPException(status_code=404, detail="El movie_id proporcionado no se encontró")
    sim_scores = list(enumerate(cosine_sim[movie_id]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Omitir la primera (la película misma) y seleccionar las 5 siguientes
    movie_indices = [i[0] for i in sim_scores[1:6]]
    recommendations = df['original_title'].iloc[movie_indices].tolist()
    return {"recommendations": recommendations}
