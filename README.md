Inventory Management System – Frontend
🚀 Quick Start
Install dependencies
npm install
Run the app
npm run dev

App will run at:

http://localhost:5173
Run all tests
npx vitest run
Run tests in watch mode
npx vitest

Summary

This is the frontend for my Inventory Management System that I built with React. It allows users to manage inventory items, track stock levels, and view stock history.

My app connects to a Django REST API backend and supports the following features :

User registration and login
Creating, editing, and deleting items
Searching and filtering inventory
Viewing low-stock items
Viewing stock history (audit log)

Architecture

The project follows a 3-layer architecture I have based this architcure on what we where provided in the assignment docs :

Frontend (React) → UI and user interaction
Backend (Django API) → business logic and validation
Database (PostgreSQL) → data storage

The frontend only communicates with the backend via API requests as required in the assignment.

 Authentication

My Authentication is handled using JWT tokens:

Login via /api/token/
Tokens stored in localStorage
Protected routes to prevent unauthorised access
Logout clears tokens

My Pages
Login & Register Pages
Users can create accounts and log in
Displays errors and loading states

Dashboard Paged 
Displays inventory items
Supports:
Search by name
Filter by category
Low-stock filtering
Allows item deletion
Add Item
Form to create new items
Edit Item
Updates existing items

Stock History Page
Displays stock changes (audit log)
Shows item, change amount, user, and timestamp

API Integration

API requests are handled using Axios:

api.get("items/");
api.post("items/");
api.put("items/:id/");
api.delete("items/:id/");

JWT tokens are automatically added to requests.

 
 Testing

Frontend tests are written using:

Vitest
React Testing Library

Tests cover:

Rendering pages
Form input handling
API calls (mocked)
Error handling
Navigation


🔗 Backend Setup

Make sure the backend is running at:

http://127.0.0.1:8000

The frontend expects API routes under:

http://127.0.0.1:8000/api/
