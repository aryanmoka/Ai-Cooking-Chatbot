    import axios from 'axios';

    // UPDATED: Pointing to your new deployed Render backend URL
    const API_BASE_URL = import.meta.env.BACKEND_URI; // <--- UPDATE THIS LINE
  // const API_BASE_URL = "http://127.0.0.1:5000/api"

    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    export interface ChatResponse {
      response: string;
      session_id: string;
      is_recipe: boolean;
      recipe_data?: any;
    }

    export interface SaveRecipeResponse {
      success: boolean;
      recipe_id: string;
      message: string;
    }

    export interface Recipe {
      recipe_id: string;
      session_id: string;
      recipe_data: any;
      saved_at: string;
    }

    export interface RecipesResponse {
      recipes: Recipe[];
    }

    // NEW: Interface for contact form data
    export interface ContactFormData {
      name: string;
      email: string;
      message: string;
    }

    // NEW: Interface for contact form response
    export interface ContactFormResponse {
      success: boolean;
      message: string;
    }

    export const chatAPI = {
      async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
        try {
          const response = await api.post('/chat', {
            message,
            session_id: sessionId,
          });
          return response.data;
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          }
          throw new Error('Failed to send message. Please check your connection and try again.');
        }
      },

      async saveRecipe(sessionId: string, recipeData: any): Promise<SaveRecipeResponse> {
        try {
          const response = await api.post('/save_recipe', {
            session_id: sessionId,
            recipe_data: recipeData,
          });
          return response.data;
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          }
          throw new Error('Failed to save recipe. Please try again.');
        }
      },

      async getMyRecipes(sessionId: string): Promise<RecipesResponse> {
        try {
          const response = await api.get('/my_recipes', {
            params: { session_id: sessionId },
          });
          return response.data;
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          }
          throw new Error('Failed to load recipes. Please try again.');
        }
      },

      // NEW: Function to send contact form message
      async sendContactMessage(formData: ContactFormData): Promise<ContactFormResponse> {
        try {
          const response = await api.post('/contact', formData);
          return response.data;
        } catch (error: any) {
          if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
          }
          throw new Error('Failed to send message. Please check your connection and try again.');
        }
      },

      async healthCheck(): Promise<any> {
        try {
          const response = await api.get('/health');
          return response.data;
        } catch (error) {
          throw new Error('Backend server is not responding.');
        }
      },
    };
    