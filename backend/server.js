const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'caap_mitadt_secret_2026';

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Demo Users ───────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { id: 'STU001', name: 'Arjun Mehta', email: 'student@mitadt.edu.in', password: bcrypt.hashSync('student123', 10), role: 'student', universityId: 'MIT2024CS001', department: 'Computer Science', semester: 5, batch: '2022-2026' },
  { id: 'FAC001', name: 'Dr. Priya Sharma', email: 'faculty@mitadt.edu.in', password: bcrypt.hashSync('faculty123', 10), role: 'faculty', universityId: 'MITFAC0042', department: 'Computer Science' },
  { id: 'ADM001', name: 'Rajesh Kumar', email: 'admin@mitadt.edu.in', password: bcrypt.hashSync('admin123', 10), role: 'admin', universityId: 'MITADM0001', department: 'Administration' },
];

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Access forbidden' });
  next();
};

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const { password: _, ...userInfo } = user;
    const token = jwt.sign({ ...userInfo }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: userInfo });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = DEMO_USERS.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...userInfo } = user;
  res.json({ user: userInfo });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ─── Student Routes ───────────────────────────────────────────────────────────
app.get('/api/student/profile', authenticate, authorize('student'), (req, res) => {
  res.json({ profile: { ...req.user, cgpa: 8.86, totalCredits: 78, semester: 5 } });
});

app.get('/api/student/courses', authenticate, authorize('student'), (req, res) => {
  res.json({ courses: [
    { id: 'C001', code: 'CS501', name: 'Machine Learning', credits: 4, faculty: 'Dr. Priya Sharma', schedule: 'Mon/Wed 9:00-10:30', room: 'A-301' },
    { id: 'C002', code: 'CS502', name: 'Cloud Computing', credits: 3, faculty: 'Prof. Rahul Gupta', schedule: 'Tue/Thu 11:00-12:30', room: 'A-302' },
    { id: 'C003', code: 'CS503', name: 'Software Engineering', credits: 4, faculty: 'Dr. Anjali Singh', schedule: 'Mon/Fri 2:00-3:30', room: 'B-201' },
  ]});
});

app.get('/api/student/attendance', authenticate, authorize('student'), (req, res) => {
  res.json({ attendance: [
    { courseId: 'C001', courseName: 'Machine Learning', total: 40, present: 36, absent: 3, late: 1, percentage: 90 },
    { courseId: 'C002', courseName: 'Cloud Computing',  total: 35, present: 28, absent: 6, late: 1, percentage: 80 },
    { courseId: 'C003', courseName: 'Software Engineering', total: 42, present: 38, absent: 4, late: 0, percentage: 90.5 },
  ]});
});

app.get('/api/student/grades', authenticate, authorize('student'), (req, res) => {
  res.json({ grades: [
    { courseId: 'C001', courseName: 'Machine Learning', internal: 42, external: 78, total: 120, grade: 'A', gpa: 9.0, semester: 5 },
    { courseId: 'C002', courseName: 'Cloud Computing', internal: 35, external: 65, total: 100, grade: 'B+', gpa: 8.0, semester: 5 },
    { courseId: 'C003', courseName: 'Software Engineering', internal: 45, external: 82, total: 127, grade: 'A+', gpa: 10.0, semester: 5 },
  ], cgpa: 8.86 });
});

app.get('/api/student/fees', authenticate, authorize('student'), (req, res) => {
  res.json({ fees: [
    { semester: 'Semester 5', amount: 85000, paid: 85000, due: 0, status: 'paid', dueDate: '2025-12-31' },
    { semester: 'Semester 6', amount: 88000, paid: 50000, due: 38000, status: 'partial', dueDate: '2026-06-30' },
  ]});
});

// ─── Faculty Routes ───────────────────────────────────────────────────────────
app.get('/api/faculty/courses', authenticate, authorize('faculty'), (req, res) => {
  res.json({ courses: [
    { id: 'C001', code: 'CS501', name: 'Machine Learning', enrolledCount: 62, semester: 5 },
    { id: 'C002', code: 'CS502', name: 'Cloud Computing',  enrolledCount: 58, semester: 5 },
    { id: 'C005', code: 'CS505', name: 'Database Systems', enrolledCount: 55, semester: 5 },
  ]});
});

app.post('/api/faculty/attendance', authenticate, authorize('faculty'), (req, res) => {
  const { courseId, date, records } = req.body;
  if (!courseId || !date || !records) return res.status(400).json({ error: 'Missing required fields' });
  res.json({ success: true, message: `Attendance saved for ${records.length} students on ${date}` });
});

app.post('/api/faculty/assignments', authenticate, authorize('faculty'), (req, res) => {
  const { title, courseId, dueDate, maxMarks, description } = req.body;
  if (!title || !courseId || !dueDate) return res.status(400).json({ error: 'Missing required fields' });
  res.json({ success: true, assignment: { id: 'NEW001', title, courseId, dueDate, maxMarks: maxMarks || 25, description, createdAt: new Date().toISOString() } });
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────
app.get('/api/admin/stats', authenticate, authorize('admin'), (req, res) => {
  res.json({ stats: { totalStudents: 1960, totalFaculty: 76, totalDepartments: 8, totalCourses: 192, atRiskStudents: 45, activeUsers: 1820 } });
});

app.get('/api/admin/users', authenticate, authorize('admin'), (req, res) => {
  res.json({ users: DEMO_USERS.map(({ password: _, ...u }) => u) });
});

app.post('/api/admin/notices', authenticate, authorize('admin'), (req, res) => {
  const { title, content, category, targetRoles } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  res.json({ success: true, notice: { id: 'N_NEW', title, content, category: category || 'general', targetRoles: targetRoles || ['student', 'faculty', 'admin'], publishedAt: new Date().toISOString(), publishedBy: req.user.name } });
});

app.get('/api/admin/reports/attendance', authenticate, authorize('admin'), (req, res) => {
  res.json({ report: { generated: new Date().toISOString(), data: [{ dept: 'CSE', avg: 87.3 }, { dept: 'ECE', avg: 82.1 }, { dept: 'ME', avg: 79.6 }] } });
});

// ─── Shared Routes ────────────────────────────────────────────────────────────
app.get('/api/notices', authenticate, (req, res) => {
  res.json({ notices: [
    { id: 'N001', title: '🎓 End Semester Exam Schedule Released', category: 'exam', publishedBy: 'Examination Department', publishedAt: '2026-04-25T10:00:00', targetRoles: ['student', 'faculty'] },
    { id: 'N002', title: '📚 Library Extended Hours During Exam Season', category: 'general', publishedBy: 'Library Administration', publishedAt: '2026-04-24T14:00:00', targetRoles: ['student', 'faculty'] },
    { id: 'N004', title: '🏆 National Hackathon Registration Open', category: 'event', publishedBy: 'Student Affairs', publishedAt: '2026-04-22T11:00:00', targetRoles: ['student', 'faculty', 'admin'] },
  ]});
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'CAAP 2.0 Backend — MIT ADT University' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 CAAP 2.0 Backend running at http://localhost:${PORT}`);
  console.log(`📚 MIT ADT University Academic Portal API`);
  console.log(`🔑 Health check: http://localhost:${PORT}/api/health\n`);
});
