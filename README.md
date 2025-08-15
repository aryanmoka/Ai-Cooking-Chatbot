# CookBot - AI Cooking Chatbot

A full-stack AI-powered cooking assistant built with React, Flask, and OpenAI GPT-3.5.

## Features

### Frontend (React + TypeScript)
- 🎨 Modern, responsive chat interface with dark mode support
- 💬 Real-time messaging with typing indicators
- 📝 Structured recipe cards with ingredient lists and step-by-step instructions
- 📋 Copy-to-clipboard functionality for ingredients
- 💾 Recipe saving and retrieval
- 📱 Mobile-first responsive design
- 🌙 Dark/light theme toggle

### Backend (Flask + Python)
- 🤖 OpenAI GPT-3.5 integration with custom cooking assistant prompt
- 🗄️ MongoDB database for conversation history and recipe storage
- 🔄 RESTful API endpoints for chat, recipe management
- 🛡️ CORS enabled for frontend communication
- ⚡ Session-based conversation tracking

## Project Structure

```
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── database.py         # MongoDB integration
│   ├── requirements.txt    # Python dependencies
│   └── .env.example       # Environment variables template
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── contexts/          # React contexts (Theme)
│   ├── services/          # API service layer
│   └── ...
├── package.json           # Node.js dependencies
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key and MongoDB URI:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/
   ```

5. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For cloud MongoDB: Ensure your cluster is running

6. **Run the Flask server:**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## API Endpoints

### POST /api/chat
Send a message to the AI cooking assistant.

**Request:**
```json
{
  "message": "How do I make pasta?",
  "session_id": "session_123"
}
```

**Response:**
```json
{
  "response": "Here's how to make pasta...",
  "session_id": "session_123",
  "is_recipe": true,
  "recipe_data": {
    "title": "Basic Pasta",
    "ingredients": ["1 lb pasta", "Salt", "Water"],
    "instructions": ["Boil water...", "Add pasta..."]
  }
}
```

### POST /api/save_recipe
Save a recipe to the user's collection.

### GET /api/my_recipes
Retrieve all saved recipes for a session.

### GET /api/health
Health check endpoint.

## Database Schema

### conversations Collection
```javascript
{
  session_id: String,
  history: Array,
  created_at: Date,
  updated_at: Date
}
```

### recipes Collection
```javascript
{
  recipe_id: String,
  session_id: String,
  recipe_data: Object,
  saved_at: Date
}
```

## Usage

1. **Start a conversation:** Click "Start Cooking Together" on the welcome screen
2. **Ask cooking questions:** Type questions about recipes, ingredients, or cooking techniques
3. **Get structured recipes:** The AI will format recipes with ingredients and instructions
4. **Copy ingredients:** Use the copy button to copy ingredient lists to clipboard
5. **Save recipes:** Click the bookmark icon to save recipes for later
6. **Toggle theme:** Use the theme toggle in the header to switch between light and dark modes

## Example Prompts

- "What can I make with chicken and rice?"
- "Give me a recipe for chocolate cake"
- "How do I make pasta from scratch?"
- "Quick dinner ideas for two people"
- "What's a good substitute for eggs in baking?"

## Technologies Used

### Frontend
- React 18 + TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- Context API for theme management

### Backend
- Flask (Python web framework)
- OpenAI GPT-3.5 API
- PyMongo (MongoDB driver)
- Flask-CORS for cross-origin requests
- python-dotenv for environment variables

### Database
- MongoDB for conversation history and recipe storage

## Development Notes

- The system prompt is carefully crafted to ensure the AI responds as a helpful cooking assistant
- Recipe responses are structured as JSON for proper parsing and display
- Session-based conversation tracking allows for contextual follow-up questions
- Dark mode preference is persisted in localStorage
- All API calls include proper error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.