from pydantic import BaseModel
from datetime import date
from typing import Optional

class TransactionBase(BaseModel):
    amount: float
    transaction_date: date
    category: str
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    transaction_id: int
    user_id: int
    
    class Config:
        from_attributes = True

class GoalBase(BaseModel):
    goal_name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalResponse(GoalBase):
    goal_id: int
    user_id: int
    
    class Config:
        from_attributes = True
