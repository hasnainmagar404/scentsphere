import os
import requests
from dotenv import load_dotenv

# Load the API key from your .env file
load_dotenv()
API_KEY = os.getenv("FRAGELLA_API_KEY")

# This is the "brain" of your recommender. It maps moods to search terms.
MOOD_TO_ACCORDS_MAP = {
    "romantic": "sweet white floral vanilla",
    "fresh": "citrus fresh aquatic",
    "professional": "woody aromatic fresh spicy",
    "casual": "fruity sweet fresh",
    "night out": "amber vanilla warm spicy",
}

def get_recommendations_by_mood(mood: str, limit: int = 5):
    """
    Gets a search query from the mood map and fetches recommendations.
    """
    # Find the search query from the map, or use the mood itself as a fallback
    search_query = MOOD_TO_ACCORDS_MAP.get(mood.lower(), mood)
    
    url = "https://api.fragella.com/api/v1/fragrances"
    headers = {"x-api-key": API_KEY}
    params = {"search": search_query, "limit": str(limit)}

    try:
        print(f"▶️  Searching for perfumes with accords: '{search_query}'...")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ API Error: {e}")
        return []

# This part runs when you test the file directly
if __name__ == "__main__":
    test_mood = "professional"
    perfumes = get_recommendations_by_mood(test_mood)
    
    if perfumes:
        print(f"\n✅ Found {len(perfumes)} perfumes for a '{test_mood}' mood:")
        for p in perfumes:
            print(f"- {p.get('Name')} by {p.get('Brand')}")
    else:
        print(f"⚠️ No perfumes found for '{test_mood}'.")
        