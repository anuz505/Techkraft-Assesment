from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID as PythonUUID, uuid4
from typing import Optional, TYPE_CHECKING
from .db_models import Base
from sqlalchemy import (
    CheckConstraint,
    Index,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Numeric,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship


if TYPE_CHECKING:
    from app.models.auth_model import User


class StatusEnum(str, Enum):
    available = "available"
    sold = "sold"


class Property(Base):
    __tablename__ = "properties"
    id: Mapped[PythonUUID] = mapped_column(
        SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    state: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bathrooms: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    description: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    status: Mapped[StatusEnum] = mapped_column(
        SQLAlchemyEnum(StatusEnum, name="property_status_enum"),
        default=StatusEnum.available,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, nullable=False, onupdate=datetime.now
    )

    favorited_by: Mapped[list["Favorite"]] = relationship(
        "Favorite", back_populates="property"
    )
    __table_args__ = (
        CheckConstraint(
            "price >= 0", name="ck_properties_price_positive"
        ),
        CheckConstraint(
            "bedrooms >= 0", name="ck_properties_bedrooms_positive"
        ),
        CheckConstraint(
            "bathrooms >= 0", name="ck_properties_bathrooms_positive"
        ),
        Index("ix_properties_status", "status"),
        Index("ix_properties_state", "state"),
    )


class Favorite(Base):
    __tablename__ = "favourites"
    id: Mapped[PythonUUID] = mapped_column(
        SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    user_id: Mapped[PythonUUID] = mapped_column(
        SQLAlchemyUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    property_id: Mapped[PythonUUID] = mapped_column(
        SQLAlchemyUUID(as_uuid=True),
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now, nullable=False, onupdate=datetime.now
    )

    user: Mapped["User"] = relationship("User", back_populates="favorites")
    property: Mapped["Property"] = relationship(
        "Property", back_populates="favorited_by"
    )

    __table_args__ = (
        # user cannot fav same property twice hai
        UniqueConstraint(
            "user_id", "property_id", name="uq_favourites_user_property"
        ),
        Index("ix_favourites_user_id", "user_id"),
        Index("ix_favourites_property_id", "property_id"),
    )
