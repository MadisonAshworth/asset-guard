# AssetGuard

AssetGuard is an offline-first asset and note management application built using Next.js, TypeScript, RxDB, IndexedDB and Supabase. The application allows users to create, edit and manage notes and tasks while supporting synchronisation between local storage and cloud storage.

The system was developed to demonstrate modern web application development techniques including authentication, role-based access control, offline-first architecture, synchronisation and automated testing.

---

# Technology Stack

AssetGuard was developed using a modern web development stack designed to support offline-first functionality, cloud synchronisation and secure user authentication.

## Frontend

### Next.js

Next.js was used as the primary web application framework. It provides routing, page rendering, development tooling and integration with React.

Key benefits:

- Fast development workflow
- File-based routing
- TypeScript support
- Optimised production builds

### React

React was used to build reusable user interface components and manage application state.

Key benefits:

- Component-based architecture
- Efficient rendering
- Strong ecosystem support
- Reusable UI components

### TypeScript

TypeScript was used throughout the project to improve code quality and maintainability through static type checking.

Key benefits:

- Type safety
- Improved developer experience
- Better IDE support
- Reduced runtime errors

---

## Database Technologies

### Supabase

Supabase serves as the cloud backend for AssetGuard.

Responsibilities:

- User authentication
- Cloud data storage
- Role management
- Synchronisation target for offline data

Tables used:

```text
profiles
items
```

---

# Features

## Authentication

- User authentication using Supabase Authentication
- Protected routes
- Secure login and logout functionality

## Item Management

Users can:

- Create notes
- Create tasks
- Edit owned items
- Delete owned items
- View previously created items

## Role-Based Access Control

### Standard Users

- Create notes and tasks
- Edit their own items
- Delete their own items
- View only their own items

### Administrators

- View all items
- Delete any item
- Manage application data across users

---

## Offline-First Functionality

AssetGuard continues functioning while offline by using:

- RxDB
- IndexedDB

Users can:

- Create data offline
- Access previously synchronised data
- Continue working without an internet connection

When connectivity is restored, synchronisation occurs automatically.

---

## Synchronisation

The application synchronises data between:

```text
IndexedDB (RxDB)
        ⇅
     Supabase
```

Synchronisation supports:

- Item creation
- Item updates
- Item deletion

Deleted records are stored as:

```text
deleted = true
```

within Supabase to support synchronisation across multiple devices.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript

## Database

- Supabase
- RxDB
- IndexedDB

## Authentication

- Supabase Authentication

## Testing

- Vitest
- React Testing Library

---

# Project Structure

# Project Structure

```text
asset-guard/
├── public/
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── hooks/
│   │   └── useSync.ts
│   │
│   ├── lib/
│   │   ├── database.ts
│   │   ├── db.ts
│   │   └── supabase.ts
│   │
│   ├── services/
│   │   ├── auth.ts
│   │   ├── items.ts
│   │   └── profile.ts
│   │
│   ├── tests/
│   │   ├── components/
│   │   │   ├── home.test.tsx
│   │   │   └── login.test.tsx
│   │   │
│   │   └── unit/
│   │       ├── crud.test.ts
│   │       ├── items.test.ts
│   │       ├── profile.test.ts
│   │       ├── role.test.ts
│   │       └── sync.test.ts
│   │
│   └── types/
│       └── item.ts
│
├── .env.local
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next-env.d.ts
├── next-pwa.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd asset-guard
```

Install dependencies:

```bash
npm install
```

---

# Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Replace the values with your Supabase project credentials.

---

# Running the Application

Start the development server:

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

---

# Testing

Run all tests:

```bash
npm test
```

Run coverage reporting:

```bash
npx vitest run --coverage
```

---

# Automated Test Results

Automated testing was conducted using Vitest and React Testing Library.

### Test Suites

- CRUD Operations
- Item Validation
- Profile Validation
- Role Permissions
- Synchronisation Logic
- Login Component
- Home Component

### Results

```text
Test Files: 7 Passed
Tests: 21 Passed
Failures: 0
```

### Coverage

```text
Statements: 52.38%
Branches: 25%
Functions: 50%
Lines: 52.38%
```

---

# Testing Strategy

## Unit Testing

Unit tests were used to verify:

- CRUD operations
- Role permissions
- User profile handling
- Synchronisation behaviour
- Item validation

All unit tests used mock data and did not modify the live database.

---

## Component Testing

Component testing verified:

### Login Page

- Application title renders
- Email field renders
- Password field renders
- Login button renders

### Home Page

- Component loads successfully

External dependencies such as Supabase were mocked during testing.

---

## User Testing

User testing was conducted to verify:

- Authentication
- CRUD operations
- Synchronisation
- Role-based permissions
- Database persistence

Database verification was performed directly within Supabase to confirm records were correctly stored and synchronised.

---

# Known Behaviour

AssetGuard uses logical deletion for synchronisation.

When a user deletes an item:

```text
IndexedDB → Removed
Supabase → deleted = true
```

This approach allows deletion events to be synchronised across devices and prevents deleted records from reappearing.

---

# Future Improvements

Potential future enhancements include:

- Real-time collaboration
- Conflict resolution for synchronisation
- File attachments
- Push notifications
- Audit logging
- Expanded test coverage
- Advanced administrative controls

---

# Author

Madison Ashworth

Software Development Project

AssetGuard
