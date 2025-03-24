from fastapi import FastAPI
from routes import article
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Article Management System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(article.router, prefix="/articles", tags=["articles"])

@app.get("/")
async def root():
    return {"message": "Welcome to Article Management System API"} 