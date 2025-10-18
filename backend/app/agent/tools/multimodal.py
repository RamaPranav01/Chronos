import google.generativeai as genai
from app.core.config import settings
import json
import re
import logging

# Configure the SDK
genai.configure(api_key=settings.GOOGLE_API_KEY)

class MultiModalAnalysisTool:
    def __init__(self):
        # We are using the stable gemini-1.0-pro model
        self.model = genai.GenerativeModel('gemini-2.5-pro')

    async def analyze_text(self, text: str) -> dict:
        """
        Analyzes a piece of text to extract cultural significance.
        Now with improved prompting and robust JSON parsing.
        """
        prompt = f"""
        You are a helpful digital anthropologist. Analyze the following text fragment from an old internet source.
        Your main goal is to extract slang terms and provide cultural context.
        If no specific slang is present, focus on the cultural context.
        
        IMPORTANT: Your response MUST be a single, valid JSON object wrapped in a markdown code block.

        Example response format:
        ```json
        {{
          "slang_definitions": {{
            "IRC": "Internet Relay Chat, an early text-based chat system."
          }},
          "cultural_context": "This text describes a foundational technology for online communities before the rise of modern social media."
        }}
        ```

        TEXT FRAGMENT TO ANALYZE:
        "{text}"

        YOUR JSON RESPONSE:
        """
        try:
            # We add safety settings to be less restrictive, which can help prevent blocked responses
            response = await self.model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    candidate_count=1,
                    # You can adjust temperature for more/less creative responses
                    temperature=0.7 
                ),
                safety_settings={
                    'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
                    'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
                    'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
                    'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
                }
            )

            # --- THIS IS THE MOST IMPORTANT PART: ROBUST PARSING AND DEBUGGING ---
            
            # Print the raw response so we can see EXACTLY what Google sent
            print("--- DEBUG: RAW GEMINI RESPONSE ---")
            print(response.text)
            print("---------------------------------")
            
            # Use regex to find the JSON block, even if the AI adds extra text
            match = re.search(r"```json\n(.*)\n```", response.text, re.DOTALL)
            if match:
                json_str = match.group(1)
                analysis_json = json.loads(json_str)
                return analysis_json
            else:
                # If no JSON block is found, return an error
                return {"error": "Failed to parse JSON from the AI's response."}

        except Exception as e:
            logging.error(f"Error analyzing text with Gemini: {e}")
            # Also log the raw response on error
            try:
                print(f"--- DEBUG: RAW GEMINI RESPONSE ON ERROR ---\n{response.text}\n---------------------------------")
            except:
                pass
            return {
                "error": f"An exception occurred during analysis: {e}"
            }