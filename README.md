🍳 Ai-Cooking-Chatbot (aka CookBot)
Ai-Cooking-Chatbot, also called CookBot, is an AI-powered cooking assistant that combines a React/TypeScript frontend, a Flask/Python backend, MongoDB storage, and Gemini (Google AI) to help users chat, get recipes, save them, and manage cooking sessions in style.
🔗 Live Demo
👉 [Try CookBot Here](https://cookingchatbot.netlify.app/)

✨ Features
Frontend (React + TypeScript)
- Sleek, responsive chat interface with light/dark mode toggle
- Real-time messaging with typing indicators
- Recipes rendered into structured cards: titles, ingredient lists, instructions
- Click-to-copy ingredients feature
- Save and later retrieve recipes with bookmark icons
- Mobile-first design
Backend (Flask + Python)
- Integrated with Gemini API to process cooking queries using a custom prompt
- MongoDB stores chat sessions and saved recipes
- REST API endpoints for chat interactions and recipe handling
- Supports session tracking, CORS, and environment-based configuration

🧱 Project Structure
backend/
├── app.py              # Flask app and routes
├── database.py         # MongoDB connection
├── requirements.txt    # Python dependencies
└── .env.example        # Template for env variables

src/
├── components/         # UI components
├── contexts/           # Theme (Dark/Light) context
└── services/           # API calls (e.g., with Axios)

package.json            # Node dependencies
README.md               # Project documentation
.gitignore, tsconfig.json, tailwind.config.js, vite.config.ts, etc.



⚙️ Setup Instructions
Prerequisites
- Node.js (v18+) and npm
- Python (v3.8+)
- MongoDB (local or Mongo Atlas)
- Gemini API key
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env


Fill in your .env file:
GEMINI_API_KEY=your_key
MONGODB_URI=your_mongodb_uri


Ensure MongoDB is running (locally or via cloud):
python app.py


→ Backend now available at http://localhost:5000

Frontend Setup
npm install
npm run dev


→ Frontend hosted at http://localhost:5173

📡 API Endpoints
POST /api/chat
Send your cooking message.
Request:
{
  "message": "How do I make pasta?",
  "session_id": "session_123"
}


Response:
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


POST /api/save_recipe
Save the current recipe.
GET /api/my_recipes
Retrieve all saved recipes for the session.
GET /api/health
Health check endpoint.

🗃️ Database Schema
conversations
{
  "session_id": String,
  "history": Array,
  "created_at": Date,
  "updated_at": Date
}


recipes
{
  "recipe_id": String,
  "session_id": String,
  "recipe_data": Object,
  "saved_at": Date
}



🧑‍🍳 How to Use
- Open the app and click "Start Cooking Together"
- Chat like you would with a cooking assistant:
- “What can I make with chicken and rice?”
- “Give me a recipe for chocolate cake.”
- “What’s a good egg substitute for baking?”
- Get a recipe card: title, ingredient list, steps
- Use copy to quickly grab ingredients
- Click the bookmark icon to save favorite recipes
- Switch between light and dark themes anytime

🛠 Technologies Used
| Layer | Tech Stack | 
| Frontend | React 18, TypeScript, Tailwind CSS, Lucide React icons, Axios, Context API | 
| Backend | Flask (Python), Gemini API, PyMongo, Flask-CORS, python-dotenv | 
| Database | MongoDB | 



🧪 Development Notes
- The cooking assistant prompt is carefully crafted for helpful, structured output
- Recipe outputs are JSON for clean parsing
- Session-based chats allow follow-ups with memory
- Dark mode preference stored in localStorage
- API calls include error handling and user feedback

🤝 Contributing
To contribute:
- Fork the repository
- Create your feature branch
- Implement your changes
- Add tests if needed
- Submit a pull request for review
