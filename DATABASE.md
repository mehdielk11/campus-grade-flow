# Database Schema Documentation

This document describes the database schema for **Campus Grade Flow**. All tables are created in Supabase/Postgres. See `supabase/migrations/001_init.sql` for the migration script.

---

## Table: filieres
Academic tracks (departments or programs).

| Column      | Type      | Description                                 |
|-------------|-----------|---------------------------------------------|
| id          | uuid      | Primary key                                 |
| code        | text      | Unique code for the filière (e.g., IISI3)   |
| name        | text      | Display name                                |
| formation   | text      | Track type (e.g., 'Ingénierie', 'Management et Finance') |
| degree      | text      | Degree type (e.g., 'BAC+3', 'BAC+5')        |
| levels      | integer[] | Array of levels (e.g., [1,2,3])             |
| created_at  | timestamp | Creation timestamp                          |
| updated_at  | timestamp | Last update timestamp                       |

---

## Table: admins
System administrators and super admins.

| Column      | Type      | Description                                 |
|-------------|-----------|---------------------------------------------|
| id          | uuid      | Primary key                                 |
| email       | text      | Unique email                                |
| password    | text      | Hashed password                             |
| first_name  | text      | First name                                  |
| last_name   | text      | Last name                                   |
| role        | text      | 'super_admin' or 'administrator'            |
| status      | text      | Account status (default: 'Active')          |
| created_at  | timestamp | Creation timestamp                          |
| updated_at  | timestamp | Last update timestamp                       |

---

## Table: professors
Faculty members who teach modules.

| Column        | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| id            | uuid      | Primary key                                 |
| professor_id  | text      | Unique professor code/ID                    |
| email         | text      | Unique email                                |
| password      | text      | Hashed password                             |
| first_name    | text      | First name                                  |
| last_name     | text      | Last name                                   |
| status        | text      | Account status (default: 'Active')          |
| specialization| text      | Area of expertise (optional)                |
| hire_date     | date      | Date of hire (optional)                     |
| created_at    | timestamp | Creation timestamp                          |
| updated_at    | timestamp | Last update timestamp                       |

---

## Table: students
Student records.

| Column         | Type      | Description                                 |
|----------------|-----------|---------------------------------------------|
| id             | uuid      | Primary key                                 |
| student_id     | text      | Unique student code/ID                      |
| email          | text      | Unique email                                |
| password       | text      | Hashed password                             |
| first_name     | text      | First name                                  |
| last_name      | text      | Last name                                   |
| filiere        | text      | Filière code (references filieres.code)     |
| level          | integer   | Academic level (e.g., 1, 2, 3, 4, 5)        |
| status         | text      | Account status (default: 'Active')          |
| enrollment_date| date      | Date of enrollment (optional)               |
| created_at     | timestamp | Creation timestamp                          |
| updated_at     | timestamp | Last update timestamp                       |

---

## Table: modules
Academic modules/courses.

| Column         | Type      | Description                                 |
|----------------|-----------|---------------------------------------------|
| id             | uuid      | Primary key                                 |
| code           | text      | Unique module code                          |
| name           | text      | Module name                                 |
| description    | text      | Description (optional)                      |
| filiere        | text      | Filière code (references filieres.code)     |
| academic_level | text      | Academic level (e.g., 'Level 3')            |
| semester       | text      | Semester (e.g., 'Semester 1')               |
| professor_id   | uuid      | Professor (references professors.id)        |
| capacity       | integer   | Max students (optional)                     |
| status         | text      | 'active' or 'inactive'                      |
| cc_percentage  | integer   | CC grade weight (default: 30)               |
| exam_percentage| integer   | Exam grade weight (default: 70)             |
| created_at     | timestamp | Creation timestamp                          |
| updated_at     | timestamp | Last update timestamp                       |

---

## Table: grades
Current/in-progress grades for students per module.

| Column       | Type      | Description                                 |
|--------------|-----------|---------------------------------------------|
| id           | uuid      | Primary key                                 |
| student_id   | uuid      | Student (references students.id)            |
| module_id    | uuid      | Module (references modules.id)              |
| cc_grade     | numeric   | Continuous assessment grade (optional)      |
| exam_grade   | numeric   | Exam grade (optional)                       |
| module_grade | numeric   | Final module grade (optional)               |
| created_at   | timestamp | Creation timestamp                          |
| updated_at   | timestamp | Last update timestamp                       |

- Unique constraint: (student_id, module_id)

---

## Table: grade_history
Finalized grades for each student/module/academic year/semester.

| Column        | Type      | Description                                 |
|---------------|-----------|---------------------------------------------|
| id            | uuid      | Primary key                                 |
| student_id    | uuid      | Student (references students.id)            |
| module_id     | uuid      | Module (references modules.id)              |
| academic_year | text      | Academic year (e.g., '2023-2024')           |
| semester      | text      | Semester (e.g., 'Semester 1')               |
| cc_grade      | numeric   | Continuous assessment grade (optional)      |
| exam_grade    | numeric   | Exam grade (optional)                       |
| module_grade  | numeric   | Final module grade (optional)               |
| created_at    | timestamp | Creation timestamp                          |
| updated_at    | timestamp | Last update timestamp                       |

- Unique constraint: (student_id, module_id, academic_year, semester)

---

## Relationships
- `students.filiere` and `modules.filiere` reference `filieres.code`.
- `modules.professor_id` references `professors.id`.
- `grades.student_id` and `grade_history.student_id` reference `students.id`.
- `grades.module_id` and `grade_history.module_id` reference `modules.id`.

---

For more details, see the migration SQL file or contact the original author. 