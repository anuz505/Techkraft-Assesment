from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models import Favorite
from app.schemas.favorite_schema import FavoriteCreate, FavoriteRead


class FavoriteRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        result = await self.db.execute(
            select(Favorite).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, favorite_id: UUID) -> Optional[FavoriteRead]:
        result = await self.db.execute(
            select(Favorite).where(Favorite.id == favorite_id)
        )
        return result.scalar_one_or_none()

    async def get_user_favorites(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        result = await self.db.execute(
            select(Favorite)
            .where(Favorite.user_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_property_favorites(
        self, property_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        result = await self.db.execute(
            select(Favorite)
            .where(Favorite.property_id == property_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create(
        self, user_id: UUID, data: FavoriteCreate
    ) -> FavoriteRead:
        favorite = Favorite(user_id=user_id, property_id=data.property_id)
        self.db.add(favorite)
        await self.db.commit()
        await self.db.refresh(favorite)
        return favorite

    async def delete(self, favorite_id: UUID) -> bool:
        favorite = await self.get_by_id(favorite_id)
        if not favorite:
            return False

        await self.db.delete(favorite)
        await self.db.commit()
        return True

    async def is_favorited(
        self, user_id: UUID, property_id: UUID
    ) -> bool:
        result = await self.db.execute(
            select(Favorite).where(
                and_(
                    Favorite.user_id == user_id,
                    Favorite.property_id == property_id,
                )
            )
        )
        return result.scalar_one_or_none() is not None

    async def delete_by_user_property(
        self, user_id: UUID, property_id: UUID
    ) -> bool:
        result = await self.db.execute(
            select(Favorite).where(
                and_(
                    Favorite.user_id == user_id,
                    Favorite.property_id == property_id,
                )
            )
        )
        favorite = result.scalar_one_or_none()
        if not favorite:
            return False

        await self.db.delete(favorite)
        await self.db.commit()
        return True
