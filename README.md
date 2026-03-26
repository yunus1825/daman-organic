# Daman Organic

Daman Organic is a comprehensive full-stack ecosystem consisting of a customer-facing web application, a secure administrative dashboard, and a robust backend API.

## 📂 Project Structure

This repository is organized into three main directories, each serving a distinct part of the platform.

### 1. `Daman-web/` (Customer Web Frontend)

The customer-facing frontend, built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**.

- `src/components/`: Reusable UI components for the customer app.
- `src/pages/`: React components representing individual routes/pages.
- `src/redux/`: Redux toolkit state slices and store configuration.
- `src/hooks/`: Custom React hooks.
- `src/features/`: Feature-specific logic or components.
- `src/utils/`: Helper functions and utilities.
- `src/constants/`: App-wide constants and configuration.
- `src/assets/`: Static assets like images and icons.

### 2. `Daman-admin/` (Admin Dashboard)

The administrative dashboard for managing the platform, built with **React 19**, **Vite**, **Ant Design**, and **Tailwind CSS v4**.

- `src/components/`: Reusable UI components tailored for the admin interface.
- `src/pages/`: Admin portal views and routes.
- `src/redux/`: State management for admin data.
- `src/auth/`: Authentication logic and guards.
- `src/context/`: React Context providers for global dashboard state.
- `src/utils/`: Admin-specific helper functions.
- `src/assets/`: Static assets.

### 3. `Daman-backend/` (Node.js API)

The backend REST API, utilizing **Node.js**, **Express**, and **MongoDB**.

- `src/controllers/`: Request handling logic and business rules.
- `src/routes/`: API route definitions bridging endpoints to controllers.
- `src/models/`: Mongoose database schemas and models.
- `src/middleware/`: Express middleware (e.g., authentication, error handling).
- `src/db/`: Database connection setup.
- `src/utils/`: Backend utilities and helpers.
- `src/app.js`: Main Express application entry point.

---

## 🚀 Getting Started

Follow these steps to set up and run thee different parts of the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended )
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
- Git

### 1. Setup Backend (`Daman-backend`)

The backend is the core API that serves both the admin and web frontends.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Daman-backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Reference `.env.example` and create a `.env` file with your config values:
   ```bash
   cp .env.example .env
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Setup Admin Dashboard (`Daman-admin`)

The admin panel allows platform management.

1. Open a new terminal and navigate to the admin directory:
   ```bash
   cd Daman-admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   _(Accessible via browser at the URL provided by Vite in the terminal window, e.g. `http://localhost:5173`)_

### 3. Setup Customer Web App (`Daman-web`)

The main web application for end users.

1. Open a new terminal and navigate to the web directory:
   ```bash
   cd Daman-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration if required:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   _(Accessible via browser at the URL provided by Vite in the terminal window)_

---

## 🛠 Tech Stack

- **Frontend Frameworks**: React 19, Vite
- **Styling**: Tailwind CSS v4, Ant Design
- **State Management**: Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Integrations**: Firebase Admin, AWS SDK, Razorpay
