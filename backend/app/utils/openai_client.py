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
                      "content": "You are a summary generator. Your task is to create short, clear, and easy-to-understand summaries of articles, focusing only on the most important points. Always generate a summary, even if the article is unclear or lacks detail—use your best judgment to infer a brief, general summary. Keep the tone neutral and informative. Do not mention that you are an AI or that you're generating a summary."
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