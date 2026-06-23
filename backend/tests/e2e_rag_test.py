"""
e2e_rag_test.py — Integration test for hierarchical RAG via HTTP API.

This script sends HTTP requests to the running backend server and validates
responses for correctness, timing, and presence of relevant details about Garv.

REQUIRES: Backend server running at http://localhost:8000

Run with: python backend/tests/e2e_rag_test.py

Tests:
  1. Single questions (identity, skills, projects)
  2. Multiple questions in one message (education + internship)
  3. Questions requiring different knowledge base files
  4. Various validation checks (Garv in response, coherence, timing)
"""

import time
import requests
import json
from typing import List, Dict, Any

BASE_URL = "http://localhost:8000"
CHAT_ENDPOINT = f"{BASE_URL}/chat"

# Validation keywords for Garv-specific details
GARV_IDENTIFIERS = {"garv", "jain", "backend", "engineer", "poornima"}
PROJECT_NAMES = {"scanvista", "datainsights", "codealive", "apnaev", "complysense", "uiaudit"}
SKILL_KEYWORDS = {"python", "fastapi", "react", "typescript", "faiss", "embeddings", "redis", "docker"}
CERT_KEYWORDS = {"certification", "aws", "google", "microsoft", "diploma"}


def validate_response(response_text: str, expected_keywords: set[str], query: str) -> Dict[str, Any]:
    """
    Validate that response contains expected details about Garv.
    Returns a dict with validation results.
    """
    text_lower = response_text.lower()
    
    # Check for Garv identifiers (always expected)
    garv_found = any(kw in text_lower for kw in GARV_IDENTIFIERS)
    
    # Check for expected keywords
    found_keywords = [kw for kw in expected_keywords if kw in text_lower]
    keyword_match_pct = len(found_keywords) / len(expected_keywords) if expected_keywords else 0
    
    # Basic coherence: response should be reasonably long
    is_coherent = len(response_text.strip()) > 50
    
    # Check for hallucination markers
    has_confidence_gaps = "isn't in my knowledge base" in response_text or "doesn't appear" in response_text
    
    return {
        "garv_found": garv_found,
        "keywords_matched": found_keywords,
        "keyword_match_pct": keyword_match_pct,
        "is_coherent": is_coherent,
        "has_confidence_gaps": has_confidence_gaps,
        "response_length": len(response_text),
    }


def send_query(query: str, history: List[Dict[str, str]] | None = None) -> tuple[str, float, bool]:
    """
    Send a query to the chat endpoint and return (response_text, elapsed_time, success).
    """
    payload = {
        "message": query,
        "history": history or [],
    }
    
    print(f"\n[test] Query: {query}")
    t0 = time.perf_counter()
    
    try:
        response = requests.post(CHAT_ENDPOINT, json=payload, timeout=60)
        elapsed = time.perf_counter() - t0
        
        if response.status_code != 200:
            print(f"[test][ERROR] HTTP {response.status_code}: {response.text}")
            return "", elapsed, False
        
        # Response is typically server-sent events (SSE) or streaming text
        # Try to parse as JSON first, then as plain text
        try:
            data = response.json()
            text = data.get("answer", data.get("message", ""))
        except json.JSONDecodeError:
            text = response.text
        
        return text, elapsed, True
    except Exception as e:
        print(f"[test][ERROR] Request failed: {e}")
        return "", 0.0, False


def run_tests():
    """Run comprehensive test suite against live API."""
    
    print("[test] Checking server availability...")
    try:
        resp = requests.get(f"{BASE_URL}/health", timeout=5)
        if resp.status_code != 200:
            print(f"[test][ERROR] Server health check failed: {resp.status_code}")
            return
        print(f"[test] ✓ Server is running")
    except Exception as e:
        print(f"[test][ERROR] Cannot reach server at {BASE_URL}: {e}")
        print("[test] Make sure the backend is running: uvicorn backend.main:app --reload")
        return
    
    # Test scenarios
    test_cases = [
        {
            "name": "Single question - Identity",
            "query": "Who is Garv Jain?",
            "expected": GARV_IDENTIFIERS | {"computer science", "engineer"},
            "description": "Tests basic identity retrieval",
        },
        {
            "name": "Single question - Education",
            "query": "Where did you study and what is your education background?",
            "expected": GARV_IDENTIFIERS | {"poornima", "2027", "jaipur"},
            "description": "Tests education knowledge base file",
        },
        {
            "name": "Single question - Skills",
            "query": "What are your technical skills?",
            "expected": SKILL_KEYWORDS,
            "description": "Tests skills retrieval",
        },
        {
            "name": "Single question - Certifications",
            "query": "List your certifications and achievements.",
            "expected": CERT_KEYWORDS,
            "description": "Tests certifications and achievements",
        },
        {
            "name": "Two questions - Different topics",
            "query": "Tell me about ScanVista project. Also, what was your tech stack for DataInsights?",
            "expected": {"scanvista", "datainsights", "faiss", "vector"},
            "description": "Tests multi-question with different knowledge files",
        },
        {
            "name": "Two questions - Same query",
            "query": "What backend technologies do you use? What about frontend?",
            "expected": SKILL_KEYWORDS | {"react", "fastapi", "typescript"},
            "description": "Tests multi-question on overlapping topics",
        },
        {
            "name": "Projects overview",
            "query": "Which of your projects involved machine learning or AI?",
            "expected": PROJECT_NAMES | {"embeddings", "retrieval"},
            "description": "Tests cross-project knowledge synthesis",
        },
        {
            "name": "Architecture question",
            "query": "Explain how the RAG architecture works in this portfolio.",
            "expected": {"retrieval", "augmented", "generation", "chunks", "embedding"},
            "description": "Tests system design knowledge",
        },
        {
            "name": "Experience question",
            "query": "Where did you work and what did you do? Tell me about your internships.",
            "expected": GARV_IDENTIFIERS | {"intern", "experience", "role"},
            "description": "Tests experience and background",
        },
        {
            "name": "Multiple details",
            "query": "What models do you use for embeddings and chat? How are chunks retrieved?",
            "expected": {"embedding", "chat", "gpt", "openai", "faiss", "chunks"},
            "description": "Tests technical details across multiple aspects",
        },
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'='*80}")
        print(f"TEST {i}: {test_case['name']}")
        print(f"Description: {test_case['description']}")
        print(f"{'='*80}")
        
        text, elapsed, success = send_query(test_case["query"])
        
        if not success:
            print(f"[test] ✗ Request failed")
            results.append({
                "test": test_case["name"],
                "success": False,
                "time_s": elapsed,
                "response_len": 0,
                "validation": None,
            })
            continue
        
        # Validate response
        validation = validate_response(text, test_case["expected"], test_case["query"])
        
        print(f"[test] ✓ Response received in {elapsed:.3f}s")
        print(f"[test] Response length: {validation['response_length']} chars")
        print(f"[test] Garv identifiers found: {validation['garv_found']}")
        print(f"[test] Keywords matched: {validation['keyword_match_pct']:.0%} ({len(validation['keywords_matched'])}/{len(test_case['expected'])})")
        print(f"[test] Coherent response: {validation['is_coherent']}")
        if validation['has_confidence_gaps']:
            print(f"[test] → Honest about knowledge gaps: YES")
        
        # Show first 300 chars of response
        response_preview = text[:300].replace("\n", " ")
        print(f"[test] Preview: {response_preview}...")
        
        results.append({
            "test": test_case["name"],
            "query": test_case["query"],
            "success": True,
            "time_s": elapsed,
            "response_len": validation["response_length"],
            "validation": validation,
        })
    
    # Print summary
    print(f"\n\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    
    success_count = sum(1 for r in results if r["success"])
    print(f"Passed: {success_count}/{len(results)}")
    
    if success_count == len(results):
        print("\n[test] ✓ All tests passed!")
    
    print("\nTimings:")
    for r in results:
        if r["success"]:
            print(f"  {r['test']:40} | {r['time_s']:6.3f}s | {r['response_len']:5} chars")
    
    print("\nValidation Summary:")
    for r in results:
        if r["success"] and r["validation"]:
            v = r["validation"]
            print(
                f"  {r['test']:40} | Garv:{v['garv_found']!s:5} | "
                f"Keywords:{v['keyword_match_pct']:.0%} | Coherent:{v['is_coherent']!s:5}"
            )
    
    # Average timing
    valid_times = [r["time_s"] for r in results if r["success"]]
    if valid_times:
        avg_time = sum(valid_times) / len(valid_times)
        print(f"\nAverage response time: {avg_time:.3f}s")


if __name__ == "__main__":
    run_tests()
