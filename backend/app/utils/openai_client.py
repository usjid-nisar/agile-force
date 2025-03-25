from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize AsyncOpenAI client with dummy key (replace with real key in .env)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy_key_replace_me"))

async def generate_summary(content: str) -> str:
    try:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that generates concise summaries of articles. Do not tell the user that you are an AI assistant. Write the summary in a way that is easy to understand and in a way that is not too long. Handle i do not know or i cannot answer situations gracefully."
                },
                {
                    "role": "user",
                    "content": f"Please provide a brief summary of the following article:\n\n{content}"
                }
            ],
            max_tokens=150
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error generating summary: {str(e)}") 