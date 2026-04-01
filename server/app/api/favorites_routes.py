from typing import List
from uuid import UUID

from fastapi import Depends, HTTPException, Query, status
from fastapi.routing import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import LoggerSetup
from app.db import get_db
from app.dependencies import get_current_user
from app.schemas import FavoriteCreate, FavoriteRead
from app.services import AuthService, FavoriteService


logger = LoggerSetup.setup_logger(__name__)
favorites_router = APIRouter(
    prefix="/favorites",
    tags=["favorites"],
    dependencies=[Depends(get_current_user)],
)


def get_favorite_service(db: AsyncSession = Depends(get_db)) -> FavoriteService:
    logger.info("starting favorite service")
    return FavoriteService(db)


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    logger.info("starting auth service")
    return AuthService(db)


async def get_current_user_id(
    current_user: dict,
    auth_service: AuthService,
) -> UUID:
    username = current_user.get("sub")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = await auth_service.get_user_by_username(username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user.id


@favorites_router.get("/", response_model=List[FavoriteRead])
async def get_my_favorites(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
    service: FavoriteService = Depends(get_favorite_service),
):
    logger.info("getting current user's favorites")
    user_id = await get_current_user_id(current_user, auth_service)
    return await service.get_user_favorites(user_id=user_id, skip=skip, limit=limit)


@favorites_router.post(
    "/",
    response_model=FavoriteRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_favorite(
    data: FavoriteCreate,
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
    service: FavoriteService = Depends(get_favorite_service),
):
    logger.info("creating favorite")
    user_id = await get_current_user_id(current_user, auth_service)
    return await service.create(user_id=user_id, data=data)


@favorites_router.get("/check/{property_id}")
async def check_favorite(
    property_id: UUID,
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
    service: FavoriteService = Depends(get_favorite_service),
):
    logger.info(f"checking favorite for property {property_id}")
    user_id = await get_current_user_id(current_user, auth_service)
    is_favorited = await service.is_favorited(user_id=user_id, property_id=property_id)
    return {"is_favorited": is_favorited}


@favorites_router.delete("/{favorite_id}", status_code=status.HTTP_200_OK)
async def delete_favorite(
    favorite_id: UUID,
    service: FavoriteService = Depends(get_favorite_service),
):
    logger.info(f"deleting favorite {favorite_id}")
    await service.delete(favorite_id)
    return {"message": "Favorite deleted"}


@favorites_router.delete("/property/{property_id}", status_code=status.HTTP_200_OK)
async def delete_favorite_by_property(
    property_id: UUID,
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
    service: FavoriteService = Depends(get_favorite_service),
):
    logger.info(f"deleting favorite for property {property_id}")
    user_id = await get_current_user_id(current_user, auth_service)
    await service.delete_by_user_property(user_id=user_id, property_id=property_id)
    return {"message": "Favorite deleted"}
