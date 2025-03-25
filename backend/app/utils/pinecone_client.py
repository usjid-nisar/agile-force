from pinecone import Pinecone, ServerlessSpec
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
import numpy as np

load_dotenv()

# Initialize clients
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY", "dummy_key_replace_me"))
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy_key_replace_me"))

INDEX_NAME = "articles"

try:
    # Create index if it doesn't exist
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,  # OpenAI ada-002 embedding dimension
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
except Exception as e:
    print(f"Error initializing Pinecone index: {e}")

index = pc.Index(INDEX_NAME)

async def generate_embedding(text: str) -> list[float]:
    """Generate embedding using OpenAI's API"""
    try:
        response = await openai_client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        raise Exception(f"Error generating embedding: {str(e)}")

async def store_embedding(id: str, text: str, metadata: dict) -> bool:
    """Store embedding in Pinecone"""
    try:
        embedding = await generate_embedding(text)
        index.upsert(vectors=[{
            "id": id,
            "values": embedding,
            "metadata": metadata
        }])
        return True
    except Exception as e:
        raise Exception(f"Error storing embedding: {str(e)}")

async def search_similar(query: str, top_k: int = 5) -> list:
    """Search for similar articles using the query"""
    try:
        query_embedding = await generate_embedding(query)
        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        return results.matches
    except Exception as e:
        raise Exception(f"Error searching similar articles: {str(e)}") 