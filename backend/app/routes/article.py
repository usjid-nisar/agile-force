from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from bson import ObjectId
from schemas.article import ArticleCreate, ArticleUpdate, ArticleInDB
from config.database import article_collection
from datetime import datetime
from utils.openai_client import generate_summary
from utils.pinecone_client import store_embedding, search_similar

router = APIRouter()

@router.get("/search", response_model=List[ArticleInDB])
async def search_articles(
    query: str = Query(..., description="Search query"),
    limit: int = Query(5, description="Number of results to return")
):
    try:
        # Search for similar articles
        similar_docs = await search_similar(query, limit)
        
        # Get full article details for the matches
        article_ids = [ObjectId(match.id) for match in similar_docs]
        articles = await article_collection.find(
            {"_id": {"$in": article_ids}}
        ).to_list(None)
        
        # Sort articles to match the order of search results
        id_to_article = {str(art["_id"]): art for art in articles}
        sorted_articles = [
            {**id_to_article[match.id], "_id": match.id}
            for match in similar_docs
            if match.id in id_to_article
        ]
        
        return sorted_articles
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ArticleInDB])
async def get_articles():
    articles = await article_collection.find().to_list(1000)
    return [{**article, "_id": str(article["_id"])} for article in articles]

@router.get("/{article_id}", response_model=ArticleInDB)
async def get_article(article_id: str):
    try:
        if article := await article_collection.find_one({"_id": ObjectId(article_id)}):
            return {**article, "_id": str(article["_id"])}
        raise HTTPException(status_code=404, detail="Article not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid article ID")

@router.post("/", response_model=ArticleInDB, status_code=status.HTTP_201_CREATED)
async def create_article(article: ArticleCreate):
    new_article = article.model_dump()
    # Ensure required fields have at least empty string values
    new_article["description"] = new_article.get("description", "")
    new_article["summary"] = new_article.get("summary", "")
    new_article["created_at"] = datetime.utcnow()
    new_article["updated_at"] = datetime.utcnow()
    
    result = await article_collection.insert_one(new_article)
    created_article = await article_collection.find_one({"_id": result.inserted_id})
    return {**created_article, "_id": str(created_article["_id"])}

@router.put("/{article_id}", response_model=ArticleInDB)
async def update_article(article_id: str, article_update: ArticleUpdate):
    try:
        update_data = {
            k: v for k, v in article_update.model_dump(exclude_unset=True).items() if v is not None
        }
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid update data provided")

        update_data["updated_at"] = datetime.utcnow()
        
        if result := await article_collection.find_one_and_update(
            {"_id": ObjectId(article_id)},
            {"$set": update_data},
            return_document=True
        ):
            return {**result, "_id": str(result["_id"])}
        raise HTTPException(status_code=404, detail="Article not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid article ID")

@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(article_id: str):
    try:
        if result := await article_collection.delete_one({"_id": ObjectId(article_id)}):
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Article not found")
            return
        raise HTTPException(status_code=404, detail="Article not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid article ID")

@router.post("/{id}/summarize", response_model=dict)
async def summarize_article(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid article ID")
            
        article = await article_collection.find_one({"_id": ObjectId(id)})
        if article:
            summary = await generate_summary(article["content"])
            
            # Update the article with the new summary
            await article_collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": {"summary": summary}}
            )
            
            return {"summary": summary}
            
        raise HTTPException(status_code=404, detail="Article not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{id}/embed", response_model=dict)
async def create_article_embedding(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid article ID")
            
        article = await article_collection.find_one({"_id": ObjectId(id)})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Create metadata for the embedding
        metadata = {
            "title": article["title"],
            "description": article["description"],
            "summary": article["summary"]
        }
        
        # Store the embedding
        await store_embedding(
            id=str(article["_id"]),
            text=article["content"],
            metadata=metadata
        )
        
        return {"message": "Embedding created successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 