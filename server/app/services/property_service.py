from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories import PropertyRepository
from app.models import StatusEnum
from app.schemas import (
    PropertyCreate,
    PropertyRead,
    PropertyUpdate,
)


class PropertyService:
    def __init__(self, db: AsyncSession):
        self.repo = PropertyRepository(db)

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> List[PropertyRead]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_or_404(self, property_id: UUID) -> PropertyRead:
        property_obj = await self.repo.get_by_id(property_id)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Property not found: {property_id}",
            )
        return property_obj

    async def create(self, data: PropertyCreate) -> PropertyRead:
        return await self.repo.create(data)

    async def update(
        self, property_id: UUID, data: PropertyUpdate
    ) -> PropertyRead:
        await self.get_or_404(property_id)
        return await self.repo.update(property_id, data)

    async def delete(self, property_id: UUID):
        await self.get_or_404(property_id)
        return await self.repo.delete(property_id)

    async def get_by_status(
        self,
        status: StatusEnum,
        skip: int = 0,
        limit: int = 100,
    ) -> List[PropertyRead]:
        return await self.repo.get_by_status(status, skip=skip, limit=limit)

    async def get_by_state(
        self, state: str, skip: int = 0, limit: int = 100
    ) -> List[PropertyRead]:
        return await self.repo.get_by_state(state, skip=skip, limit=limit)

    async def search(
        self,
        query: Optional[str] = None,
        status: Optional[StatusEnum] = None,
        state: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[PropertyRead]:
        return await self.repo.search(
            query=query,
            status=status,
            state=state,
            min_price=min_price,
            max_price=max_price,
            skip=skip,
            limit=limit,
        )
