# Campus Grade Flow

> **A fun ride, but the journey ends here!**
>
> Thank you for checking out this project. I truly enjoyed building Campus Grade Flow, but I am no longer maintaining or working on it. Feel free to explore, learn, or fork it for your own use!

---

## About Campus Grade Flow

Campus Grade Flow is a modern, full-featured university grade management system designed to streamline academic administration for students, professors, and administrators. Built with a focus on usability, flexibility, and real-world academic workflows, it provides a robust platform for managing grades, modules, filières (academic tracks), and more.

### Key Features

- **Role-Based Dashboards**: Distinct interfaces and permissions for Administrators, Professors, and Students.
- **Grade Management**: Enter, edit, and finalize grades for each student, module, semester, and academic year. Supports grade history and filtering.
- **Filière & Module Management**: Dynamically manage academic tracks (filières) and modules, with filtering by level, semester, and more.
- **Student & Professor Management**: Add, edit, and manage student and professor records, including assignment to modules and filières.
- **Transcript Generation**: Students can view and download their academic transcripts by semester and year.
- **Advanced Filtering**: Filter grades and records by filière, level, semester, module, and academic year.
- **Secure Authentication**: Role-based login and access control.
- **Modern UI**: Built with React, shadcn-ui, and Tailwind CSS for a clean, responsive experience.

### User Roles

- **Administrators**: Manage all aspects of the system—departments, modules, filières, students, professors, grades, reports, and system settings.
- **Professors**: Enter and update grades for their assigned modules and classes.
- **Students**: View grades, download transcripts, and manage their profile.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) & npm
- (Optional) [Supabase](https://supabase.com/) account for backend/database

### Setup

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd campus-grade-flow

# 2. Install dependencies
npm install

# 3. Configure environment variables
# (Set up your Supabase keys in a .env file if needed)

# 4. Start the development server
npm run dev
```

### Editing the Code
You can use your favorite IDE, edit directly on GitHub, or use cloud environments like GitHub Codespaces. See the original instructions below for more details.

---

## Supabase Setup

To use this project, you must set up a Supabase backend with the required schema:

1. **Create a Supabase project** at [supabase.com](https://supabase.com/).
2. **Run the migration SQL** in `supabase/migrations/001_init.sql` using the Supabase SQL editor to create all required tables and relationships.
3. **Configure environment variables** in a `.env` file:
   ```
   # Frontend (Vite/React)
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Backend/admin scripts (optional, for server-side or admin use)
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required for the frontend.
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are only needed for backend scripts or admin tools.
   - **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend or commit it to public repositories.**
4. **See [`DATABASE.md`](DATABASE.md)** for a full description of the schema, tables, and relationships.

---

## Technologies Used
- **Vite** (build tool)
- **TypeScript**
- **React**
- **shadcn-ui** (UI components)
- **Tailwind CSS**
- **Supabase** (backend/database)

---

## License & Status
This project is no longer maintained. You are welcome to fork, modify, or use it as you wish. No support or updates will be provided.

---

*Thanks for stopping by, and happy coding!*
