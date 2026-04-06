# SQL Query Performance Analyzer - Frontend

This is the frontend dashboard for the SQL Query Performance Analyzer project. It provides a real-time interface for analyzing SQL queries, monitoring performance metrics, and viewing optimization suggestions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A running instance of the [Backend API](../backend)

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the `frontend` directory (optional if using defaults):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development
Start the development server:
```bash
npm run dev
```

### Production Build
Create a production-ready bundle:
```bash
npm run build
```

## 🛠️ Tech Stack
- **React 19** (Vite)
- **Tailwind CSS 4** (Modern Design)
- **Recharts** (Data Visualization)
- **Lucide-React** (Iconography)
- **React Syntax Highlighter** (SQL Display)
- **Axios** (API Client)

## 📁 Project Structure
- `src/components`: Reusable UI components and Layout
- `src/pages`: Main application pages (Dashboard, Analyzer, History, Status)
- `src/services`: API client and service discovery
- `src/context`: Global state and Theme management
- `src/utils`: Helper functions and styling utilities
