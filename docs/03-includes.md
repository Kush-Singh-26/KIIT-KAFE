# PHP Includes Documentation

## Overview
This document describes the reusable PHP components located in the `/includes` directory. These files contain HTML markup with embedded PHP and JavaScript that are used to build the different pages of the KIIT Kafe application.

## Common Patterns
- Each include file represents a complete page of the application
- Files contain HTML structure with Tailwind CSS classes for styling
- Embedded JavaScript handles client-side interactivity
- PHP is used minimally, mainly for dynamic base path calculation in head.php
- Navigation between pages is handled by JavaScript functions defined in included JS files

## Files

### head.php
Contains the HTML head section and opening body tag.

**Key Features:**
- Dynamically calculates base path for correct asset loading regardless of deployment method
- Sets UTF-8 charset and viewport for responsive design
- Defines page title: "KIIT KAFE — Campus 25"
- Loads Google Fonts (Syne, Playfair Display, DM Sans)
- Links to main stylesheet: css/style.css

**Usage:** Included at the beginning of every PHP template that outputs HTML.

### auth.php
Contains the authentication page (login/signup/forgot password).

**Sections:**
1. **Login Form:** Email and password fields with "Show password" toggle
2. **Signup Form:** Full name, email, phone, and password fields
3. **Forgot Password:** Email input for password reset requests

**Features:**
- Tabbed interface to switch between login/signup/forgot
- Input validation handled by JavaScript (doLogin(), doSignup(), doForgot())
- Social login button placeholder (Google)
- Responsive design with auth-card container

### landing.php
Contains the landing/home page that serves as the entry point for unauthenticated users.

**Sections:**
1. **Header:** Navigation with Login/Signup buttons
2. **Hero Section:** Branding, call-to-action buttons (Explore Menu, Order Now)
3. **Stats Section:** Key metrics (Daily Visitors, Menu Items, Rating, Opening Hours)
4. **Features Section:** 6 feature cards highlighting selling points
5. **Footer:** Brand info, quick links, account links, contact information

**Features:**
- Responsive layout with hero badge, canvas text space
- Interactive buttons that call JavaScript nav() function
- Visual hierarchy with clear sections and spacing

### menu.php
Contains the main menu page where users browse and select items.

**Sections:**
1. **Topbar:** 
   - Navigation logo (back to landing)
   - Location display (Campus 25, Patia, Bhubaneswar)
   - Search bar with real-time filtering
   - User info and action buttons (cart, account menu)
2. **Menu Hero Bar:** Motivational heading
3. **Categories Strip:** Horizontal scrollable category buttons
4. **Menu Body:**
   - Section label and sorting dropdown (Price low/high, default)
   - Items grid container populated by JavaScript
5. **Footer:** Standard footer with brand info and links

**Features:**
- Real-time search filtering via filterMenuItems()
- Category navigation with scrollable strip
- Sorting functionality via sortMenuItems()
- Dynamic welcome message showing user name
- Cart badge indicator for item count
- Account menu dropdown

### cart.php
Contains the shopping cart page where users review and modify their selections.

**Sections:**
1. **Navbar:** Back to menu button
2. **Cart States:**
   - Empty state: Message and Browse Menu button
   - Filled state: Cart layout with items and bill details
3. **Cart Layout (when filled):**
   - Left: Cart items list and delivery address card
   - Right: Bill card with item totals, taxes, discounts, and checkout button
4. **Additional Features:**
   - Coupon application modal
   - No-contact delivery option
   - Bill calculation (item total, delivery fee, GST, discount)

**Features:**
- Dynamic cart items rendering
- Address display with change option
- Real-time bill updates as items are modified
- Coupon modal for discount codes
- Checkout initiation via handleCheckout()

### payment.php
Contains the payment processing page (referenced but not shown in provided files - likely handled via modals).

**Note:** Based on the modals.php file, payment processing appears to be handled through modals rather than a standalone page:
- Payment Waiting Modal (for cash payments)
- Payment Success Modal
- Payment Failure Modal

### success.php
Contains the order success/tracking page.

**Note:** File not fully shown in listing, but referenced in navigation. Likely contains:
- Order confirmation details
- Tracking information
- Option to view invoice
- Return to home/menu options

### modals.php
Contains all modal dialogs used throughout the application.

**Modals Included:**
1. **Invoice Modal:** Displays order invoice with customer, items, totals, and print button
2. **Coupon Modal:** Allows applying discount codes (KIIT10 for 10%, STUDENT for ₹50 off)
3. **Account Modal:** Shows user profile info, edit profile/logout buttons, and order history
4. **Payment Waiting Modal:** Shown for cash payments, verifies payment status
5. **Low Stock Modal:** Admin feature to show items with low inventory
6. **Payment Success Modal:** Confirms successful payment with order ID and view/track options
7. **Payment Failure Modal:** Shows payment error with retry/back options

**Features:**
- Consistent modal-overlay background with animated modal boxes
- Close buttons on all modals
- Responsive designs with appropriate max-width constraints
- Interactive elements bound to JavaScript functions
- Loading states and placeholder content where data is injected dynamically

### scripts.php
Contains shared JavaScript functions used across multiple pages.

**Note:** File not shown in listing but referenced in head.php. Likely contains:
- Navigation functions (nav(), showAccountMenu())
- Authentication functions (doLogin(), doSignup(), doForgot())
- Menu functions (filterMenuItems(), sortMenuItems())
- Cart functions (handleCheckout(), applyCoupon())
- Payment handling functions
- Modal control functions (openModal(), closeModal())
- Utility functions for DOM manipulation and API calls

### admin.php
Contains the admin dashboard page.

**Note:** File not shown in listing but referenced in directory. Based on admin_files/dashboard.php, likely contains:
- Admin authentication checks
- Dashboard layout with stats and quick actions
- Navigation to admin functions (menu management, order management, analytics)

## JavaScript Integration
All include files rely on JavaScript functions defined in:
- js/app.js - Main application logic
- js/menu.js - Menu-specific functionality
- js/landing-design.js - Landing page animations/interactions
- js/payment.js - Payment processing logic
- js/auth.js - Authentication handling
- js/cart.js - Cart management
- js/admin.js - Admin panel functions

## Styling
All styling is handled through:
- css/style.css - Main stylesheet with Tailwind-like utility classes
- Google Fonts for typography
- Responsive design principles for mobile/desktop compatibility

## Security Notes
- Minimal PHP usage reduces server-side attack surface
- Client-side validation should be supplemented with server-side validation in API endpoints
- No sensitive data is stored in these files (credentials handled via API/db.php)
- XSS prevention relies on proper escaping in API responses and DOM manipulation