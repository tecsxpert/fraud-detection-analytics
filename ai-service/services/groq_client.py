import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile"

    def generate(self, prompt, temperature=0.5, max_retries=3):
        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    temperature=temperature
                )

                return response.choices[0].message.content

            except Exception as e:
                print(f"⚠️ Attempt {attempt+1} failed:", str(e))

                if attempt == max_retries - 1:
                    return "Error: Unable to generate response"

                time.sleep(2)  # backoff