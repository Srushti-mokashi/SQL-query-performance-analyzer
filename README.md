# SQL-query-performance-analyzer

Real-Time Database Query Monitoring & Performance Analysis

This project is a SQL query performance monitoring dashboard designed to analyze database activity and identify performance bottlenecks.

It helps developers and database administrators monitor query execution, system status, query counts, and historical performance metrics through an interactive dashboard.

The system simulates how modern database observability tools track and visualize query performance in real time

## Project Overview

Database performance plays a critical role in backend systems.
Slow queries, inefficient indexes, and high database load can severely affect application performance.

This project provides a visual monitoring dashboard that helps analyze:
Query execution statistics
Query performance trends
System health
Query history
Database workload distribution

The dashboard helps identify slow queries and potential performance issues.


## System Architecture

Typical workflow of the SQL monitoring system:

Database Queries
      ↓
Query Logger / Analyzer
      ↓
Database Metrics Collection
      ↓
Backend Processing
      ↓
Performance Dashboard

The system continuously collects database metrics and visualizes them in a dashboard.


## Technologies Used

### Backend

Node.js
Express.js
REST API

### Database

SQL
PostgreSQL / MySQL
Query performance analysis

### Monitoring
Query performance tracking
Database metrics collection
System health monitoring

### Visualization
Charts
Dashboard analytics
Query history analysis

### Features
Query performance analysis
Query history tracking
Real-time system status monitoring
Database workload visualization
Query count tracking
Interactive performance charts
Dashboard analytics

### Project Structure

Example repository structure:

SQL-Performance-Analyzer
│
├── images
│   ├── dashboard.png
│   ├── charts.png
│   ├── counts.png
│   ├── query-analyzer.png
│   ├── query-history.png
│   ├── system-status.png
│   ├── force-refresh.png
│   ├── themebutton.png
│   └── themebutton2.png
│
├── backend
│
├── database
│
└── README.md


## Screenshots

### dashboard

![Dashboard](screenshots/dashboard.png)

### counts

![Dashboard](screenshots/counts.png)

### Charts

![Dashboard](screenshots/Charts.png)

### query analyzer

![Dashboard](screenshots/query-analyzer.png)

### query History

![Dashboard](screenshots/query-history.png)

### System Status

![Dashboard](screenshots/system-status.png)

### Theme Button
![Dashboard](screenshots/themebutton.png)
![Dashboard](screenshots/themebutton2png)

### Force Refresh

![Dashboard](screenshots/force-refresh.png)

### Dashboard Overview

<img src="images/dashboard.png" width="900">

The main dashboard provides a summary of database activity and performance metrics.

### Query Performance Charts

<img src="images/charts.png" width="900">

Charts visualize query execution statistics and performance trends.

### Query Counts

<img src="images/counts.png" width="900">

Displays the number of queries executed over time.

### Query Analyzer

<img src="images/query-analyzer.png" width="900">

Allows users to analyze SQL queries and detect potential performance issues.

### Query History

<img src="images/query-history.png" width="900">

Tracks previously executed queries for analysis and debugging.

### System Status

<img src="images/system-status.png" width="900">

Displays the health and status of the database system.

### Force Refresh Feature

<img src="images/force-refresh.png" width="900">

Allows users to manually refresh dashboard data.

## Theme Toggle

Light Mode / Dark Mode
<img src="images/themebutton.png" width="900"> <img src="images/themebutton2.png" width="900">

Users can switch between themes for better dashboard usability.


## Real-World Use Cases

This system architecture is commonly used in:

Database observability tools
Performance monitoring platforms
Backend debugging systems
Query optimization tools
Production database monitoring

## Learning Outcomes

Through this project I learned:

SQL query performance analysis
Database monitoring concepts
Backend API development
Query analytics visualization
Debugging database performance issues

## Future Improvements

Add automated slow query detection
Integrate Grafana dashboards
Add alerting system for slow queries
Implement query optimization suggestions
Add distributed database monitoring

## Author

Srushti Mokshi

MCA Student
Interested in Backend Systems, Observability, API Monitoring, and Distributed Systems

## Live Demo

Frontend:
https://sql-query-performance-analyzer.vercel.app

Backend API:
https://sql-query-performance-analyzer-project.onrender.com

Health Check:
https://sql-query-performance-analyzer-project.onrender.com/api/health
