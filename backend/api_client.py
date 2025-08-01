import os
import requests
from dotenv import load_dotenv

# Load the API key from your .env file
load_dotenv()
API_KEY = os.getenv("FRAGELLA_API_KEY")

def search_perfumes(query: str, limit: int = 5):
    """
    Searches for perfumes using the working /fragrances endpoint.
    """
    # This is the endpoint that worked in the playground
    url = "https://api.fragella.com/api/v1/fragrances"

    if not API_KEY:
        print(" ERROR: API key not found. Check your .env file.")
        return []

    headers = {"x-api-key": API_KEY}
    params = {"search": query, "limit": str(limit)}

    try:
        print(f"▶  Searching for perfumes matching: '{query}'...")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        data = response.json()
        # The search results are directly in the response list
        return data

    except requests.exceptions.RequestException as e:
        print(f" API Error: {e}")
        # If there's a detailed error message in the response, print it
        if 'response' in locals() and response.text:
            print(f" Response Body: {response.text}")
        return []

# This part lets you test the file directly
if __name__ == "__main__":
    print("--- Testing API Client with /fragrances endpoint ---")
    # Let's test with the same query that worked in the playground
    test_query = "Viva La Juicy" 
    perfumes = search_perfumes(test_query)

    if perfumes:
        print(f" Found {len(perfumes)} perfumes for query '{test_query}':")
        for p in perfumes:
            print(f"- {p.get('Name')} by {p.get('Brand')}")
    else:
        print(" Test finished, but no perfumes were returned.")