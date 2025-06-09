from app.db.db import engine
from app.db.models import Base
import asyncio

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Entry point
if __name__ == "__main__":
    asyncio.run(init_db())
