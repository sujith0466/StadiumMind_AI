# Environment Variables

Configure these variables in a `.env` file at the root of the `backend` directory (or inject them via your deployment provider). 

*Do not commit your `.env` file to version control.*

See `.env.example` in the repository root for a template.

---

## Required Configuration

### `DATABASE_URL`
- **Purpose:** Connection string for the PostgreSQL database.
- **Example:** `postgresql://stadium_admin:password@localhost:5432/stadium_mind`
- **Default:** `postgresql://stadium_admin:stadium_password@localhost:5432/stadium_mind`

### `REDIS_URL`
- **Purpose:** Connection string for the Redis cache/pubsub instance.
- **Example:** `redis://localhost:6379/0`
- **Default:** `redis://localhost:6379/0`

### `SECRET_KEY`
- **Purpose:** Flask application secret key for session management and cryptographic signing.
- **Security Note:** Generate a long, random string for production.
- **Example:** `my-super-secret-key-prod`

### `JWT_SECRET_KEY`
- **Purpose:** Secret key used by Flask-JWT-Extended to sign and verify JSON Web Tokens.
- **Security Note:** Keep strictly confidential.
- **Example:** `my-jwt-secret-key-prod`

### `CORS_ORIGINS`
- **Purpose:** Comma-separated list of allowed origins for Cross-Origin Resource Sharing.
- **Example:** `https://stadiummind.vercel.app,http://localhost:3000`
- **Default:** `*` (WARNING: Restrict this in production).

---

## Frontend Configuration

These variables are required during the frontend build step (e.g., in Vite).

### `VITE_API_BASE_URL`
- **Purpose:** Base URL for the backend API gateway.
- **Example (Local):** `http://localhost:5000`
- **Example (Production):** `https://stadiummind-backend.onrender.com`
