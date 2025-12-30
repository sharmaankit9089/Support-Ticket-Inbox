## Support Ticket Inbox

A professional full-stack support management application built as part of a technical assignment. This project allows support agents to authenticate, manage customer inquiries via an inbox-style dashboard, and handle ticket updates through a contextual side-drawer interface.

The project focuses on backend correctness, professional frontend UX, and the implementation of real-world patterns like server-side pagination and optimistic state management.


## Setup Steps

Prerequisites
- Node.js (v18 or above recommended)
- PostgreSQL
- npm or yarn


1. Backend Setup

1.1 Navigate to the backend directory:

cd backend
npm install


1.2 Create a .env file in the backend folder:

PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5433/UGAssignment"
JWT_SECRET=supersecretkey


1.3 Start the server:

npm run dev
The backend will run on http://localhost:5000



2. Frontend Setup

2.1 Navigate to the frontend directory:

cd frontend
npm install


2.2 Start the development server:

npm run dev

The frontend will run on http://localhost:5173




## API List


1. Authentication

Method           Endpoint                   Description

POST           /auth/register         Register a new support agent

POST           /auth/login           Login and receive a JWT token


2. Tickets

Method          Endpoint                    Description

GET            /tickets       Get paginated list of tickets (supports filters/search)

GET           /tickets/:id         Get full details of a single ticket

PATCH         /tickets/:id          Update ticket status and priority

DELETE        /tickets/:id                Delete a ticket


3. Internal Notes

Method          Endpoint                      Description

GET         /tickets/:id/notes       Get all internal notes for a specific ticket

POST        /tickets/:id/notes       Add a new internal note to a ticket




## Technical Implementation


1. Optimistic Updates

- To provide a fast and smooth user experience, ticket status and priority updates are handled using React Query mutations:

- Immediate Feedback: The UI reflects changes immediately before the API response is received.

- Error Handling: If an API request fails, the application uses React Query's onError callback to automatically roll back the UI to its previous state.

- Context Preservation: This ensures the agent isn't waiting for "loading" spinners during routine status updates.



2. Auto Refresh

- Real-time-like behavior is achieved through smart polling:

- Refetch Interval: The ticket inbox automatically refreshes every 10 seconds using React Query's refetchInterval.

- State Persistence: Pagination, active filters, and search queries are preserved during the refresh, ensuring the agent's workflow is never interrupted.

- Efficiency: Only the relevant data is fetched, avoiding full page reloads.




## Tradeoffs & Improvements


1. Tradeoffs

- Manual Validation: Validation is implemented manually within backend routes to keep the solution lightweight for this assignment, rather than introducing schema libraries like Zod or Joi.

- Polling vs. WebSockets: Auto-refresh was chosen over WebSockets to maintain a simpler backend architecture while still meeting the requirement for "live" data.

- Role Scoping: A single user role (support agent) is assumed for the scope of this project.

- UI Design: The interface prioritizes clarity, readability (color-coded badges),    and functionality over complex aesthetic styling.



2. Possible Improvements

- Schema Validation: Implement Zod or Joi for more robust request body validation.

- RBAC: Add Role-Based Access Control (e.g., Admin vs. Agent).

- Real-time Communication: Integrate WebSockets for instant, event-driven updates.

- Assignment Logic: Add the ability to assign specific tickets to agents.

- Audit Trails: Implement activity logs to track the history of changes made to each ticket.