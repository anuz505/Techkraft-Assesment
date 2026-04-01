from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Annotated, Optional
import uuid

from app.models import StatusEnum


class PropertyCreate(BaseModel):
    title: Annotated[str, Field(max_length=255)]
    address: Annotated[str, Field(max_length=255)]
    state: Annotated[str, Field(max_length=255)]
    price: Annotated[Decimal, Field(gt=0)]
    bedrooms: Annotated[int, Field(ge=0)] = 0
    bathrooms: Annotated[int, Field(gt=0)]
    image_url: Annotated[Optional[str], Field(max_length=255)] = None
    description: Annotated[Optional[str], Field(max_length=255)] = None
    status: Annotated[StatusEnum, Field(
        description="Status of the property"
    )] = StatusEnum.available


class PropertyUpdate(BaseModel):
    title: Annotated[Optional[str], Field(max_length=255)] = None
    address: Annotated[Optional[str], Field(max_length=255)] = None
    state: Annotated[Optional[str], Field(max_length=255)] = None
    price: Annotated[Optional[Decimal], Field(gt=0)] = None
    bedrooms: Annotated[Optional[int], Field(ge=0)] = None
    bathrooms: Annotated[Optional[int], Field(gt=0)] = None
    image_url: Annotated[Optional[str], Field(max_length=255)] = None
    description: Annotated[Optional[str], Field(max_length=255)] = None
    status: Annotated[Optional[StatusEnum],
                      Field(description="Status of the property")] = None


class PropertyRead(BaseModel):
    id: uuid.UUID
    title: str
    address: str
    state: str
    price: Decimal
    bedrooms: int
    bathrooms: int
    image_url: Optional[str]
    description: Optional[str]
    status: StatusEnum
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
