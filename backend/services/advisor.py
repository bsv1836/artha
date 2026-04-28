from typing import Dict, Any
import vertexai
from vertexai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Vertex AI.
try:
    vertexai.init(location="us-central1")
    model = GenerativeModel("gemini-1.5-pro-preview-0409")
except Exception as e:
    print("Warning: Vertex AI not initialized correctly. Ensure credentials are set.", e)
    model = None


def generate_gemini_insight(data: Dict[str, Any]) -> str:
    """
    Calls Google Gemini via Vertex AI with a rich, category-aware financial prompt.
    Falls back to smart rule-based advice if billing is not active.
    """
    # Deterministic fallback data extraction
    category_spending = data.get('category_spending', {})
    total_spent = data.get('total_spent', 0)
    spend_velocity = data.get('spend_velocity', 0)

    top_category = "Other"
    top_amount = 0
    if category_spending:
        sorted_cats = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
        top_category, top_amount = sorted_cats[0]

    # --- Try Vertex AI first ---
    if model:
        try:
            category_lines = "\n".join([f"  - {cat}: ₹{amt}" for cat, amt in sorted_cats]) if category_spending else "  - No categorized transactions yet."

            prompt = f"""
You are Artha, a sharp, empathetic AI Personal CFO. You speak concisely and with confidence.
Analyze the following real financial data for the user this month and provide one or two sentences of hyper-personalized, actionable advice.

--- FINANCIAL SNAPSHOT ---
Monthly Budget Limit: ₹{data.get('budget_limit', 2000)}
Total Spent So Far: ₹{total_spent}
Available Cash Flow Remaining: ₹{data.get('available_cash_flow', 0)}
Number of Transactions Logged: {data.get('num_transactions', 0)}

Spending by Category:
{category_lines}

Spend Velocity (projected vs budget): {round(spend_velocity * 100, 1)}% of budget consumed
Savings Velocity (on track?): {'Yes' if data.get('savings_velocity', 0) <= 1.0 else 'No, falling behind'}

--- YOUR INSTRUCTIONS ---
- Be specific. If category data exists, explicitly call out the HIGHEST spending category ({top_category} at ₹{top_amount}).
- Give one concrete, actionable recommendation (e.g., "cut X by ₹Y", "redirect ₹Z to savings").
- Use a warm, advisor tone. No markdown, no bullet points, no asterisks.
- Maximum 2 sentences.
"""
            response = model.generate_content(prompt)
            return response.text.strip().replace('\n', ' ')
        except Exception as e:
            print(f"Vertex API Error: {e}")

    # --- Rule-Based Fallback (used when billing is inactive) ---
    if spend_velocity > 1.0:
        return f"You have consumed {round(spend_velocity*100)}% of your budget. High spending in '{top_category}' (₹{top_amount}) is driving this—consider cutting back here to avoid a deficit."
    elif spend_velocity > 0.8:
        return f"You are approaching your limit with ₹{data.get('available_cash_flow', 0)} remaining. It might be wise to pause non-essential purchases in '{top_category}' for the rest of the month."
    elif total_spent > 0:
        return f"Excellent control! You've spent only ₹{total_spent} so far. Since you're under budget, consider redirecting ₹{round(data.get('available_cash_flow', 0) * 0.5)} to your goals."
    else:
        return "Welcome to Artha! Once you log your first few transactions, I'll analyze your spending velocity and provide personalized strategy here."


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
