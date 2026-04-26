# AI Agent: Natural Language to SQL 🤖🗄️

This project is an AI-powered agentic backend that converts natural language questions into executable SQL queries, runs them against a local SQLite database, and returns human-friendly responses in the user's language (English, Hindi, or Hinglish).

## 🚀 Features

- **Natural Language to SQL**: Ask questions in plain text, and the AI translates them into `SELECT` queries.
- **Human-Friendly Responses**: Database results are summarized and explained naturally by a secondary response agent.
- **Multilingual Support**: Understands and responds in English, Hindi, and Hinglish.
- **Secure & Robust**: 
  - Validates SQL to ensure only `SELECT` queries are executed.
  - Mitigates prompt injection via XML tagging.
  - Results truncation prevents token limit exhaustion.
- **Performance Optimized**: AI agents are pre-loaded into memory to avoid cold starts.
- **Production Ready API**: Includes CORS support, Request Validation, and API Rate Limiting.

## 🛠️ Tech Stack

- **Backend Framework**: Express.js (v5)
- **AI / LLM**: Google Gemini API via `@google/adk` and `@google/generative-ai`
- **Database**: SQLite3 (`better-sqlite3`)
- **Query Builder**: Kysely
- **Middleware**: `cors`, `express-rate-limit`, `express-validator`

## ⚙️ Prerequisites

- Node.js (v18 or higher recommended)
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy the example `.env` file and configure your API keys.
   ```bash
   cp .env-example .env
   ```
   Edit `.env` and fill in your details:
   ```env
   IP=127.0.0.1
   PORT=4000

   GOOGLE_MODEL=gemini-2.5-flash
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

## 🚀 Running the Application

**Development Mode (with hot-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```
*Upon startup, the console will show `Preloading AI Agents...` and `Server Listening on 127.0.0.1:4000`.*

## 🔌 API Documentation

### Ask a Question

`POST /api/agent/query`

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "query": "How many total customers do we have in Delhi?"
}
```

**Successful Response (200 OK):**
```json
{
  "success": true,
  "message": "Query result",
  "data": "Delhi mein total 45 customers hain."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid details",
  "error": {
    "query": "Query is required"
  }
}
```

## 🧠 How it Works

1. **User Request**: The user submits a question to `/api/agent/query`.
2. **Safety Wrapper**: The question is wrapped in `<request>` tags to prevent prompt injection.
3. **Query Expert Agent (`db-query-expert`)**: Analyzes the schema and generates a raw, read-only SQLite `SELECT` query.
4. **Execution Check**: The system extracts the SQL, ensures it starts with `SELECT`, and verifies it doesn't contain chained commands (like `; DROP TABLE`).
5. **Database Execution**: Kysely executes the SQL against the local `sqlite.db` and truncates the results to a maximum of 50 rows.
6. **Response Expert Agent (`db-response-expert`)**: Takes the user's original question and the raw JSON database result, and synthesizes a friendly, conversational answer in the appropriate language.
