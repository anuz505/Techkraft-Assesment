from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories import FavoriteRepository
from app.schemas import (
    FavoriteCreate,
    FavoriteRead,
)


class FavoriteService:
    def __init__(self, db: AsyncSession):
        self.repo = FavoriteRepository(db)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_or_404(self, favorite_id: UUID) -> FavoriteRead:
        favorite = await self.repo.get_by_id(favorite_id)
        if not favorite:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Favorite not found: {favorite_id}",
            )
        return favorite

    async def get_user_favorites(
        self, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        return await self.repo.get_user_favorites(
            user_id, skip=skip, limit=limit
        )

    async def get_property_favorites(
        self, property_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[FavoriteRead]:
        return await self.repo.get_property_favorites(
            property_id, skip=skip, limit=limit
        )

    async def create(
        self, user_id: UUID, data: FavoriteCreate
    ) -> FavoriteRead:
        is_favorited = await self.repo.is_favorited(
            user_id, data.property_id
        )
        if is_favorited:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Property already favorited by this user",
            )
        return await self.repo.create(user_id, data)

    async def delete(self, favorite_id: UUID) -> bool:
        await self.get_or_404(favorite_id)
        return await self.repo.delete(favorite_id)

    async def delete_by_user_property(
        self, user_id: UUID, property_id: UUID
    ) -> bool:
        deleted = await self.repo.delete_by_user_property(user_id, property_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Favorite not found",
            )
        return deleted

    async def is_favorited(self, user_id: UUID, property_id: UUID) -> bool:
        return await self.repo.is_favorited(user_id, property_id)
