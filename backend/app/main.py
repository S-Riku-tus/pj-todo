from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # フロントエンドのURLを指定する（本番環境では制限する）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to Todo App API"}