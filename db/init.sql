CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Financial_Goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00,
    deadline DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Sample Query: Simulating a data pull for a specific user's monthly spend vs active goals
SELECT 
    u.email,
    SUM(t.amount) as monthly_spend,
    (SELECT SUM(target_amount - current_amount) 
     FROM Financial_Goals fg 
     WHERE fg.user_id = u.user_id) as remaining_goals_total
FROM 
    Users u
JOIN 
    Transactions t ON u.user_id = t.user_id
WHERE 
    u.firebase_uid = 'sample_firebase_uid_123'
    AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY 
    u.email, u.user_id;
