from typing import List, Optional
from uuid import UUID

from fastapi import Depends, Query, status
from fastapi.routing import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import LoggerSetup
from app.db import get_db
from app.dependencies import get_current_user, require_admin
from app.models import StatusEnum
from app.schemas import PropertyCreate, PropertyRead, PropertyUpdate
from app.services import PropertyService


logger = LoggerSetup.setup_logger(__name__)
property_router = APIRouter(
    prefix="/properties",
    tags=["properties"],
    dependencies=[Depends(get_current_user)],
)


def get_property_service(db: AsyncSession = Depends(get_db)) -> PropertyService:
    logger.info("starting property service")
    return PropertyService(db)


@property_router.get("/", response_model=List[PropertyRead])
async def get_properties(
    query: Optional[str] = Query(default=None),
    status_filter: Optional[StatusEnum] = Query(default=None, alias="status"),
    state: Optional[str] = Query(default=None),
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    service: PropertyService = Depends(get_property_service),
):
    logger.info("getting properties")
    has_filters = any(
        value is not None
        for value in [query, status_filter, state, min_price, max_price]
    )
    if has_filters:
        return await service.search(
            query=query,
            status=status_filter,
            state=state,
            min_price=min_price,
            max_price=max_price,
            skip=skip,
            limit=limit,
        )
    return await service.get_all(skip=skip, limit=limit)


@property_router.get("/{property_id}", response_model=PropertyRead)
async def get_property_detail(
    property_id: UUID,
    service: PropertyService = Depends(get_property_service),
):
    logger.info(f"getting property {property_id}")
    return await service.get_or_404(property_id)


@property_router.post(
    "/",
    response_model=PropertyRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_property(
    data: PropertyCreate,
    service: PropertyService = Depends(get_property_service),
):
    logger.info("creating property")
    return await service.create(data)


@property_router.put(
    "/{property_id}",
    response_model=PropertyRead,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_admin)],
)
async def update_property(
    property_id: UUID,
    data: PropertyUpdate,
    service: PropertyService = Depends(get_property_service),
):
    logger.info(f"updating property {property_id}")
    return await service.update(property_id, data)


@property_router.delete(
    "/{property_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_admin)],
)
async def delete_property(
    property_id: UUID,
    service: PropertyService = Depends(get_property_service),
):
    logger.info(f"deleting property {property_id}")
    await service.delete(property_id)
    return {"message": "Property deleted"}
