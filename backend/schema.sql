-- ============================================
-- CAAP 2.0 - MIT ADT University Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DEPARTMENTS
-- ============================================
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  hod_name TEXT,
  established_year INTEGER,
  total_students INTEGER DEFAULT 0,
  total_faculty INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS (Students, Faculty, Admin)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'faculty', 'admin')) NOT NULL,
  university_id TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES departments(id),
  phone TEXT,
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  faculty_id UUID REFERENCES users(id),
  credits INTEGER DEFAULT 3,
  semester INTEGER,
  year INTEGER,
  schedule TEXT,
  room TEXT,
  max_students INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STUDENT-COURSE ENROLLMENT
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ============================================
-- ATTENDANCE
-- ============================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

-- ============================================
-- ASSIGNMENTS
-- ============================================
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES users(id),
  due_date TIMESTAMPTZ NOT NULL,
  max_marks INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ASSIGNMENT SUBMISSIONS
-- ============================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  file_url TEXT,
  marks_obtained NUMERIC(5,2),
  feedback TEXT,
  status TEXT CHECK (status IN ('pending', 'submitted', 'graded', 'late')) DEFAULT 'pending',
  UNIQUE(assignment_id, student_id)
);

-- ============================================
-- GRADES / RESULTS
-- ============================================
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL,
  marks_obtained NUMERIC(5,2),
  max_marks NUMERIC(5,2) DEFAULT 100,
  grade TEXT,
  grade_points NUMERIC(3,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, semester)
);

-- ============================================
-- FEES
-- ============================================
CREATE TABLE fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT CHECK (status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
  receipt_no TEXT,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTICES
-- ============================================
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('exam', 'event', 'academic', 'holiday', 'result', 'general')) DEFAULT 'general',
  target_role TEXT CHECK (target_role IN ('all', 'student', 'faculty', 'admin')) DEFAULT 'all',
  created_by UUID REFERENCES users(id),
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEED DATA - Departments
-- ============================================
INSERT INTO departments (name, code, hod_name, established_year, total_students, total_faculty) VALUES
  ('Computer Science & Engineering', 'CSE', 'Dr. Rajesh Kumar', 2008, 480, 24),
  ('Information Technology', 'IT', 'Dr. Priya Sharma', 2010, 360, 18),
  ('Electronics & Communication', 'ECE', 'Dr. Anil Mehta', 2008, 320, 16),
  ('Mechanical Engineering', 'MECH', 'Dr. Suresh Patil', 2008, 280, 14),
  ('Civil Engineering', 'CIVIL', 'Dr. Ramesh Joshi', 2009, 240, 12);

-- ============================================
-- SEED DATA - Users (password: "password123" -> bcrypt hash)
-- ============================================
INSERT INTO users (name, email, password_hash, role, university_id, phone, join_date) VALUES
  ('Admin User', 'admin@mitadt.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'ADM001', '9876543210', '2020-01-01'),
  ('Dr. Sarah Johnson', 'faculty@mitadt.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', 'FAC001', '9876543211', '2020-06-01'),
  ('Rahul Sharma', 'student@mitadt.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'STU2021001', '9876543212', '2021-07-15');

-- ============================================
-- VIEW: Attendance Summary per student per course
-- ============================================
CREATE OR REPLACE VIEW attendance_summary AS
SELECT
  a.student_id,
  a.course_id,
  c.name AS course_name,
  c.code AS course_code,
  COUNT(*) AS total_classes,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present_count,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_count,
  COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_count,
  ROUND(
    COUNT(CASE WHEN a.status IN ('present','late') THEN 1 END) * 100.0 / COUNT(*), 1
  ) AS attendance_percentage
FROM attendance a
JOIN courses c ON c.id = a.course_id
GROUP BY a.student_id, a.course_id, c.name, c.code;
