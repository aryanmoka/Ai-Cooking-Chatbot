from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import uuid
from datetime import datetime
# Assuming 'database' module exists and contains a 'Database' class
from database import Database 
import smtplib
import ssl
import logging # Import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

app = Flask(__name__)

# Configure CORS to allow specific origins
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173", # For local development
    "https://cookingchatbot.netlify.app" 
]}})

# --- Configuration ---
# Load API key and other sensitive info from environment variables
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
SENDER_EMAIL = os.getenv('GMAIL_APP_EMAIL')
SENDER_PASSWORD = os.getenv('GMAIL_APP_PASSWORD')
RECEIVER_EMAIL = os.getenv('GMAIL_APP_EMAIL') # Make receiver email configurable too

# Validate essential environment variables
if not GEMINI_API_KEY:
    logging.error("GEMINI_API_KEY is not set in environment variables.")
    # In a real app, you might want to exit or raise an error
if not SENDER_EMAIL or not SENDER_PASSWORD:
    logging.warning("GMAIL_APP_EMAIL or GMAIL_APP_PASSWORD not set. Email functionality might be disabled.")

# Configure the Gemini API with your key
try:
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    logging.critical(f"Error configuring Gemini API: {e}. Exiting.", exc_info=True)
    # In production, you might want to exit or raise a more specific error
    exit(1) # Exit if API is critical for app function

db = Database() # Initialize your database connection

# UPDATED SYSTEM_PROMPT to ensure consistent JSON output for all responses
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
3. For general cooking questions that are NOT recipe requests, respond with a plain text message wrapped in a JSON object with this exact structure:
    {
      "type": "text",
      "content": "Your plain text response here."
    }
4. If a user's request is unclear, ask clarifying questions using the "text" JSON format.
5. Suggest alternatives for ingredients when appropriate using the "text" JSON format.
6. Include helpful cooking tips and techniques using the "text" JSON format.
7. Always encourage users to cook and try new things.

Remember: You're here to make cooking accessible and fun for everyone!"""

# UPDATED generation_config: Ensure response_mime_type is "application/json"
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json" 
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-latest",
    generation_config=generation_config
)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip() # Strip whitespace
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not user_message: # Check after stripping
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        conversation_data = db.get_conversation(session_id)
        history = []
        if conversation_data and 'history' in conversation_data:
            # Map saved history (assistant, user) to Gemini roles (model, user)
            for message in conversation_data['history']:
                if message['role'] == 'system':
                    continue # System prompt is handled separately
                history.append({
                    "role": "model" if message['role'] == 'assistant' else message['role'],
                    "parts": [{"text": message['content']}]
                })

        # Prepend the system prompt to the history for each session interaction
        # This ensures the model always has the system prompt in context
        full_history_for_gemini = [{"role": "user", "parts": [{"text": SYSTEM_PROMPT}]}] + history

        chat_session = model.start_chat(history=full_history_for_gemini)
        
        response = chat_session.send_message(user_message)
        
        ai_response_text = response.text
        
        # Now, ai_response_text should ALWAYS be a valid JSON string
        try:
            parsed_response = json.loads(ai_response_text)
            
            # Append current turn to history for saving
            messages_to_save = []
            # No need to append SYSTEM_PROMPT here as it's part of the conversation setup
            messages_to_save.extend([
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": ai_response_text} # Save the raw JSON string
            ])
            
            # Prepend existing history from DB to the new messages to save
            if conversation_data and 'history' in conversation_data:
                messages_to_save = conversation_data['history'] + messages_to_save

            db.save_conversation(session_id, messages_to_save)
            
            # Check the 'type' field to determine if it's a recipe or general text
            if isinstance(parsed_response, dict) and parsed_response.get('type') == 'recipe':
                return jsonify({
                    'response': ai_response_text, # Still return the raw JSON string
                    'session_id': session_id,
                    'is_recipe': True,
                    'recipe_data': parsed_response # Return the parsed object directly
                })
            elif isinstance(parsed_response, dict) and parsed_response.get('type') == 'text':
                return jsonify({
                    'response': parsed_response.get('content', 'An unexpected text response occurred.'), # Extract the content
                    'session_id': session_id,
                    'is_recipe': False
                })
            else:
                # Fallback if the JSON structure doesn't match expected types
                logging.warning(f"Unexpected JSON format from AI: {ai_response_text}")
                return jsonify({
                    'response': "I received an unexpected response format, but I'm here to help! Could you please rephrase your request?",
                    'session_id': session_id,
                    'is_recipe': False
                })

        except json.JSONDecodeError:
            # This block should ideally not be hit if response_mime_type is 'application/json'
            # and the model consistently outputs valid JSON based on the system prompt.
            logging.error(f"AI response was not valid JSON despite mime type setting: {ai_response_text}")
            return jsonify({
                'response': "I'm having a little trouble understanding. Could you please try asking again?",
                'session_id': session_id,
                'is_recipe': False
            })
            
    except Exception as e:
        logging.error(f"Chat endpoint error: {e}", exc_info=True)
        return jsonify({'error': 'An internal server error occurred processing your request. Please try again later.'}), 500

@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'error': 'All fields are required.'}), 400
        
        if not SENDER_EMAIL or not SENDER_PASSWORD:
            logging.warning("Email sender credentials not configured. Contact form emails cannot be sent.")
            return jsonify({'error': 'Email service not configured on the server.'}), 500

        email_content = f"""\
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
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, email_content)
        
        logging.info(f"Contact form email sent from {email} by {name}")
        return jsonify({'success': True, 'message': 'Message sent successfully! We will get back to you soon.'}), 200

    except Exception as e:
        logging.error(f"Error sending contact email: {e}", exc_info=True)
        return jsonify({'error': 'Failed to send message. Please try again later.'}), 500

@app.route('/api/save_recipe', methods=['POST'])
def save_recipe():
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        recipe_data = data.get('recipe_data')
        
        if not session_id or not recipe_data:
            return jsonify({'error': 'Missing required session_id or recipe_data'}), 400
        
        recipe_id = db.save_recipe(session_id, recipe_data)
        
        logging.info(f"Recipe saved for session {session_id} with ID: {recipe_id}")
        return jsonify({
            'success': True,
            'recipe_id': str(recipe_id),
            'message': 'Recipe saved successfully!'
        }), 200
        
    except Exception as e:
        logging.error(f"Save recipe error for session {session_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to save recipe'}), 500

@app.route('/api/my_recipes', methods=['GET'])
def get_my_recipes():
    try:
        session_id = request.args.get('session_id')
        
        if not session_id:
            return jsonify({'error': 'Session ID required to retrieve recipes'}), 400
        
        recipes = db.get_user_recipes(session_id)
        
        logging.info(f"Retrieved {len(recipes)} recipes for session {session_id}")
        return jsonify({
            'recipes': recipes
        }), 200
        
    except Exception as e:
        logging.error(f"Get recipes error for session {session_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to retrieve recipes'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    # Simple health check, can be extended to check DB connection etc.
    try:
        # Example: Try to get a dummy value from DB to check connection
        # db.check_connection() # Assuming such a method exists in Database class
        return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200
    except Exception as e:
        logging.error(f"Health check failed: {e}", exc_info=True)
        return jsonify({'status': 'unhealthy', 'error': str(e), 'timestamp': datetime.now().isoformat()}), 500


if __name__ == '__main__':
    # Use environment variable for port, default to 5000
    port = int(os.environ.get('PORT', 5000))
    # NEVER use debug=True in production
    app.run(host='0.0.0.0', port=port, debug=False) 
    # For production, use a WSGI server like Gunicorn:
    # gunicorn -w 4 -b 0.0.0.0:5000 app:app 
