# Techkraft Assessment - Backend API

FastAPI backend for the Techkraft assessment with JWT-based auth, role-based access control, property listing management, and favorites management.

## Features

- FastAPI with async startup lifecycle
- Async SQLAlchemy (2.x) + PostgreSQL (`asyncpg`)
- JWT access/refresh token flow
- HTTP-only cookie support for tokens
- Role-based authorization (`admin` / `user`)
- Property module with filtering and search
- Favorites module for logged-in users
- Layered structure: API -> Service -> Repository -> Model

## Tech Stack

- Python 3.11+
- FastAPI
- SQLAlchemy Async
- PostgreSQL
- Pydantic Settings

## Project Structure

```text
server/
	main.py
	requirements.txt
	pyproject.toml
	alembic.ini
	app/
		api/
			auth_routes.py
			property_routes.py
			favorites_routes.py
		core/
			config.py
			logger.py
		db/
			database.py
			session.py
		dependencies/
			auth_dependency.py
		models/
			auth_model.py
			property_models.py
			db_models.py
		repositories/
			auth_repo.py
			property_repo.py
			favorites_repo.py
		schemas/
			user_schema.py
			property_schema.py
			favorite_schema.py
			token_schema.py
			healthcheck.py
		services/
			auth_service.py
			property_service.py
			favorite_service.py
```

## Setup

From the `server` directory:

```bash
python -m venv ../myvenv
```

Windows PowerShell:

```powershell
..\myvenv\Scripts\Activate.ps1
```

Windows Git Bash:

```bash
source ../myvenv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the `server` directory:

```env
APP_NAME="Buyer Portal"
APP_VERSION="1.0.0"
DEBUG=true
LOG_LEVEL=INFO
PORT=8000
DESCRIPTION="Techkraft assessment backend"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=Boilerplate

SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRES_MINUTES=30
REFRESH_TOKEN_EXPIRES=7
```

## Database

Create your PostgreSQL database once before starting the app:

```sql
CREATE DATABASE boilerplate;
```

On startup, tables are initialized from SQLAlchemy models.

## Run

From `server`:

```bash
uvicorn main:app --reload
```

API docs:

- `GET /docs`
- `GET /redoc`

## API Summary

### Health

- `GET /` - Health check

### Auth

- `GET /auth/` - List users
- `POST /auth/` - Register user
- `PUT /auth/{id}` - Update user
- `POST /auth/login` - Login and issue tokens
- `POST /auth/refresh` - Refresh tokens
- `POST /auth/logout` - Logout

### Properties

- `GET /properties/` - List/search properties
- `GET /properties/{property_id}` - Property detail
- `POST /properties/` - Create property (**admin only**)
- `PUT /properties/{property_id}` - Update property (**admin only**)
- `DELETE /properties/{property_id}` - Delete property (**admin only**)

Search/query params on `GET /properties/`:

- `query`
- `status`
- `state`
- `min_price`
- `max_price`
- `skip`
- `limit`

### Favorites

- `GET /favorites/` - Current user favorites
- `POST /favorites/` - Add property to favorites
- `GET /favorites/check/{property_id}` - Check favorite status
- `DELETE /favorites/{favorite_id}` - Remove by favorite id
- `DELETE /favorites/property/{property_id}` - Remove by property id (current user)

## Authorization Rules

- All property and favorites routes require authenticated user token.
- Property write actions (create/update/delete) additionally require `admin` role.
- Non-admin users receive `403 Forbidden` on admin-only endpoints.

## Notes

- If startup fails with database-not-found, create the DB manually first.
- Use Alembic migrations for production schema evolution.
