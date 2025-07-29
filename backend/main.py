from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import the working function from your other file
from api_client import search_perfumes 

app = FastAPI()

# This is the new part that fixes the error
origins = [
    "http://localhost:3000", # The origin of your frontend app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)


@app.get("/")
def read_root():
    """A simple endpoint to check if the server is running."""
    return {"message": "ScentSphere Backend is running!"}


@app.get("/search/{query}")
def get_perfume_search_results(query: str, limit: int = 5):
    """
    An endpoint to search for perfumes. 
    Example: /search/Viva La Juicy
    """
    results = search_perfumes(query, limit)
    return {"query": query, "results": results}