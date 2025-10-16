import google.generativeai as genai
from app.core.config import settings

# Configure the SDK
genai.configure(api_key=settings.GOOGLE_API_KEY)

class MultiModalAnalysisTool:
    def __init__(self):
        # Using a model that supports text-only for now for simplicity
        # Later, we can switch to a multi-modal model like 'gemini-1.5-pro-latest'
        self.model = genai.GenerativeModel('gemini-1.5-flash-latest')

    async def analyze_text(self, text: str) -> dict:
        """
        Analyzes a piece of text to extract cultural significance.
        """
        prompt = f"""
        You are a digital anthropologist. Analyze the following text fragment from an old internet source.
        Provide a brief analysis of its potential cultural context, slang, and significance.
        Return the analysis as a JSON object with 'slang_definitions' and 'cultural_context' keys.

        TEXT FRAGMENT:
        "{text}"

        JSON ANALYSIS:
        """
        try:
            # The new async method is generate_content_async
            response = await self.model.generate_content_async(prompt)
            # Assuming the model returns a JSON string in its text response
            # A more robust solution would parse the markdown JSON block
            import json
            analysis_json = json.loads(response.text.strip())
            return analysis_json
        except Exception as e:
            print(f"Error analyzing text with Gemini: {e}")
            return {
                "slang_definitions": {},
                "cultural_context": f"Failed to analyze text due to an error: {e}"
            }