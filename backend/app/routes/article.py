from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from schemas.article import ArticleCreate, ArticleUpdate, ArticleInDB
from config.database import article_collection
from datetime import datetime

router = APIRouter()

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