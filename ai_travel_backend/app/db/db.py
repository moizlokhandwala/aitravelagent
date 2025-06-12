# app/db.py
import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from dotenv import load_dotenv
from sqlalchemy.engine.url import make_url
load_dotenv()  # Load .env

DATABASE_URL = os.getenv("DATABASE_URL")

#engine = create_async_engine(DATABASE_URL, echo=True, future=True)

url = make_url(DATABASE_URL)
engine = create_async_engine(
    url,
    connect_args={"ssl": "require"},
    echo=True,
    future=True
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
