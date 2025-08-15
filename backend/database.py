from pymongo import MongoClient
from datetime import datetime
import uuid
import os

class Database:
    def __init__(self):
        # Use environment variable or default to local MongoDB
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = MongoClient(mongo_uri)
        self.db = self.client.cooking_chatbot
        self.conversations = self.db.conversations
        self.recipes = self.db.recipes
        
    def save_conversation(self, session_id, messages):
        """Save or update a conversation"""
        try:
            self.conversations.update_one(
                {'session_id': session_id},
                {
                    '$set': {
                        'history': messages,
                        'updated_at': datetime.now()
                    },
                    '$setOnInsert': {
                        'session_id': session_id,
                        'created_at': datetime.now()
                    }
                },
                upsert=True
            )
            return True
        except Exception as e:
            print(f"Error saving conversation: {str(e)}")
            return False
    
    def get_conversation(self, session_id):
        """Get conversation history"""
        try:
            return self.conversations.find_one({'session_id': session_id})
        except Exception as e:
            print(f"Error getting conversation: {str(e)}")
            return None
    
    def save_recipe(self, session_id, recipe_data):
        """Save a recipe for a user session"""
        try:
            recipe_id = str(uuid.uuid4())
            recipe_doc = {
                'recipe_id': recipe_id,
                'session_id': session_id,
                'recipe_data': recipe_data,
                'saved_at': datetime.now()
            }
            
            self.recipes.insert_one(recipe_doc)
            return recipe_id
        except Exception as e:
            print(f"Error saving recipe: {str(e)}")
            return None
    
    def get_user_recipes(self, session_id):
        """Get all saved recipes for a user session"""
        try:
            cursor = self.recipes.find(
                {'session_id': session_id},
                {'_id': 0}  # Exclude MongoDB's _id field
            ).sort('saved_at', -1)
            
            return list(cursor)
        except Exception as e:
            print(f"Error getting recipes: {str(e)}")
            return []