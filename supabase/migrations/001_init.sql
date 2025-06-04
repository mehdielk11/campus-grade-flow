-- Campus Grade Flow: Initial Schema Migration

-- 1. Filières (Academic Tracks)
CREATE TABLE IF NOT EXISTS filieres (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    formation TEXT NOT NULL,
    degree TEXT NOT NULL,
    levels INTEGER[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Admins
CREATE TABLE IF NOT EXISTS admins (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'administrator')),
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Professors
CREATE TABLE IF NOT EXISTS professors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    professor_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    specialization TEXT,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Students
CREATE TABLE IF NOT EXISTS students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    filiere TEXT REFERENCES filieres(code),
    level INTEGER,
    status TEXT NOT NULL DEFAULT 'Active',
    enrollment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Modules
CREATE TABLE IF NOT EXISTS modules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    filiere TEXT REFERENCES filieres(code),
    academic_level TEXT,
    semester TEXT,
    professor_id uuid REFERENCES professors(id),
    capacity INTEGER,
    status TEXT DEFAULT 'active',
    cc_percentage INTEGER DEFAULT 30,
    exam_percentage INTEGER DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Grades (current/in-progress)
CREATE TABLE IF NOT EXISTS grades (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES students(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    cc_grade NUMERIC,
    exam_grade NUMERIC,
    module_grade NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, module_id)
);

-- 7. Grade History (finalized grades per academic year/semester)
CREATE TABLE IF NOT EXISTS grade_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES students(id) ON DELETE CASCADE,
    module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    cc_grade NUMERIC,
    exam_grade NUMERIC,
    module_grade NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, module_id, academic_year, semester)
); 