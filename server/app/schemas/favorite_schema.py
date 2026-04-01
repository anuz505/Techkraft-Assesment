from pydantic import BaseModel, ConfigDict
from datetime import datetime
import uuid

from app.schemas.property_schema import PropertyRead
from app.schemas.user_schema import UserResponse


class FavoriteCreate(BaseModel):
    property_id: uuid.UUID


class FavoriteRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FavoriteWithRelations(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    property_id: uuid.UUID
    user: UserResponse
    property: PropertyRead
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
