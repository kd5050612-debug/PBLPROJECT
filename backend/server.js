const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── DB CONNECTION ────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) console.error('❌ DB connection error:', err.message);
  else console.log('✅ Connected to PostgreSQL database');
});

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const { rows } = await pool.query(
      `SELECT u.*, d.name as department_name, d.code as department_code
       FROM users u LEFT JOIN departments d ON d.id = u.department_id
       WHERE u.email = $1 AND u.is_active = true`,
      [email.toLowerCase()]
    );

    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password_hash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.university_id, u.phone, u.avatar, u.join_date,
              d.name as department_name, d.code as department_code
       FROM users u LEFT JOIN departments d ON d.id = u.department_id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COURSES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/courses', auth, async (req, res) => {
  try {
    let query, params;
    if (req.user.role === 'student') {
      query = `SELECT c.*, u.name as faculty_name, d.name as department_name
               FROM courses c
               JOIN enrollments e ON e.course_id = c.id AND e.student_id = $1
               LEFT JOIN users u ON u.id = c.faculty_id
               LEFT JOIN departments d ON d.id = c.department_id
               ORDER BY c.code`;
      params = [req.user.id];
    } else if (req.user.role === 'faculty') {
      query = `SELECT c.*, COUNT(e.id) as enrolled_count, d.name as department_name
               FROM courses c
               LEFT JOIN enrollments e ON e.course_id = c.id
               LEFT JOIN departments d ON d.id = c.department_id
               WHERE c.faculty_id = $1
               GROUP BY c.id, d.name ORDER BY c.code`;
      params = [req.user.id];
    } else {
      query = `SELECT c.*, u.name as faculty_name, COUNT(e.id) as enrolled_count, d.name as department_name
               FROM courses c
               LEFT JOIN users u ON u.id = c.faculty_id
               LEFT JOIN enrollments e ON e.course_id = c.id
               LEFT JOIN departments d ON d.id = c.department_id
               GROUP BY c.id, u.name, d.name ORDER BY c.code`;
      params = [];
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENDANCE ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/attendance/summary', auth, async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
    const { rows } = await pool.query(
      `SELECT * FROM attendance_summary WHERE student_id = $1`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/attendance', auth, async (req, res) => {
  try {
    const { course_id, date } = req.query;
    let query = `SELECT a.*, u.name as student_name, u.university_id
                 FROM attendance a JOIN users u ON u.id = a.student_id
                 WHERE 1=1`;
    const params = [];
    if (course_id) { params.push(course_id); query += ` AND a.course_id = $${params.length}`; }
    if (date) { params.push(date); query += ` AND a.date = $${params.length}`; }
    if (req.user.role === 'student') { params.push(req.user.id); query += ` AND a.student_id = $${params.length}`; }
    query += ' ORDER BY a.date DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/attendance', auth, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const { records, course_id, date } = req.body;
    // records = [{ student_id, status }]
    const results = [];
    for (const rec of records) {
      const { rows } = await pool.query(
        `INSERT INTO attendance (student_id, course_id, date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, course_id, date) DO UPDATE SET status = $4, marked_by = $5
         RETURNING *`,
        [rec.student_id, course_id, date, rec.status, req.user.id]
      );
      results.push(rows[0]);
    }
    res.json({ saved: results.length, records: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ASSIGNMENTS ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/assignments', auth, async (req, res) => {
  try {
    let query, params = [];
    if (req.user.role === 'student') {
      query = `SELECT a.*, c.name as course_name, c.code as course_code,
                      s.status as submission_status, s.marks_obtained, s.submitted_at
               FROM assignments a
               JOIN courses c ON c.id = a.course_id
               JOIN enrollments e ON e.course_id = c.id AND e.student_id = $1
               LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
               ORDER BY a.due_date`;
      params = [req.user.id];
    } else if (req.user.role === 'faculty') {
      query = `SELECT a.*, c.name as course_name, c.code as course_code,
                      COUNT(s.id) as submission_count
               FROM assignments a
               JOIN courses c ON c.id = a.course_id AND c.faculty_id = $1
               LEFT JOIN submissions s ON s.assignment_id = a.id
               GROUP BY a.id, c.name, c.code ORDER BY a.due_date DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT a.*, c.name as course_name, u.name as faculty_name
               FROM assignments a JOIN courses c ON c.id = a.course_id
               LEFT JOIN users u ON u.id = a.faculty_id ORDER BY a.created_at DESC`;
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/assignments', auth, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const { title, description, course_id, due_date, max_marks } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO assignments (title, description, course_id, faculty_id, due_date, max_marks)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, course_id, req.user.id, due_date, max_marks || 100]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GRADES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/grades', auth, async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
    const { rows } = await pool.query(
      `SELECT g.*, c.name as course_name, c.code as course_code, c.credits
       FROM grades g JOIN courses c ON c.id = g.course_id
       WHERE g.student_id = $1 ORDER BY g.semester, c.name`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FEES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/fees', auth, async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
    const { rows } = await pool.query(
      `SELECT * FROM fees WHERE student_id = $1 ORDER BY due_date DESC`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/fees/:id/pay', auth, requireRole('student', 'admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE fees SET status = 'paid', paid_date = CURRENT_DATE,
       receipt_no = 'RCP' || FLOOR(RANDOM()*900000+100000)::TEXT
       WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTICES ROUTES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/notices', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT n.*, u.name as created_by_name
       FROM notices n LEFT JOIN users u ON u.id = n.created_by
       WHERE n.target_role = 'all' OR n.target_role = $1
       ORDER BY n.created_at DESC LIMIT 50`,
      [req.user.role]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/notices', auth, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const { title, content, category, target_role, is_important } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO notices (title, content, category, target_role, created_by, is_important)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, content, category || 'general', target_role || 'all', req.user.id, is_important || false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/notices/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN - USERS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/admin/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = `SELECT u.id, u.name, u.email, u.role, u.university_id, u.phone,
                        u.is_active, u.join_date, d.name as department_name
                 FROM users u LEFT JOIN departments d ON d.id = u.department_id
                 WHERE 1=1`;
    const params = [];
    if (role) { params.push(role); query += ` AND u.role = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.university_id ILIKE $${params.length})`; }
    query += ' ORDER BY u.created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const { name, email, role, university_id, department_id, phone, password } = req.body;
    const password_hash = await bcrypt.hash(password || 'password123', 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, university_id, department_id, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, university_id`,
      [name, email.toLowerCase(), password_hash, role, university_id, department_id, phone]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email or University ID already exists' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/admin/users/:id/toggle', auth, requireRole('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, is_active`,
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN - DEPARTMENTS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/admin/departments', auth, requireRole('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.*,
              COUNT(DISTINCT CASE WHEN u.role='student' THEN u.id END) as student_count,
              COUNT(DISTINCT CASE WHEN u.role='faculty' THEN u.id END) as faculty_count
       FROM departments d LEFT JOIN users u ON u.department_id = d.id
       GROUP BY d.id ORDER BY d.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN - STATS / DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/admin/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const [students, faculty, courses, departments, pendingFees] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = true`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'faculty' AND is_active = true`),
      pool.query(`SELECT COUNT(*) FROM courses`),
      pool.query(`SELECT COUNT(*) FROM departments`),
      pool.query(`SELECT COALESCE(SUM(amount),0) FROM fees WHERE status = 'pending'`),
    ]);
    res.json({
      total_students: parseInt(students.rows[0].count),
      total_faculty: parseInt(faculty.rows[0].count),
      total_courses: parseInt(courses.rows[0].count),
      total_departments: parseInt(departments.rows[0].count),
      pending_fees: parseFloat(pendingFees.rows[0].coalesce),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await pool.query(`UPDATE notifications SET is_read = true WHERE user_id = $1`, [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CAAP Backend running on port ${PORT}`);
});
