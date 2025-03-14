# Recomendador de Películas / Movie Recommender

## Description / Descripción

**English:**  
This project is a movie recommender system built using FastAPI for the backend and Next.js for the frontend. It leverages a movie dataset to provide recommendations based on a combination of the movie's description and genre.  
**Important:** The movie title entered for search must exactly match the original title (in its original language) and must exist in the dataset file.

**Español:**  
Este proyecto es un sistema de recomendación de películas construido usando FastAPI para el backend y Next.js para el frontend. Utiliza un dataset de películas para ofrecer recomendaciones basadas en la descripción y el género de cada película.  
**Importante:** El título de la película ingresado en la búsqueda debe corresponder exactamente al título original (en su idioma original) y debe encontrarse en el archivo del dataset.

## Features / Funcionalidades

- **Backend:** FastAPI server to compute movie recommendations.
- **Frontend:** Next.js interface for an interactive user experience.
- Recommendations based on **both** the movie's description and genre similarity.
- Bilingual documentation (English & Español).

## Installation / Instalación

### Backend (FastAPI)

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
2. **Navigate to the project directory:**
   ```bash
   cd recomendador_peliculas
3. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
On Windows:
    ```bash
    venv\Scripts\activate
On macOS/Linux:
    source venv/bin/activate
4. **Install the required packages:**
    ```bash
    pip install -r requirements.txt
5. **Run the backend server:**
    uvicorn main:app --reload

### Frontend (Next.js)

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
2. **Install dependencies:**
    ```bash
    npm install
3. **Start the development server:**
    ```bash
    npm run dev
4. **Open your browser and visit http://localhost:3000**

## Dataset / Conjunto de Datos
The dataset used is located in the datasets folder as Top_10000_Movies.csv.

El dataset utilizado se encuentra en la carpeta datasets como Top_10000_Movies.csv.

## Important / Importante:

English: The movie title you search for must exactly match the original title in the dataset (including the language).
Español: El título de la película que se ingrese en la búsqueda debe corresponder exactamente al título original en el dataset (incluyendo el idioma).

## Usage / Uso:
1. On the homepage, enter the title of a movie in the search box.
En la página principal, ingresa el título de una película en el campo de búsqueda.
2. If a unique match is found, the recommendations based on description and genre similarity will be displayed.
Si se encuentra una única coincidencia, se mostrarán las recomendaciones basadas en la similitud de la descripción y el género.
3. If multiple matches are found, a list of options will be displayed for you to select from.
Si se encuentran múltiples coincidencias, se mostrará una lista de opciones para que selecciones la que deseas.