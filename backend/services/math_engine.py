import pandas as pd

def calculate_spend_velocity(df_transactions: pd.DataFrame, budget_limit: float) -> float:
    """
    Calculates spend_velocity_ratio (projected EOM spend / budget limit)
    """
    if df_transactions.empty or budget_limit <= 0:
        return 0.0
        
    current_spend = df_transactions['amount'].sum()
    
    # Basic linear projection logic for MVP (e.g. half month means 2x scaling)
    projected_spend = current_spend * 1.5 
    
    return round(projected_spend / budget_limit, 2)

def calculate_savings_velocity(available_cash_flow: float, required_monthly_savings: float) -> float:
    """
    Calculates savings_velocity_ratio (available cash flow / required monthly savings)
    """
    if required_monthly_savings <= 0:
        return 0.0
        
    return round(available_cash_flow / required_monthly_savings, 2)
