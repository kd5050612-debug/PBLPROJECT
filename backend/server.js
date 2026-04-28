const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log('🔗 Supabase client initialized:', process.env.SUPABASE_URL);

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
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
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const { data, error } = await supabase.from('departments').select('count', { count: 'exact', head: true });
  res.json({ status: error ? 'db_error' : 'ok', error: error?.message, timestamp: new Date() });
});

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data: users, error } = await supabase
      .from('users')
      .select('*, departments(name, code)')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .limit(1);

    if (error) return res.status(500).json({ error: error.message });
    if (!users || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
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
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, university_id, phone, avatar, join_date, departments(name, code)')
    .eq('id', req.user.id)
    .single();
  if (error) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

// ═══════════════════════════════════════════════════════════════════════════════
// COURSES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/courses', auth, async (req, res) => {
  try {
    let query = supabase.from('courses').select('*, users(name), departments(name)');
    if (req.user.role === 'faculty') query = query.eq('faculty_id', req.user.id);
    const { data, error } = await query.order('code');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENDANCE
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/attendance/summary', auth, async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
  const { data, error } = await supabase
    .from('attendance_summary')
    .select('*')
    .eq('student_id', studentId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.get('/api/attendance', auth, async (req, res) => {
  let query = supabase.from('attendance').select('*, users(name, university_id)');
  if (req.query.course_id) query = query.eq('course_id', req.query.course_id);
  if (req.query.date) query = query.eq('date', req.query.date);
  if (req.user.role === 'student') query = query.eq('student_id', req.user.id);
  const { data, error } = await query.order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/attendance', auth, requireRole('faculty', 'admin'), async (req, res) => {
  const { records, course_id, date } = req.body;
  const rows = records.map(r => ({
    student_id: r.student_id, course_id, date, status: r.status, marked_by: req.user.id
  }));
  const { data, error } = await supabase.from('attendance').upsert(rows, { onConflict: 'student_id,course_id,date' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ saved: rows.length });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/assignments', auth, async (req, res) => {
  try {
    let query = supabase.from('assignments').select('*, courses(name, code)');
    if (req.user.role === 'faculty') query = query.eq('faculty_id', req.user.id);
    const { data, error } = await query.order('due_date');
    if (error) return res.status(500).json({ error: error.message });

    // For students, also get submission status
    if (req.user.role === 'student' && data) {
      const ids = data.map(a => a.id);
      const { data: subs } = await supabase.from('submissions').select('*').eq('student_id', req.user.id).in('assignment_id', ids);
      const subMap = {};
      (subs || []).forEach(s => subMap[s.assignment_id] = s);
      const enriched = data.map(a => ({ ...a, submission_status: subMap[a.id]?.status || 'pending', marks_obtained: subMap[a.id]?.marks_obtained || null }));
      return res.json(enriched);
    }
    res.json(data || []);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/assignments', auth, requireRole('faculty', 'admin'), async (req, res) => {
  const { title, description, course_id, due_date, max_marks } = req.body;
  const { data, error } = await supabase.from('assignments')
    .insert({ title, description, course_id, faculty_id: req.user.id, due_date, max_marks: max_marks || 100 })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ═══════════════════════════════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/grades', auth, async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
  const { data, error } = await supabase.from('grades')
    .select('*, courses(name, code, credits)')
    .eq('student_id', studentId)
    .order('semester');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ═══════════════════════════════════════════════════════════════════════════════
// FEES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/fees', auth, async (req, res) => {
  const studentId = req.user.role === 'student' ? req.user.id : req.query.student_id;
  const { data, error } = await supabase.from('fees').select('*').eq('student_id', studentId).order('due_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.patch('/api/fees/:id/pay', auth, async (req, res) => {
  const receiptNo = 'RCP' + Math.floor(Math.random() * 900000 + 100000);
  const { data, error } = await supabase.from('fees')
    .update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0], receipt_no: receiptNo })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/notices', auth, async (req, res) => {
  const { data, error } = await supabase.from('notices')
    .select('*, users(name)')
    .or(`target_role.eq.all,target_role.eq.${req.user.role}`)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/notices', auth, requireRole('faculty', 'admin'), async (req, res) => {
  const { title, content, category, target_role, is_important } = req.body;
  const { data, error } = await supabase.from('notices')
    .insert({ title, content, category: category || 'general', target_role: target_role || 'all', created_by: req.user.id, is_important: is_important || false })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.delete('/api/notices/:id', auth, requireRole('admin'), async (req, res) => {
  const { error } = await supabase.from('notices').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/notifications', auth, async (req, res) => {
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false }).limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════════
app.get('/api/admin/users', auth, requireRole('admin'), async (req, res) => {
  let query = supabase.from('users').select('id, name, email, role, university_id, phone, is_active, join_date, departments(name)');
  if (req.query.role) query = query.eq('role', req.query.role);
  if (req.query.search) query = query.or(`name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%`);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.post('/api/admin/users', auth, requireRole('admin'), async (req, res) => {
  const { name, email, role, university_id, department_id, phone, password } = req.body;
  const password_hash = await bcrypt.hash(password || 'password123', 10);
  const { data, error } = await supabase.from('users')
    .insert({ name, email: email.toLowerCase(), password_hash, role, university_id, department_id, phone })
    .select('id, name, email, role, university_id').single();
  if (error) return res.status(error.code === '23505' ? 409 : 500).json({ error: error.message });
  res.status(201).json(data);
});

app.patch('/api/admin/users/:id/toggle', auth, requireRole('admin'), async (req, res) => {
  const { data: user } = await supabase.from('users').select('is_active').eq('id', req.params.id).single();
  const { data, error } = await supabase.from('users').update({ is_active: !user.is_active }).eq('id', req.params.id).select('id, name, is_active').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/admin/departments', auth, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabase.from('departments').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

app.get('/api/admin/stats', auth, requireRole('admin'), async (req, res) => {
  const [students, faculty, courses, departments, fees] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'student').eq('is_active', true),
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'faculty').eq('is_active', true),
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('departments').select('id', { count: 'exact', head: true }),
    supabase.from('fees').select('amount').eq('status', 'pending'),
  ]);
  const pendingFees = (fees.data || []).reduce((s, f) => s + parseFloat(f.amount), 0);
  res.json({
    total_students: students.count || 0,
    total_faculty: faculty.count || 0,
    total_courses: courses.count || 0,
    total_departments: departments.count || 0,
    pending_fees: pendingFees,
  });
});

// ─── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 CAAP Backend running on port ${PORT}`));
