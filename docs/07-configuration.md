# Configuration Documentation

## Overview
This document describes the configuration files and settings for the KIIT Kafe Campus 25 Ordering System. These files control how the application behaves in different environments and deployment scenarios.

## Configuration Files

### .htaccess
The Apache configuration file that enables clean URLs and routing.

**Location:** Project root (`/.htaccess`)

**Contents:**
```apache
RewriteEngine On
# RewriteBase /KIIT-KAFE/ (Removed hardcoded base path for system portability)

# If the request is for a real file or directory, serve it directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Otherwise, send everything to index.php
RewriteRule ^(.*)$ index.php [QSA,L]
```

**Functionality:**
- Enables Apache's mod_rewrite module
- Ensures that if a requested file or directory exists, it is served directly
- Routes all other requests to index.php for application handling
- [QSA] flag preserves query parameters
- [L] flag stops processing if this rule matches

**Important Notes:**
- The commented RewriteBase line indicates the file is designed for portability
- No hardcoded base path allows the same .htaccess to work in different deployment contexts
- The dynamic base path calculation in head.php works in conjunction with this file

### PHP Configuration
While there are no explicit PHP configuration files in the project, several PHP settings affect application behavior:

**Database Connection (api/db.php):**
```php
$host = "localhost";
$user = "root";
$pass = "";
$db = "kiit_kaffe_db";
```

**Session Management:**
- `session_start()` is called in db.php
- Session data includes user_id, user_name, user_email, user_phone, user_role
- Sessions are used for authentication state across API calls

**Error Handling:**
- Database connection errors return JSON error messages
- Individual API endpoints have try-catch blocks for specific error handling
- No global error handler is implemented

### JavaScript Configuration
Configuration values are embedded in JavaScript rather than external files:

**API Base Path:**
- Implicitly relative to current page due to same-origin requests
- All API calls go to `/api/endpoint.php` paths

**Image URLs:**
- Menu item images are stored as external URLs (Unsplash)
- No local image storage or configuration

**Coupon Codes:**
- Hardcoded examples in coupon modal: "KIIT10" (10% off), "STUDENT" (₹50 off)
- Validation logic would need to be implemented in backend

## Deployment Methods

The application supports three primary deployment methods, facilitated by the dynamic base path calculation in head.php:

### 1. htdocs Method (Recommended for Beginners)
**Setup:**
1. Copy entire project to `C:\xampp\htdocs\KIIT-KAFE\`
2. Start Apache and MySQL in XAMPP Control Panel
3. Access via `http://localhost/KIIT-KAFE/`

**Configuration:**
- `.htaccess` works as-is (no RewriteBase needed)
- head.php calculates basePath as `/KIIT-KAFE/`
- All asset loading works correctly

### 2. Virtual Host Method
**Setup:**
1. Configure virtual host in Apache pointing to project root
2. Example virtual host configuration:
   ```apache
   <VirtualHost *:80>
       DocumentRoot "C:/Users/KIIT0001/KIIT-KAFE"
       ServerName kiitkafe.local
       <Directory "C:/Users/KIIT0001/KIIT-KAFE">
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```
3. Add `kiitkafe.local` to hosts file pointing to 127.0.0.1
4. Restart Apache
5. Access via `http://kiitkafe.local/`

**Configuration:**
- `.htaccess` works as-is
- head.php calculates basePath as `/`
- All asset loading works correctly

### 3. PHP Built-in Server Method
**Setup:**
1. Navigate to project directory in command line
2. Run: `php -S localhost:8000`
3. Access via `http://localhost:8000/`

**Configuration:**
- `.htaccess` is not used (PHP server doesn't process .htaccess by default)
- However, the dynamic base path in head.php still works
- All requests naturally go to index.php (default behavior of PHP server)
- Asset loading works correctly

## Environment Configuration

The application currently has no explicit environment configuration (development vs production). All settings are hardcoded:

### Database Credentials
- Host: localhost
- User: root
- Password: (empty)
- Database: kiit_kaffe_db

**Recommendation for different environments:**
- Use environment variables or configuration files
- Separate credentials for development, testing, and production
- Never commit actual credentials to version control

### Debugging/Development Features
- No explicit debug mode toggle
- Error messages returned to user (could leak information in production)
- Recommendation: Implement environment-based error handling

## Application Constants

While not defined as formal constants, several values are used consistently throughout the application:

### Payment Methods
- Cash
- UPI

### Order Statuses
- Pending
- Preparing
- Completed
- Failed
- Invalid

### User Roles
- user
- admin

### Tax Rates
- GST: 5% (hardcoded in modals.php and cart calculations)

### Delivery Fee
- ₹20 (hardcoded in cart calculations)

### Default Image
- Uses external Unsplash URLs for menu items
- No default/fallback image configuration

## Security Configuration

### Missing Security Headers
The application does not currently set security headers that would be important in production:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Strict-Transport-Security (if using HTTPS)

### Cookie Security
- PHP sessions used but session cookie settings not explicitly configured
- Recommendation: Set session.cookie_secure, session.cookie_httponly, etc.

### CORS
- No CORS headers implemented (not needed for same-origin usage)
- Would be needed if API were consumed by external domains

## Performance Configuration

### Caching
- No explicit caching headers set
- Browser caching relies on default behavior
- Recommendation: Add appropriate cache headers for static assets

### Compression
- Relies on Apache compression if enabled
- No explicit compression configuration in application

### Database Connection Pooling
- Uses PDO but creates new connection per request (via db.php include)
- For high traffic, consider persistent connections or connection pooling

## Internationalization/Localization
- Application is primarily in English with some Hindi-influenced terms
- No explicit i18n/l10n framework
- All text is hardcoded in PHP/HTML files
- Currency displayed as ₹ (Indian Rupee)
- Date/time formats follow MySQL defaults

## Configuration Best Practices

### Recommended Improvements
1. **Environment Configuration:**
   - Create config.php files for different environments
   - Use environment variables for sensitive data
   - Implement bootstrapping that loads appropriate config

2. **Centralized Configuration:**
   - Move hardcoded values to configuration files
   - Create constants for payment methods, order statuses, etc.
   - Centralize tax rates, delivery fees, etc.

3. **Security Enhancements:**
   - Add security headers via .htaccess or PHP
   - Implement proper session cookie settings
   - Add CSRF protection
   - Implement rate limiting on sensitive endpoints

4. **Performance Optimization:**
   - Add caching headers for static assets
   - Enable and configure Apache compression
   - Consider database connection pooling for high traffic
   - Optimize images and leverage browser caching

5. **Deployment Automation:**
   - Create deployment scripts
   - Implement database migration system
   - Create environment-specific setup procedures

## Current Limitations

1. **No Environment Separation:**
   - Same code runs in development and production
   - No way to toggle debug features

2. **Hardcoded Values:**
   - Many configuration values embedded in code
   - Difficult to change without modifying source

3. **Limited Error Handling:**
   - Errors shown to users could leak sensitive information
   - No logging configuration

4. **Static Asset Management:**
   - No cache busting or versioning for CSS/JS
   - Dependencies loaded from external sources (Google Fonts, Unsplash)

5. **No Build Process:**
   - Raw CSS and JS files used directly
   - No minification or concatenation for production

## Conclusion

The KIIT Kafe application relies primarily on Apache's .htaccess for URL rewriting and the dynamic base path calculation in head.php for deployment flexibility. While this approach provides good portability across different deployment methods, there are significant opportunities to improve configuration management through environment separation, centralized constants, and enhanced security and performance settings. As the application evolves, implementing proper configuration practices will improve maintainability, security, and deployability.