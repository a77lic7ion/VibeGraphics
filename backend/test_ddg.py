from duckduckgo_search import DDGS
import json

try:
    print("Testing DuckDuckGo Search...")
    with DDGS() as ddgs:
        results = list(ddgs.text("test", max_results=3))
        print(json.dumps(results, indent=2))
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
