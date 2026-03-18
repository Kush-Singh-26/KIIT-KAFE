# Admin Section Documentation

## Overview
This document describes the admin section of the KIIT Kafe Campus 25 Ordering System. The admin functionality is primarily implemented through API endpoints with minimal frontend interface, allowing administrators to manage menu items, orders, and view system statistics.

## Admin Access
Administrators access the system through the standard login interface using admin credentials:
- **Email:** `admin@kiitkafe.com`
- **Password:** (Hashed password stored in database, check setup process)

Upon successful login, administrators would typically be redirected to an admin dashboard (though the current implementation shows an empty dashboard.php file).

## Admin API Endpoints

All admin API endpoints are located in the `/api` directory and follow the same JSON response pattern as user endpoints.

### Menu Management

#### POST `/api/admin_menu_actions.php`
Handles CRUD operations for menu items.

**Actions:**
- **add**: Create a new menu item
- **edit**: Update an existing menu item
- **delete**: Remove a menu item

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

**Error Responses:**
- Missing required fields: `{"status": "error", "message": "Missing fields"}`
- Database errors: `{"status": "error", "message": "Database error message"}`

### Order Management

#### POST `/api/admin_order_actions.php`
Handles updating order status.

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

**Error Responses:**
- Missing fields: `{"status": "error", "message": "Missing fields"}`
- Invalid order ID: `{"status": "error", "message": "Order not found"}`
- Invalid status: `{"status": "error", "message": "Invalid status value"}`

### Statistics & Analytics

#### POST `/api/admin_stats.php`
Retrieves statistics for the admin dashboard.

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

### Database Setup

#### GET `/api/setup_db.php`
Initializes or resets the database with tables and sample data.

**Request:** No parameters required

**Success Response:**
```json
{
  "status": "success",
  "message": "Database setup completed successfully"
}
```

## Admin Functionality Flow

### Menu Management Flow
1. Admin logs in through standard authentication
2. Admin accesses menu management interface (would be in admin dashboard)
3. To add/edit menu items:
   - Form submission sends request to `/api/admin_menu_actions.php`
   - Action parameter determines operation (add/edit/delete)
   - For edit/delete, food_id is required to identify the item
   - On success, menu item list is refreshed
   - On error, error message is displayed to admin

### Order Management Flow
1. Admin views orders list (from `/api/admin_stats.php` recent_orders or separate endpoint)
2. Admin selects an order to update status
3. Status change request sent to `/api/admin_order_actions.php`
4. Order status is updated in database
5. Order list is refreshed to reflect new status

### Dashboard Statistics Flow
1. Admin accesses dashboard
2. Request sent to `/api/admin_stats.php`
3. Response contains:
   - Total registered users
   - Total number of orders
   - Total revenue generated
   - Top selling items (by quantity sold)
   - Recent orders for quick overview
4. Dashboard updates with retrieved statistics

## Expected Admin Interface Features

Based on the API endpoints and overall system design, an admin interface would likely include:

### Dashboard View
- Summary statistics cards (users, orders, revenue)
- Recent orders table
- Top selling items chart/graph
- Quick action buttons (Add Menu Item, View All Orders)

### Menu Management View
- List of all menu items with search/filter
- Add new menu item form
- Edit menu item form (populated when selecting item)
- Delete menu item confirmation
- Category filtering
- Stock status indicators

### Order Management View
- List of all orders with filtering (by status, date range)
- Order details view (items, customer info, payment)
- Status update dropdown for each order
- Print invoice button
- Export orders functionality (potential extension)

### Profile/Settings View
- Admin profile information
- Password change functionality
- System settings (if any)

## Security Considerations

### Authentication
- Admin access controlled through standard login system
- Role-based access determined by `role` field in users table (`admin` vs `user`)
- No separate admin login endpoint - same authentication as regular users

### Authorization
- **Critical Gap:** Current API endpoints do not verify that the user making admin requests is actually an admin
- Admin endpoints rely on client-side role checking only
- **Recommendation:** Add server-side role verification in all admin API endpoints:
  ```php
  // Example verification that should be added
  if ($_SESSION['user_role'] !== 'admin') {
      echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
      exit;
  }
  ```

### Data Protection
- Menu item images stored as external URLs (Unsplash)
- No direct file upload functionality in current implementation
- Price and inventory data protected through API validation
- Order data accessible only through authenticated endpoints

## Database Tables Relevant to Admin

### users
- Admin accounts identified by `role = 'admin'`
- Passwords stored as hashes (should use password_verify() in login)

### foods
- Complete menu management through this table
- Admin can create, read, update, delete records

### stock
- Inventory management linked to foods table
- Admin would manage stock levels through separate interface (not currently exposed in API)

### orders & order_items
- Admin can view all orders
- Admin can update order status
- Historical data preserved for analytics

## Implementation Notes

### Current Limitations
1. **Empty dashboard.php:** The admin dashboard file is currently empty, suggesting admin interface may be incomplete or handled differently
2. **Missing authorization checks:** Admin API endpoints lack server-side verification of admin privileges
3. **No stock management API:** While stock table exists, no API endpoints are exposed for inventory management
4. **Limited analytics:** Admin stats endpoint provides basic metrics but could be expanded

### Recommended Improvements
1. Add authorization checks to all admin API endpoints
2. Implement stock management API endpoints
3. Create actual admin dashboard interface in admin_files/
4. Add more comprehensive analytics (daily sales, popular categories, etc.)
5. Implement export functionality for reports
6. Add input validation and sanitization in admin endpoints
7. Consider implementing soft deletes instead of hard deletes for menu items
8. Add audit logging for admin actions

## Admin Workflow Examples

### Adding a New Menu Item
1. Login as admin (or verify admin role if already logged in)
2. Navigate to menu management section
3. Fill out form: name, description, price, category, image_url
4. Submit form
5. Frontend sends POST to `/api/admin_menu_actions.php` with action="add"
6. Backend validates input, inserts into foods table
7. Backend creates corresponding stock entry (quantity defaults to 0)
8. Success response triggers UI update to show new item
9. Admin must then update stock quantity separately (current gap)

### Updating Order Status
1. Login as admin
2. Navigate to orders management section
3. Locate order to update
4. Select new status from dropdown
5. Submit change
6. Frontend sends POST to `/api/admin_order_actions.php` with order_id and status
7. Backend validates order exists and status is valid
8. Backend updates orders.status field
9. Success response triggers UI update in orders list
10. Customer sees updated status in their order tracking

### Viewing Statistics
1. Login as admin
2. Navigate to dashboard
3. Dashboard loads (either on init or periodic refresh)
4. Frontend sends GET to `/api/admin_stats.php`
5. Backend queries database for:
   - COUNT(*) from users
   - COUNT(*) and SUM(total) from orders
   - Top items query joining foods, order_items, orders
   - Recent orders with limit and ordering
6. Backend returns JSON with statistics
7. Frontend updates dashboard widgets with retrieved data

## Conclusion
The admin section provides essential functionality for managing the KIIT Kafe system through API endpoints. While the core capabilities exist (menu management, order status updates, basic statistics), there are notable gaps in implementation including missing authorization checks, absent stock management API, and an unimplemented dashboard interface. Addressing these gaps would complete the admin section and provide a secure, comprehensive management system for the cafe operations.