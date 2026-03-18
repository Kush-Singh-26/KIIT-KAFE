# KIIT Kafe Documentation

This directory contains detailed documentation for the KIIT Kafe Campus 25 Ordering System. Each document focuses on a specific aspect of the project to provide comprehensive guidance for developers, administrators, and maintainers.

## Documentation Overview

| Document | Description | Priority |
|----------|-------------|----------|
| [01-database.md](01-database.md) | Complete database schema including tables, relationships, indexes, and sample data | High |
| [02-api.md](02-api.md) | Detailed API endpoint documentation including request/response formats, authentication, and error handling | High |
| [03-includes.md](03-includes.md) | Documentation of reusable PHP components (headers, pages, modals) that build the application views | Medium |
| [04-frontend.md](04-frontend.md) | CSS styling system, JavaScript architecture, and frontend asset documentation | Medium |
| [05-admin.md](05-admin.md) | Admin section functionality including API endpoints, management capabilities, and security considerations | Medium |
| [06-entry-points.md](06-entry-points.md) | Main entry points to the application including index.php routing and PHP include files | Medium |
| [07-configuration.md](07-configuration.md) | Configuration files including .htaccess rewrite rules and deployment methods | Low |

## System Overview

The KIIT Kafe Campus 25 Ordering System is a web-based application designed to handle user ordering, cart management, checkout, and admin management for a campus cafe. The application follows a modern single-page application (SPA) approach with PHP backend and vanilla JavaScript frontend.

### Key Features
- User authentication (login/signup/forgot password)
- Menu browsing with search, filtering, and sorting
- Shopping cart with quantity management
- Checkout process with Cash and UPI payment options
- Order tracking and invoice generation
- Admin dashboard for menu and order management
- Responsive design for mobile and desktop use
- Real-time stock availability checking

### Technology Stack
- **Backend:** PHP 7.x+ with PDO for database access
- **Frontend:** HTML5, CSS3 (custom utility-first framework), Vanilla JavaScript
- **Database:** MySQL/MariaDB
- **Server:** Apache with mod_rewift (via .htaccess)
- **Dependencies:** Google Fonts, Unsplash (for images)

## Getting Started

For setup and installation instructions, please refer to the main [README.md](../README.md) in the project root.

## Navigation

Each documentation file provides in-depth coverage of its respective topic. For understanding how the pieces work together, we recommend reading:

1. Start with [01-database.md](01-database.md) to understand the data model
2. Review [02-api.md](02-api.md) to see how the frontend interacts with the backend
3. Examine [03-includes.md](03-includes.md) and [04-frontend.md](04-frontend.md) for UI implementation details
4. Check [06-entry-points.md](06-entry-points.md) to understand application flow
5. Refer to [05-admin.md](05-admin.md) for administrative functionality
6. See [07-configuration.md](07-configuration.md) for deployment considerations

## Contributing

When making changes to the system, please update the relevant documentation files to keep them in sync with the codebase.

## License

This project is developed for educational purposes within the KIIT University environment.

---
*Documentation generated as part of the KIIT Kafe Campus 25 Ordering System*