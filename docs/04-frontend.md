# Frontend Assets Documentation

## Overview
This document describes the frontend assets (CSS and JavaScript) for the KIIT Kafe Campus 25 Ordering System. The frontend uses a combination of custom CSS with Tailwind-like utility classes and vanilla JavaScript to create a responsive, interactive user interface.

## CSS Documentation (css/style.css)

### Design System
The application uses a custom design system with CSS variables defined in the `:root` selector:

**Color Palette:**
- `--dark: #0d1f15` - Primary background color
- `--dark2: #122010` - Secondary background color
- `--green: #1a3d28` - Primary green (used for headers, buttons)
- `--green-mid: #2d6a4f` - Medium green (used for active states, accents)
- `--green-btn: #2d6a4f` - Button green
- `--lime: #7ed957` - Accent/lime color (used for highlights, buttons)
- `--lime-bright: #a8f06b` - Bright lime (hover states)
- `--orange: #c8501a` - Accent orange (used for logos, highlights)
- `--orange-text: #c8501a` - Orange text
- `--cream: #f5f0e8` - Light background (used for cards, pages)
- `--light-green: #d4edda` - Light green background
- `--white: #ffffff` - White color
- `--muted: #8fad96` - Muted text color
- `--border: rgba(255,255,255,0.1)` - Border color
- `--card-bg: rgba(255,255,255,0.06)` - Card background
- `--radius: 16px` - Border radius
- `--shadow: 0 8px 32px rgba(0,0,0,0.3)` - Shadow effect

### Key CSS Sections

#### 1. Root & Reset (lines 1-29)
- CSS variables definition
- Global reset: margin, padding, box-sizing
- Smooth scrolling behavior
- Base body styling with dark theme and white text

#### 2. Page System (lines 30-42)
- Page transition animations (fade-in, float-up, pulse, spin, pop-in, slide-down, wobble)
- Toast notification styling

#### 3. Modal Overlay (lines 54-62)
- Semi-transparent black background
- Centered content with padding

#### 4. Navbar (lines 63-122)
- Sticky header with logo and navigation actions
- Responsive design with hover effects
- Logo styling with Syne font and color variations

#### 5. Landing Page Design (lines 124-494)
- Complex gradient backgrounds
- 3D canvas space for visual effects
- Hero section with animated typography
- Stats section with large numbers
- Feature cards with hover effects
- Footer with brand info and links
- Toast and scroll hint animations

#### 6. Auth Page Design (lines 667-969)
- Transparent background matching landing page
- Auth card with glassmorphism effect
- Tabbed interface for login/signup/forgot password
- Form styling with focused states
- Social button styling

#### 7. Menu Page Design (lines 970-1314)
- Topbar with gradient background
- Search bar with rounded corners
- Category scroll strip with active states
- Menu card grid layout
- Item cards with hover effects, ratings, and badges
- Quantity controls and add-to-basket buttons

#### 8. Cart Page Design (lines 1315-1438)
- Clean card-based layout
- Cart items display with thumbnails
- Quantity adjustment controls
- Delivery address card
- Bill details with tax calculations
- Coupon application section
- No-contact delivery option
- Total charge button with sticky positioning
- Empty cart state

#### 9. Payment Page Design (lines 1439-1541)
- Payment header with green background
- Two-column layout (order details vs payment options)
- Payment method selection (cash/UPI)
- UPI input and QR code display
- Order summary card
- Place order button

#### 10. Success & Invoice Page Design (lines 1542-1656+)
- Success header with gradient background
- Success checkmark animation
- Meta information pills
- Progress steps visualization
- Customer information form
- Invoice side panel with itemized details
- Print invoice functionality

### Responsive Design
- Uses relative units (rem, vw, vh) for scalable typography
- Flexbox and CSS Grid for layout
- Max-width containers for content limitation
- Mobile-first approach with spacing adjustments

### Animation & Interactions
- Hover effects on buttons, cards, and interactive elements
- Click animations and transitions
- Loading states and progress indicators
- Modal entrance animations
- Toast notifications for feedback

## JavaScript Documentation

The application uses several JavaScript files for frontend functionality:

### js/app.js
Main application logic including:
- Page navigation system (`nav()` function)
- Authentication handling (login, signup, forgot password)
- Menu item filtering and sorting
- Cart management (add/update/remove items)
- Checkout and payment processing
- Modal controls (open/close modals)
- Toast notifications for user feedback
- API communication with backend endpoints

### js/menu.js
Menu-specific functionality:
- Dynamic menu item rendering from API data
- Category filtering and highlighting
- Search functionality with real-time filtering
- Sorting options (price low/high, default)
- Stock availability checking (out of stock indicators)
- Welcome message personalization
- Cart badge updates

### js/landing-design.js
Landing page animations and interactions:
- 3D canvas effects (if implemented)
- Hero section animations
- Stat counters animations
- Feature card hover effects
- Scroll-triggered animations

### js/payment.js
Payment processing logic:
- Payment method selection handling
- UPI input validation
- QR code generation/display (if applicable)
- Payment simulation for demo purposes
- Success/failure modal handling
- Order status tracking

### js/auth.js
Authentication-specific functions:
- Form validation for login/signup
- Password toggle functionality
- Social login handling (placeholders)
- Session management
- Redirect logic after authentication

### js/cart.js
Cart management functions:
- Adding items to cart with quantity selection
- Updating cart item quantities
- Removing items from cart
- Calculating totals, taxes, and discounts
- Applying coupon codes
- Empty cart state detection
- Checkout initiation

### js/admin.js
Admin panel functionality:
- Admin authentication checks
- Dashboard statistics loading
- Menu item management (add/edit/delete)
- Order management and status updates
- Sales analytics visualization
- Inventory management

## Frontend Architecture

### Single Page Application (SPA) Pattern
- All pages are contained within a single HTML file (index.php)
- Different views are shown/hidden using CSS classes (.page.active)
- Navigation is handled via JavaScript without full page reloads
- State is managed in JavaScript variables and browser storage where needed

### Component Structure
While not using a formal framework, the application follows component-like patterns:
- Each include file represents a logical UI component/page
- Reusable patterns (modals, cards, buttons) are standardized
- Data flows from API endpoints to UI via JavaScript
- User actions trigger API calls which update the UI

### Styling Approach
- Utility-first CSS similar to Tailwind but custom-built
- Semantic class names for layout components
- State-based styling (active, selected, disabled)
- Consistent spacing and rhythm using margin/padding utilities
- Theme consistency through CSS variables

### Performance Considerations
- Minimal DOM manipulation - updates only what's necessary
- Event delegation where applicable
- CSS animations for smooth transitions
- External resources (fonts) loaded asynchronously
- Image optimization through external URLs (Unsplash)

### Security Notes
- Client-side validation should be complemented with server-side validation
- No sensitive data stored in frontend (handled via sessions/API)
- XSS prevention relies on proper escaping in API responses
- CSRF protection not implemented in frontend (should be added)
- Direct API calls from frontend expose endpoints (consider authentication tokens)

## Responsive Breakpoints
The design appears to be fluid with:
- Mobile-first base styles
- Layout adjustments at various widths:
  - Navbar adjustments for small screens
  - Grid column changes (4-column to 2-column to 1-column)
  - Modal width constraints
  - Typography scaling with viewport units

## Accessibility Features
- Semantic HTML structure (nav, section, button, input labels)
- Sufficient color contrast in most areas
- Focusable interactive elements
- Button elements for actions (not just divs)
- Form inputs with associated labels
- Skip to content potential (could be improved)
- ARIA labels could be enhanced for better screen reader support

## Browser Compatibility
- Modern CSS features used (CSS Grid, Flexbox, custom properties)
- Requires IE11+ or modern browsers
- Fallbacks may be needed for older browsers
- Animations use CSS properties widely supported