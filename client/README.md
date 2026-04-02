# TechKraft Assessment Client

Frontend for the TechKraft assessment property platform. This app is built with React, TypeScript, Vite, Tailwind CSS, React Router, and TanStack Query.

## What it does

The client provides a complete property browsing experience with authenticated user access and admin-only management features.

Core capabilities:

- Sign in and sign up with session-based authentication.
- Protected app shell with automatic redirect handling.
- Profile page for the signed-in user.
- Property listing page with search and filters.
- Property detail page.
- Favorites management.
- Admin-only create, edit, and delete property actions.
- Auto-refresh of expired auth sessions through the API client.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS 4
- Radix UI and shadcn-style components
- Lucide icons
- Geist variable font

## Requirements

- Node.js 18 or newer
- pnpm or another compatible package manager
- The backend API running separately

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure the API base URL if your backend is not running on the default address.

   Create a `.env` file in the `client` folder:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

   If this variable is omitted, the client falls back to `http://localhost:8000`.

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open the app in the browser using the Vite URL shown in the terminal.

## Available Scripts

- `pnpm dev` - start the Vite development server.
- `pnpm build` - type-check and create a production build.
- `pnpm lint` - run ESLint across the project.
- `pnpm preview` - preview the production build locally.

## App Routes

- `/` - redirects to `/signin`.
- `/signin` - sign in page.
- `/signup` - sign up page.
- `/dashboard` - signed-in profile page.
- `/properties` - property listing and admin property form.
- `/properties/:propertyId` - property detail page.
- `/favorites` - saved properties.

All routes except sign in and sign up are protected.

## Authentication Flow

The app uses a React context for auth state and keeps the session in sync with the backend.

- On startup, the client attempts a refresh request and then fetches the current user profile.
- Sign in and sign up both load the authenticated user into context after success.
- Sign out clears the client-side user state after the backend logout request.
- Protected routes redirect unauthenticated users back to `/signin`.

The API client is configured with `withCredentials: true`, so cookies are used for session handling.

## Feature Overview

### Profile page

The profile page gives the signed-in user a quick landing area after authentication.

- Shows the current username and email.
- Links to properties and favorites.
- Provides a logout action.

### Properties

The properties area is the main browsing experience.

- Search and filter properties.
- Paginated listing view.
- Property cards and detail pages.
- Loading skeletons while requests are in flight.
- Favorites toggles for signed-in users.

### Admin property management

Users with the `admin` role can manage listings directly in the properties page.

- Create new properties.
- Edit existing properties.
- Delete properties with confirmation.
- Validate required fields and numeric values before submit.

### Favorites

Signed-in users can save and remove properties from their favorites list and view them on the favorites page.

## API Behavior

The frontend talks to the backend through a shared Axios client.

- Base URL comes from `VITE_API_BASE_URL`.
- Requests send credentials for cookie-based auth.
- A `401` response triggers a single refresh attempt and then retries the original request.
- API errors are normalized through a shared error helper.

## Project Structure

```text
src/
  app/                 App routing and composition root
  components/          Shared UI, auth, layout, and property components
  contexts/            Authentication context
  hooks/               TanStack Query mutations and queries
  lib/                 API client and helper utilities
  pages/               Page-level screens
  types/               Shared TypeScript types
  main.tsx             Application bootstrap
  index.css            Global styles
  App.css              App-level styles
```

Notable subfolders:

- `components/auth` - route guards and auth forms.
- `components/layout` - protected layout and navigation.
- `components/property` - property cards, filters, grid, pagination, skeletons, and favorite toggle.
- `hooks/queries` - data fetching hooks for properties and favorites.
- `hooks/mutations` - create/update/delete favorite and property mutations.

## UI Notes

- The app uses a clean card-based layout with Tailwind utility classes.
- Global styling is handled through `src/index.css` and `src/App.css`.
- The client uses a variable Geist font and a modern component set for consistent spacing and form controls.

## Backend Expectations

This frontend expects a compatible backend API to be available. In particular, it relies on endpoints for:

- Authentication login, refresh, logout, and current-user lookup.
- Property listing, detail, creation, update, and deletion.
- Favorites queries and mutations.

If the backend is running on a different host or port, update `VITE_API_BASE_URL` accordingly.

## Common Troubleshooting

- If you are stuck on the sign-in page, confirm the backend is running and cookies are being set correctly.
- If data does not load, check that `VITE_API_BASE_URL` points to the correct server.
- If auth requests fail after login, clear the browser session and try again.

## License

This repository is part of a coding assessment and does not currently include a separate license file.
