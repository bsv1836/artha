from typing import Dict, Any
import vertexai
from vertexai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Vertex AI.
try:
    # vertexai.init automatically discovers your Project ID using your GOOGLE_APPLICATION_CREDENTIALS json key.
    vertexai.init(location="us-central1")
    model = GenerativeModel("gemini-1.5-pro-preview-0409")

except Exception as e:
    print("Warning: Vertex AI not initialized correctly. Ensure credentials are set.", e)
    model = None

def generate_gemini_insight(data: Dict[str, Any]) -> str:
    """
    Calls Google Gemini via Vertex AI with a rich, category-aware financial prompt.
    """
    if not model:
        return "Vertex AI is not configured. Please supply valid Google Cloud Credentials to activate the Intelligence Engine."

    # Build a readable category breakdown string for the prompt
    category_spending = data.get('category_spending', {})
    if category_spending:
        # Sort by highest spend first
        sorted_cats = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
        category_lines = "\n".join([f"  - {cat}: ${amt}" for cat, amt in sorted_cats])
        # Find the top spending category for the prompt focus
        top_category, top_amount = sorted_cats[0]
    else:
        category_lines = "  - No categorized transactions yet."
        top_category, top_amount = None, 0

    prompt = f"""
You are Artha, a sharp, empathetic AI Personal CFO. You speak concisely and with confidence.
Analyze the following real financial data for the user this month and provide one or two sentences of hyper-personalized, actionable advice.

--- FINANCIAL SNAPSHOT ---
Monthly Budget Limit: ${data.get('budget_limit', 2000)}
Total Spent So Far: ${data.get('total_spent', 0)}
Available Cash Flow Remaining: ${data.get('available_cash_flow', 0)}
Number of Transactions Logged: {data.get('num_transactions', 0)}

Spending by Category:
{category_lines}

Spend Velocity (projected vs budget): {round(data.get('spend_velocity', 0) * 100, 1)}% of budget consumed
Savings Velocity (on track?): {'Yes' if data.get('savings_velocity', 0) <= 1.0 else 'No, falling behind'}

--- YOUR INSTRUCTIONS ---
- Be specific. If category data exists, explicitly call out the HIGHEST spending category ({top_category} at ${top_amount}).
- Give one concrete, actionable recommendation (e.g., "cut X by $Y", "redirect $Z to savings").
- Use a warm, advisor tone. No markdown, no bullet points, no asterisks.
- Maximum 2 sentences.
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip().replace('\n', ' ')
    except Exception as e:
        print(f"Vertex API Error: {e}")
        return "An error occurred while generating insights. Our CFO is recalibrating."


def generate_insight(financial_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Hybrid rules engine: Uses deterministic triggers to invoke Gemini.
    """
    spend_velocity = financial_data.get("spend_velocity", 0)
    savings_velocity = financial_data.get("savings_velocity", 0)
    
    insight_payload = {
        "trigger": None,
        "action": "",
        "message": ""
    }
    
    # Deterministic if/elif logic
    if spend_velocity > 1.15:
        insight_payload["trigger"] = "HIGH_SPEND_VELOCITY"
        insight_payload["action"] = "Review Budget"
    elif savings_velocity > 1.0 and financial_data.get("available_cash_flow", 0) > 100:
        insight_payload["trigger"] = "EXCESS_CASH_FLOW"
        insight_payload["action"] = "Transfer to Savings"
    else:
        insight_payload["trigger"] = "ON_TRACK"
        insight_payload["action"] = "View Details"
        
    # Inject generative text based on raw payload
    insight_payload["message"] = generate_gemini_insight(financial_data)
    
    return insight_payload
