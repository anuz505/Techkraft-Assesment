from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.models import Property, StatusEnum
from app.schemas.property_schema import (
    PropertyCreate,
    PropertyRead,
    PropertyUpdate,
)


class PropertyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> List[PropertyRead]:
        result = await self.db.execute(
            select(Property).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, property_id: UUID) -> Optional[PropertyRead]:
        result = await self.db.execute(
            select(Property).where(Property.id == property_id)
        )
        return result.scalar_one_or_none()

    async def create(self, data: PropertyCreate) -> PropertyRead:
        property_obj = Property(**data.model_dump())
        self.db.add(property_obj)
        await self.db.commit()
        await self.db.refresh(property_obj)
        return property_obj

    async def update(
        self, property_id: UUID, data: PropertyUpdate
    ) -> Optional[PropertyRead]:
        property_obj = await self.get_by_id(property_id)
        if not property_obj:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(property_obj, field, value)

        await self.db.commit()
        await self.db.refresh(property_obj)
        return property_obj

    async def delete(self, property_id: UUID) -> bool:
        property_obj = await self.get_by_id(property_id)
        if not property_obj:
            return False

        await self.db.delete(property_obj)
        await self.db.commit()
        return True

    async def get_by_status(
        self, status: StatusEnum, skip: int = 0, limit: int = 100
    ) -> List[PropertyRead]:
        result = await self.db.execute(
            select(Property)
            .where(Property.status == status)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_state(
        self, state: str, skip: int = 0, limit: int = 100
    ) -> List[PropertyRead]:
        result = await self.db.execute(
            select(Property)
            .where(Property.state == state)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

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
        filters = []

        if query:
            filters.append(
                or_(
                    Property.title.ilike(f"%{query}%"),
                    Property.address.ilike(f"%{query}%"),
                    Property.description.ilike(f"%{query}%"),
                )
            )
        if status:
            filters.append(Property.status == status)
        if state:
            filters.append(Property.state == state)
        if min_price is not None:
            filters.append(Property.price >= min_price)
        if max_price is not None:
            filters.append(Property.price <= max_price)

        query_stmt = select(Property)
        if filters:
            query_stmt = query_stmt.where(and_(*filters))

        result = await self.db.execute(
            query_stmt.offset(skip).limit(limit)
        )
        return result.scalars().all()
