from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import uuid
from datetime import datetime
from database import Database
import smtplib # Import for sending emails
import ssl # Import for secure SSL connection

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow specific origins
# Replace 'YOUR_NETLIFY_FRONTEND_URL' with the actual URL of your Netlify frontend
# e.g., 'https://your-chef-byte-site.netlify.app'
# It's good practice to list all allowed origins explicitly.
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173", # For local development
    "https://ai-cooking-chatbot-1.netlify.app" # Replace with your actual Netlify frontend URL
    # Add any other frontend URLs if you have them, e.g., custom domains
]}})


# Configure the Gemini API with your key
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    # For now, we'll just print, but in production, you might want to exit or disable AI features.

# Email configuration (NEW)
# Make sure these are set in your .env file
# GMAIL_APP_EMAIL="your-gmail-address@gmail.com"
# GMAIL_APP_PASSWORD="your-16-digit-app-password"
SENDER_EMAIL = os.getenv('GMAIL_APP_EMAIL')
SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
RECEIVER_EMAIL = "aryanmokashi28@gmail.com" # Your email to receive messages

# Initialize Database
db = Database()

SYSTEM_PROMPT = """You are CookBot, a friendly and knowledgeable cooking assistant. Your role is to help users with all things cooking-related.

Guidelines:
1. Always respond in a warm, encouraging, and helpful tone.
2. When a user asks for a recipe, you MUST format your entire response as a single, valid JSON object with this exact structure:
    {
      "type": "recipe",
      "title": "Recipe Name",
      "description": "Brief description",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "prep_time": "X minutes",
      "cook_time": "X minutes",
      "servings": "X servings"
    }
3. For general cooking questions that are NOT recipe requests, respond with plain text in a concise and helpful manner.
4. If a user's request is unclear, ask clarifying questions.
5. Suggest alternatives for ingredients when appropriate.
6. Include helpful cooking tips and techniques.
7. Always encourage users to cook and try new things.

Remember: You're here to make cooking accessible and fun for everyone!"""

generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json"
}

# Model initialized without system_instruction here
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=generation_config
)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not user_message.strip():
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        conversation_data = db.get_conversation(session_id)
        history = []
        if conversation_data and 'history' in conversation_data:
            for message in conversation_data['history']:
                if message['role'] == 'system':
                    continue
                history.append({
                    "role": "model" if message['role'] == 'assistant' else message['role'],
                    "parts": [{"text": message['content']}]
                })

        # system_instruction is passed when starting the chat session
        chat_session = model.start_chat(
            history=history,
            system_instruction=SYSTEM_PROMPT
        )
        
        response = chat_session.send_message(user_message)
        
        ai_response_text = response.text
        
        history.append({"role": "user", "parts": [{"text": user_message}]})
        history.append({"role": "model", "parts": [{"text": ai_response_text}]})
        
        messages_to_save = []
        for message in history:
            messages_to_save.append({
                "role": "assistant" if message['role'] == 'model' else message['role'],
                "content": message['parts'][0]['text']
            })

        db.save_conversation(session_id, messages_to_save)
        
        try:
            recipe_data = json.loads(ai_response_text)
            if isinstance(recipe_data, dict) and recipe_data.get('type') == 'recipe':
                return jsonify({
                    'response': ai_response_text,
                    'session_id': session_id,
                    'is_recipe': True,
                    'recipe_data': recipe_data
                })
            else:
                raise json.JSONDecodeError("Not a recipe", ai_response_text, 0)

        except json.JSONDecodeError:
            return jsonify({
                'response': ai_response_text,
                'session_id': session_id,
                'is_recipe': False
            })
            
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        return jsonify({'error': 'An error occurred processing your request'}), 500

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'All fields are required.'}), 400
        
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            print("Email sender credentials not configured in .env")
            return jsonify({'error': 'Email service not configured.'}), 500

        email_message = f"""\
From: {SENDER_EMAIL}
To: {RECEIVER_EMAIL}
Subject: Chef Byte Contact Form: {name}

Name: {name}
Email: {email}
Message:
{message}
"""
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, email_message)

        return jsonify({'success': True, 'message': 'Message sent successfully!'}), 200

    except Exception as e:
        print(f"Error sending contact email: {e}")
        return jsonify({'error': 'Failed to send message. Please try again later.'}), 500

@app.route('/api/save_recipe', methods=['POST'])
def save_recipe():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        recipe_data = data.get('recipe_data')
        
        if not session_id or not recipe_data:
            return jsonify({'error': 'Missing required data'}), 400
        
        recipe_id = db.save_recipe(session_id, recipe_data)
        
        return jsonify({
            'success': True,
            'recipe_id': str(recipe_id),
            'message': 'Recipe saved successfully!'
        })
        
    except Exception as e:
        print(f"Save recipe error: {str(e)}")
        return jsonify({'error': 'Failed to save recipe'}), 500

@app.route('/api/my_recipes', methods=['GET']) # Corrected this line
def get_my_recipes():
    try:
        session_id = request.args.get('session_id')
        
        if not session_id:
            return jsonify({'error': 'Session ID required'}), 400
        
        recipes = db.get_user_recipes(session_id)
        
        return jsonify({
            'recipes': recipes
        })
        
    except Exception as e:
        print(f"Get recipes error: {str(e)}")
        return jsonify({'error': 'Failed to retrieve recipes'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
