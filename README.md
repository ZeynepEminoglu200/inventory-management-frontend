# Inventory Management System – Frontend

## Overview

This project is the frontend for the Inventory Management System, built using React and Vite. It provides a user interface for managing inventory items, tracking stock levels, and viewing stock history through a REST API.

The frontend communicates with a Django REST API backend and is designed following enterprise software engineering principles, including separation of concerns, secure authentication, and modular architecture.

---

## Quick Start

### Install dependencies
```bash
npm install
```

### Run the application
```bash
npm run dev
```

The app will run at:

```
http://localhost:5173
```

---

## Running Tests

Run all tests:
```bash
npx vitest run
```

Run tests in watch mode:
```bash
npx vitest
```

---

## Usage

Once the application is running:

1. Register a new user account  
2. Log in using your credentials  
3. Access the dashboard to manage inventory items  
4. Create, edit, and delete items  
5. Apply filters and search functionality  
6. View stock history and profile information  

---

## Architecture

The system follows a three-layer architecture:

### Frontend (React)
- Handles user interface and user interaction
- Manages routing using React Router
- Communicates with backend via API calls

### Backend (Django REST API)
- Handles authentication, validation, and business logic
- Exposes RESTful endpoints

### Database (PostgreSQL)
- Stores users, items, categories, and stock logs

The frontend does not directly interact with the database and communicates exclusively through API endpoints.

---

## Authentication

Authentication is implemented using JSON Web Tokens (JWT).

### Features
- Login via `/api/token/`
- Token stored in `localStorage`
- Axios interceptor automatically attaches token to requests
- Protected routes restrict access to authenticated users
- Logout clears authentication tokens

### Example (Axios interceptor)
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Pages and Features

### Login and Register
- User authentication and account creation
- Displays validation and error messages
- Loading state handling

### Dashboard
- Displays inventory items
- Supports:
  - Search by name
  - Filter by category
  - Low-stock filtering
- Allows deletion of items

### Add Item
- Form-based item creation
- Client-side validation

### Edit Item
- Pre-populated form with existing data
- Allows updating item details

### Stock History
- Displays audit log of stock changes
- Shows item, change amount, user, and timestamp

### Profile Page
- View and update user details
- Upload profile image
- Demonstrates multipart form handling

---

## API Integration

All API requests are handled using a centralised Axios service.

### Example endpoints
```javascript
api.get("items/");
api.post("items/");
api.put("items/:id/");
api.delete("items/:id/");
```

### Key Features
- Centralised API configuration
- Automatic JWT handling
- Error handling and response mapping
- Environment-based API URL configuration

---

## Testing

Frontend testing is implemented using:

- Vitest
- React Testing Library

### Test Coverage
- Page rendering
- Form interactions
- API request handling (mocked)
- Error and loading states
- Navigation and routing

Tests focus on user behaviour rather than implementation details, aligning with best practices for frontend testing.

---

## Deployment

The frontend is deployed on Render as a static site.

### Key Deployment Features
- Environment variables used for API configuration
- React Router rewrite rule enabled for client-side routing
- Separation between frontend and backend services
- Production API URL configured using:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/
```

### Rewrite Rule (React Router)
```
Source: /*
Destination: /index.html
Action: Rewrite
```

This ensures all routes are handled correctly by the React application.

---

## Technical Decisions

- **React + Vite** chosen for fast development and modern tooling
- **Axios** used for centralised API communication
- **JWT authentication** used for stateless, scalable sessions
- **Separation of concerns** between frontend and backend
- **Reusable components** (e.g. ItemForm) to reduce duplication
- **Environment-based configuration** for deployment flexibility

These decisions align with enterprise development practices and support maintainability and scalability.

---

## Backend Requirements

Ensure the backend is running at:

```
http://127.0.0.1:8000
```

The frontend expects API routes under:

```
http://127.0.0.1:8000/api/
```

---

## AI Usage

Generative AI tools were used to support the development of this project in the following ways:

- Assisting with debugging errors and resolving issues
- Explaining concepts related to Django, React, and API integration
- Suggesting improvements for code structure and testing
- Helping draft documentation and refine explanations

All AI-generated suggestions were reviewed, tested, and adapted before inclusion in the final implementation. I maintain full understanding and ownership of all submitted code.

---

## Summary

This frontend demonstrates:

- Secure JWT-based authentication
- Full CRUD functionality for inventory management
- Integration with a RESTful API backend
- Modular and maintainable architecture
- Automated frontend testing
- Production deployment using environment configuration

The system reflects enterprise-level design principles and provides a scalable foundation for further development.
