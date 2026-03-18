# Entry Points Documentation

## Overview
This document describes the main entry points to the KIIT Kafe Campus 25 Ordering System. These are the primary PHP files that handle requests and coordinate the application flow.

## Main Entry Points

### index.php
The primary entry point for the application. All requests are routed through this file due to the .htaccess rewrite rules.

**Functionality:**
1. Includes `head.php` for HTML head section and base path calculation
2. Sets up basic routing by determining the requested path
3. Maps empty paths or index.php requests to the landing page
4. Passes base path and initial page to JavaScript via inline script
5. Includes all application views and components:
   - landing.php (home/landing page)
   - auth.php (login/signup/forgot password)
   - menu.php (menu browsing)
   - cart.php (shopping cart)
   - payment.php (payment processing)
   - success.php (order success/tracking)
   - admin.php (admin dashboard)
   - modals.php (all modal dialogs)
   - scripts.php (shared JavaScript functions)

**Routing Logic:**
```php
$request = $_SERVER['REQUEST_URI'];
$base = $basePath; // From head.php
$path = str_replace($base, '', $request);
$path = strtok($path, '?'); // Remove query parameters
$path = trim($path, '/');

// Map empty or index.php to landing
if (empty($path) || $path === 'index.php') $path = 'landing';

// Pass to JavaScript
echo "<script>
  window.basePath = '$basePath';
  window.initialPage = '$path';
</script>";
```

**Key Features:**
- Centralized file inclusion ensures all components are loaded
- Dynamic base path calculation supports multiple deployment methods
- Minimal PHP logic - primarily acts as a dispatcher to included components
- JavaScript handles client-side navigation and view switching

### PHP Files in Includes Directory

While all PHP files in the `/includes` directory are technically included by index.php, some serve as more specific entry points for particular functionality:

#### auth.php
Entry point for authentication flows:
- Login form submission
- Signup form submission  
- Forgot password requests
- Handles tab switching between login/signup/forgot

#### menu.php
Entry point for menu browsing:
- Category selection and filtering
- Search functionality
- Sorting options
- Item addition to cart
- Stock availability checking

#### cart.php
Entry point for cart management:
- Viewing cart contents
- Updating item quantities
- Removing items from cart
- Applying coupons
- Initiating checkout

#### payment.php
Entry point for payment processing:
- Payment method selection (Cash/UPI)
- UPI ID entry and validation
- Order confirmation
- Payment success/failure handling

#### success.php
Entry point for order completion:
- Order confirmation display
- Tracking information
- Invoice viewing
- Return to shopping

#### admin.php
Entry point for admin functionality:
- Admin dashboard access
- Menu management interface
- Order management interface
- Statistics viewing

#### modals.php
While not a traditional entry point, this file contains all modal dialogs that can be triggered from various parts of the application:
- Invoice viewing modal
- Coupon application modal
- Account management modal
- Payment waiting/success/failure modals
- Low stock notification modal (admin)

#### scripts.php
Contains shared JavaScript functions used across multiple entry points:
- Navigation functions
- Authentication handlers
- Menu filtering and sorting
- Cart management
- Payment processing
- Modal controls
- API communication

## Application Flow

### Initial Load
1. User requests any URL (due to .htaccess rules)
2. Server executes index.php
3. index.php determines the appropriate initial page (defaults to landing)
4. All application components are included in the response
5. JavaScript initializes and shows the appropriate page based on `window.initialPage`

### Page Navigation
1. User interacts with UI (clicks buttons, submits forms)
2. JavaScript intercepts events and prevents default form submissions where needed
3. JavaScript calls `nav('page-name')` function to switch views
4. Function hides all pages and shows only the requested page
5. URL may be updated via history API (if implemented)
6. Page-specific initialization functions may be called

### Form Submissions
Most forms use AJAX rather than traditional page reloads:
1. User submits form (login, signup, cart update, etc.)
2. JavaScript captures submit event
3. Form data is serialized and sent via fetch/XMLHttpRequest to appropriate API endpoint
4. Response is processed and UI is updated accordingly
5. User remains on the same page unless navigation is explicitly triggered

### API Communication
1. JavaScript sends requests to `/api/` endpoints
2. API endpoints process requests, interact with database
3. JSON responses are returned
4. JavaScript updates UI based on response status and data

## Deployment Considerations

### Multiple Deployment Methods Supported
The dynamic base path calculation in head.php supports three deployment methods:

1. **htdocs Method:** Project copied to `C:\xampp\htdocs\KIIT-KAFE\`
   - Accessed via `http://localhost/KIIT-KAFE/`
   - basePath becomes `/KIIT-KAFE/`

2. **Virtual Host Method:** Configured virtual host pointing to project root
   - Accessed via `http://kiitkafe.local/`
   - basePath becomes `/`

3. **PHP Server Method:** Using PHP's built-in server
   - Accessed via `http://localhost:8000/`
   - basePath becomes `/`

### .htaccess Role
The .htaccess file enables clean URLs and routing:
- All non-file/directory requests are rewritten to index.php
- Allows application to handle routing client-side
- Preserves query parameters with [QSA] flag
- [L] flag stops processing if rule matches

## Security Notes

### Entry Point Protection
- All entry points ultimately route through index.php
- No direct access to individual include files is blocked by default
- Sensitive files (like those containing database credentials) are outside web root or protected
- API endpoints should implement proper authentication and authorization

### Potential Improvements
1. Implement proper access control to prevent direct access to include files
2. Add CSRF tokens to form submissions
3. Implement rate limiting on authentication endpoints
4. Add input validation at entry point level (in addition to API level)
5. Consider implementing a front controller pattern with explicit route handling
6. Add logging for entry point access for monitoring and debugging

## Conclusion

The KIIT Kafe application uses a single entry point pattern with index.php routing all requests. This approach simplifies deployment and ensures consistent initialization. The actual view rendering and business logic is handled by included components and JavaScript, creating a responsive single-page application experience. While effective, there are opportunities to improve security and maintainability through more explicit routing and access controls.