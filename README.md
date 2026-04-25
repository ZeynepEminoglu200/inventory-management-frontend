# My Inventory Management System – Frontend

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

The app will be available at:

```
http://localhost:5173
```

### Run Tests

Run all tests once:
```bash
npx vitest run
```

Run tests in watch mode:
```bash
npx vitest
```

---

## Overview

This project is the frontend for My Inventory Management System which I built using React.

It allows users to manage inventory items, track stock levels, and view stock history through a user-friendly interface.

The frontend communicates with a Django REST API backend and provides the following functionality:

- User registration and login  
- Creating, editing, and deleting inventory items  
- Searching and filtering items  
- Identifying low-stock items  
- Viewing stock history (audit log)  

---

## Architecture

The system follows a three-layer architecture based on the provided guide in the assignement brief :

### Frontend (React)
Handles UI, routing, and user interaction.

### Backend (Django REST API)
Handles authentication, business logic, and validation.

### Database (PostgreSQL)
Stores users, items, categories, and stock logs.

The frontend does not directly access the database and interacts only through API endpoints.

---

## Authentication

Authentication is implemented using JWT (JSON Web Tokens).

### Features

- Login via:
  ```
  /api/token/
  ```
- Tokens stored in localStorage  
- Protected routes restrict access to authenticated users  
- Logout clears stored tokens  

---

## Pages and Features

### Login and Register
- Users can create accounts and log in  
- Displays validation errors and loading states  

### Dashboard
- Displays inventory items  
- Supports:
  - Search by item name  
  - Filter by category  
  - Low-stock filtering  
- Allows item deletion  

### Add Item
- Form to create new inventory items  

### Edit Item
- Updates existing inventory items  
- Pre-fills form with current data  

### Stock History
- Displays stock changes (audit log)  
- Shows item name, change amount, user, and timestamp  

---

## API Integration

All API requests are handled using Axios.

### Example endpoints
```javascript
api.get("items/");
api.post("items/");
api.put("items/:id/");
api.delete("items/:id/");
```

### Key features
- Centralised API service  
- JWT token automatically attached to requests  
- Error handling for failed requests  

---

## Testing

Frontend tests are implemented using:

- Vitest  
- React Testing Library  

### Tests cover

- Page rendering  
- Form input handling  
- API calls (mocked)  
- Error handling  
- Navigation flows  

---

## Backend Setup

Ensure the backend is running at:

```
http://127.0.0.1:8000
```

The frontend expects API routes under:

```
http://127.0.0.1:8000/api/
```

---

