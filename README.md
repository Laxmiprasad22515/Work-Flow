# Work Flow

A modern Kanban board web application for organizations to manage tasks, employees, and project progress. Built with React, Vite, Tailwind CSS, and Supabase for authentication and data storage.

## Features

- **Kanban Board**: Visualize tasks in columns (To Do, In Progress, Completed, Approved) for both employees and admins.
- **Role-based Access**: Separate dashboards and features for Admins and Employees.
- **Admin Dashboard**:
  - View organization-wide stats and task progress.
  - Approve or reject employee registrations.
  - Add and assign tasks to employees.
  - View and manage all organization employees and tasks.
- **Employee Dashboard**:
  - View and manage personal tasks.
  - Track task status and progress.
  - View organization and personal information.
- **Authentication**: Secure login and signup with pending approval for new employees.
- **Organization Support**: Multiple organizations with unique admins and employees.
- **Responsive UI**: Beautiful, modern, and mobile-friendly interface using Tailwind CSS and Framer Motion.

## Tech Stack

- [React](https://react.dev/) (with React Router)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (auth & database)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Radix UI](https://www.radix-ui.com/) (UI primitives)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase project (see below)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/laxmiprasad22515/work-flow.git
   cd work-flow
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Configure Supabase:**
   - Create a [Supabase](https://supabase.com/) project.
   - Set up tables for `admins`, `employees`, and `tasks` as per the app's needs.
   - Copy your Supabase URL and anon/public key.
   - Create a `.env` file in the root directory and add:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
4. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` by default.

## Project Structure

- `src/` — Main source code
  - `components/` — Reusable UI and feature components
  - `contexts/` — React Contexts for Auth and Task state
  - `pages/` — Route-based pages (Admin, Employee, Home, Login, etc.)
  - `config/` — Organization and admin configuration
  - `lib/` — Supabase client and utilities
  - `services/` — API and data service functions
  - `assets/` — Static assets (logo, images)
- `public/` — Static public files
- `index.html` — Main HTML entry

## Customization
- **Organizations**: Edit `src/config/organizations.jsx` to add or modify organizations and admin users.
- **Styling**: Tailwind CSS is fully customizable via `tailwind.config.js` and `src/index.css`.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build



---

*Work Flow — Streamline your team's productivity with a beautiful, modern Kanban board.*
