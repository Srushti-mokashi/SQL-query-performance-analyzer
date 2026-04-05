CREATE DATABASE IF NOT EXISTS sql_analyzer;
USE sql_analyzer;

CREATE TABLE IF NOT EXISTS query_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query_text TEXT NOT NULL,
    execution_time_ms DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    is_slow BOOLEAN DEFAULT FALSE,
    optimization_suggestion TEXT,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample dataset table for testing queries
CREATE TABLE IF NOT EXISTS sample_employees (
    emp_no INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE
);

INSERT IGNORE INTO sample_employees (emp_no, first_name, last_name, department, salary, hire_date) VALUES 
(1, 'John', 'Doe', 'Engineering', 95000.00, '2020-01-15'),
(2, 'Jane', 'Smith', 'Marketing', 85000.00, '2019-03-22'),
(3, 'Bob', 'Johnson', 'Sales', 75000.00, '2021-07-01'),
(4, 'Alice', 'Williams', 'Engineering', 105000.00, '2018-11-10'),
(5, 'Charlie', 'Brown', 'HR', 65000.00, '2022-02-28');
