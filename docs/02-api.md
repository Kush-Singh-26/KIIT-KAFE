# API Documentation

## Overview
This document describes the API endpoints for the KIIT Kafe Campus 25 Ordering System. All API endpoints return JSON responses and are located in the `/api` directory.

## Common Patterns
- All endpoints return JSON with a `status` field indicating success or error
- Successful responses include relevant data in additional fields
- Error responses include a `message` field describing the issue
- Database connection is handled via `include "db.php"` in each endpoint
- Session management is used for authentication state

## Endpoints

### Authentication

#### POST `/api/login.php`
Authenticates a user and establishes a session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response:**
```json
{
  "status": "success",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "string"
  }
}
```

**Error Responses:**
- Missing fields: `{"status": "error", "message": "Missing fields"}`
- Invalid password: `{"status": "error", "message": "Invalid password"}`
- User not found: `{"status": "error", "message": "User not found"}`

#### POST `/api/logout.php`
Ends the current user session.

**Request:** No body required

**Success Response:**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

#### POST `/api/signup.php`
Creates a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Account created successfully"
}
```

**Error Responses:**
- Missing fields: `{"status": "error", "message": "Missing fields"}`
- Email already exists: `{"status": "error", "message": "Email already exists"}`

#### POST `/api/forgot_password.php`
Initiates password reset process.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** Always returns success for security (to prevent email enumeration)
```json
{
  "status": "success",
  "message": "If the email exists, reset instructions have been sent"
}
```

#### POST `/api/get_session.php`
Checks if a user is currently logged in and returns session data.

**Request:** No body required

**Success Response:**
```json
{
  "status": "success",
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "string"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Not logged in"
}
```

#### POST `/api/update_profile.php`
Updates the currently logged-in user's profile information.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string" // optional
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Profile updated successfully"
}
```

**Error Responses:**
- Missing fields: `{"status": "error", "message": "Missing fields"}`
- Email already exists: `{"status": "error", "message": "Email already exists"}`

### Menu & Cart

#### GET `/api/menu.php`
Retrieves all menu items with stock levels and popularity data.

**Request:** No parameters required

**Success Response:**
```json
[
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "price": "float",
    "category": "string",
    "image_url": "string",
    "stock": "integer",
    "popularity": "integer",
    "emoji": "string",
    "cat": "string",
    "img": "string",
    "sub": "string"
  }
]
```

### Order Management

#### POST `/api/create_order.php`
Creates a new order from cart items.

**Request Body:**
```json
{
  "order_code": "string",
  "user_id": "integer",
  "total": "float",
  "payment_method": "string", // "Cash" or "UPI"
  "items": [
    {
      "id": "integer",
      "name": "string",
      "qty": "integer",
      "price": "float"
    }
  ]
}
```

**Success Response:**
```json
{
  "status": "success",
  "order_id": "integer"
}
```

**Error Responses:**
- Missing fields: `{"status": "error", "message": "Missing fields"}`
- Insufficient stock: `{"status": "error", "message": "Insufficient stock for item: {item_name}"}`
- Order failed: `{"status": "error", "message": "Order failed: {error_message}"}`

#### POST `/api/get_orders.php`
Retrieves all orders (admin only).

**Request:** No parameters required

**Success Response:**
```json
[
  {
    "id": "integer",
    "order_code": "string",
    "user_id": "integer",
    "total": "float",
    "status": "string", // Pending, Preparing, Completed, Failed, Invalid
    "payment_method": "string", // Cash or UPI
    "created_at": "timestamp"
  }
]
```

#### POST `/api/get_user_orders.php`
Retrieves orders for the currently logged-in user.

**Request:** No parameters required

**Success Response:**
```json
[
  {
    "id": "integer",
    "order_code": "string",
    "total": "float",
    "status": "string",
    "payment_method": "string",
    "created_at": "timestamp"
  }
]
```

#### POST `/api/get_order_status.php`
Gets the status of a specific order.

**Request Body:**
```json
{
  "order_id": "integer"
}
```

**Success Response:**
```json
{
  "status": "string" // Pending, Preparing, Completed, Failed, Invalid
}
```

#### POST `/api/cancel_order.php`
Cancels an order (admin only).

**Request Body:**
```json
{
  "order_id": "integer"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Order cancelled successfully"
}
```

#### POST `/api/validate_cart.php`
Validates that cart items are still in stock before checkout.

**Request Body:**
```json
{
  "items": [
    {
      "id": "integer",
      "qty": "integer"
    }
  ]
}
```

**Success Response:**
```json
{
  "status": "success"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Insufficient stock for item: {item_name}"
}
```

### Admin Functions

#### POST `/api/admin_menu_actions.php`
Handles admin actions on menu items (add, edit, delete).

**Request Body:**
```json
{
  "action": "string", // add, edit, delete
  "food_id": "integer", // required for edit/delete
  "name": "string",
  "description": "string",
  "price": "float",
  "category": "string",
  "image_url": "string"
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "{action} successful"
}
```

#### POST `/api/admin_order_actions.php`
Handles admin actions on orders (update status).

**Request Body:**
```json
{
  "order_id": "integer",
  "status": "string" // Pending, Preparing, Completed, Failed, Invalid
}
```

**Success Response:**
```json
{
  "status": "success",
  "message": "Order status updated successfully"
}
```

#### POST `/api/admin_stats.php`
Retrieves statistics for admin dashboard.

**Request:** No parameters required

**Success Response:**
```json
{
  "total_users": "integer",
  "total_orders": "integer",
  "total_revenue": "float",
  "top_items": [
    {
      "name": "string",
      "total_sold": "integer"
    }
  ],
  "recent_orders": [
    {
      "order_code": "string",
      "total": "float",
      "status": "string",
      "created_at": "timestamp"
    }
  ]
}
```

#### GET `/api/setup_db.php`
Initializes the database with tables and sample data.

**Request:** No parameters required

**Success Response:**
```json
{
  "status": "success",
  "message": "Database setup completed successfully"
}
```

## Security Notes
1. Passwords are compared directly in login.php (should be hashed in production)
2. No CSRF protection implemented
3. No rate limiting on authentication endpoints
4. Admin endpoints rely on client-side role checking (should be verified server-side)
5. SQL injection is prevented through prepared statements in most endpoints

## Error Handling
- All endpoints wrap database operations in try-catch blocks
- Transactions are used for operations that modify multiple tables
- On error, transactions are rolled back to maintain data consistency
- Database connection errors return a generic message to avoid information leakage