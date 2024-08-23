# Dnd Shop Backend

A Node.js backend for a Dnd shop application, built with Express, MongoDB, and JWT authentication. This project serves as a learning tool for Node.js and custom authentication implementation.

## Features

- User authentication (JWT-based)
- CRUD operations for shops
- Token validation middleware
- MongoDB for data persistence

## Installation

- Clone the repository
- npm install


## Environment Variables

- `NODE_ENV`: Environment (`development`, `production`, etc.)
- `PORT`: Server port
- `MONGO_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET`: Secret for signing access tokens
- `REFRESH_TOKEN_SECRET`: Secret for signing refresh tokens




## Running the Application

- **Development**:
  npm run dev
- **Production**: 
  npm run build
  npm start


## API Endpoints

### Authentication
- `POST /api/auth/signup` - Signup
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Shops
- `POST /api/shop/new` - Create a new shop (requires access token)
- `GET /api/shop/all` - Get all shops
- `GET /api/shop/user` - Get shops of the authenticated user
- `GET /api/shop/:id` - Get shop by ID
- `DELETE /api/shop/delete/:id` - Delete shop
- `PATCH /api/shop/update/:id` - Update shop
