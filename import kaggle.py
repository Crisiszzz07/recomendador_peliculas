import kaggle

# Descargar el dataset
kaggle.api.dataset_download_files("omkarborikar/top-10000-popular-movies", path="./datasets", unzip=True)

print("Dataset descargado en ./datasets")
