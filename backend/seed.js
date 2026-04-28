const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Seed Departments
  const { data: depts, error: deptErr } = await supabase.from('departments').upsert([
    { name: 'Computer Science & Engineering', code: 'CSE', hod_name: 'Dr. Rajesh Kumar', established_year: 2008 },
    { name: 'Information Technology',         code: 'IT',  hod_name: 'Dr. Priya Sharma',  established_year: 2010 },
    { name: 'Electronics & Communication',    code: 'ECE', hod_name: 'Dr. Anil Mehta',    established_year: 2008 },
    { name: 'Mechanical Engineering',         code: 'MECH',hod_name: 'Dr. Suresh Patil',  established_year: 2008 },
    { name: 'Civil Engineering',              code: 'CIVIL',hod_name: 'Dr. Ramesh Joshi', established_year: 2009 },
  ], { onConflict: 'code' }).select();

  if (deptErr) { console.error('❌ Departments:', deptErr.message); return; }
  console.log(`✅ Departments seeded: ${depts.length}`);

  // 2. Hash password
  const hash = await bcrypt.hash('password123', 10);

  // 3. Seed Users
  const { data: users, error: userErr } = await supabase.from('users').upsert([
    { name: 'Admin User',       email: 'admin@mitadt.edu',   password_hash: hash, role: 'admin',   university_id: 'ADM001',     phone: '9876543210' },
    { name: 'Dr. Sarah Johnson',email: 'faculty@mitadt.edu', password_hash: hash, role: 'faculty', university_id: 'FAC001',     phone: '9876543211' },
    { name: 'Rahul Sharma',     email: 'student@mitadt.edu', password_hash: hash, role: 'student', university_id: 'STU2021001', phone: '9876543212' },
  ], { onConflict: 'email' }).select();

  if (userErr) { console.error('❌ Users:', userErr.message); return; }
  console.log(`✅ Users seeded: ${users.length}`);

  // 4. Seed Notices
  const adminUser = users.find(u => u.role === 'admin');
  const { error: noticeErr } = await supabase.from('notices').upsert([
    { title: 'Mid-Semester Examinations Schedule',    content: 'Mid-semester exams will be held from May 10-15, 2026. Check your timetable on the portal.',    category: 'exam',     target_role: 'all',     is_important: true,  created_by: adminUser?.id },
    { title: 'Annual Tech Fest — TechnoMIT 2026',     content: 'The annual tech fest TechnoMIT 2026 is scheduled for May 20-22. Register your teams now!',      category: 'event',    target_role: 'all',     is_important: false, created_by: adminUser?.id },
    { title: 'Summer Internship Guidance Session',    content: 'A guidance session for summer internships will be held on May 5 in Seminar Hall.',              category: 'academic', target_role: 'student', is_important: false, created_by: adminUser?.id },
    { title: 'Fee Payment Deadline Extended',         content: 'The deadline for semester fee payment has been extended to April 30, 2026.',                    category: 'general',  target_role: 'student', is_important: true,  created_by: adminUser?.id },
    { title: 'Faculty Development Program',           content: 'A two-day FDP on AI and Machine Learning will be held on May 8-9. All faculty are invited.',    category: 'academic', target_role: 'faculty', is_important: false, created_by: adminUser?.id },
  ], { onConflict: 'title' }).select();

  if (noticeErr) console.error('⚠️  Notices:', noticeErr.message);
  else console.log('✅ Notices seeded');

  // 5. Seed Courses
  const cseId = depts.find(d => d.code === 'CSE')?.id;
  const faculty = users.find(u => u.role === 'faculty');
  if (cseId && faculty) {
    const { data: courses, error: courseErr } = await supabase.from('courses').upsert([
      { code: 'CS501', name: 'Machine Learning',        department_id: cseId, faculty_id: faculty.id, credits: 4, semester: 5, schedule: 'Mon/Wed 9-10:30', room: 'CS-101' },
      { code: 'CS502', name: 'Cloud Computing',          department_id: cseId, faculty_id: faculty.id, credits: 3, semester: 5, schedule: 'Tue/Thu 11-12:30', room: 'CS-102' },
      { code: 'CS503', name: 'Software Engineering',     department_id: cseId, faculty_id: faculty.id, credits: 4, semester: 5, schedule: 'Mon/Fri 2-3:30', room: 'CS-201' },
      { code: 'CS504', name: 'Database Management',      department_id: cseId, faculty_id: faculty.id, credits: 3, semester: 5, schedule: 'Wed/Fri 9-10:30', room: 'CS-301' },
    ], { onConflict: 'code' }).select();

    if (courseErr) console.error('⚠️  Courses:', courseErr.message);
    else {
      console.log(`✅ Courses seeded: ${courses.length}`);

      // 6. Enroll student in courses
      const student = users.find(u => u.role === 'student');
      if (student) {
        const enrollments = courses.map(c => ({ student_id: student.id, course_id: c.id }));
        const { error: enrErr } = await supabase.from('enrollments').upsert(enrollments, { onConflict: 'student_id,course_id' });
        if (enrErr) console.error('⚠️  Enrollments:', enrErr.message);
        else console.log(`✅ Student enrolled in ${courses.length} courses`);

        // 7. Seed attendance
        const dates = ['2026-04-01','2026-04-02','2026-04-03','2026-04-07','2026-04-08','2026-04-09','2026-04-10','2026-04-14','2026-04-15','2026-04-16'];
        const statuses = ['present','present','present','present','present','present','absent','present','late','present'];
        const attRecords = [];
        for (const course of courses) {
          dates.forEach((date, i) => attRecords.push({ student_id: student.id, course_id: course.id, date, status: statuses[i], marked_by: faculty.id }));
        }
        const { error: attErr } = await supabase.from('attendance').upsert(attRecords, { onConflict: 'student_id,course_id,date' });
        if (attErr) console.error('⚠️  Attendance:', attErr.message);
        else console.log(`✅ Attendance seeded: ${attRecords.length} records`);

        // 8. Seed grades
        const gradeMap = ['A+','A','B+','B'];
        const gpMap = [10, 9, 8, 7];
        const gradeRecords = courses.map((c, i) => ({ student_id: student.id, course_id: c.id, semester: 5, marks_obtained: 85 + i * 3, max_marks: 100, grade: gradeMap[i], grade_points: gpMap[i] }));
        const { error: gradeErr } = await supabase.from('grades').upsert(gradeRecords, { onConflict: 'student_id,course_id,semester' });
        if (gradeErr) console.error('⚠️  Grades:', gradeErr.message);
        else console.log('✅ Grades seeded');

        // 9. Seed fees
        const { error: feeErr } = await supabase.from('fees').upsert([
          { student_id: student.id, fee_type: 'Tuition Fee',       amount: 85000, due_date: '2026-01-15', status: 'paid', paid_date: '2026-01-10', receipt_no: 'RCP100001', academic_year: '2025-26' },
          { student_id: student.id, fee_type: 'Library Fee',        amount: 2500,  due_date: '2026-01-15', status: 'paid', paid_date: '2026-01-10', receipt_no: 'RCP100002', academic_year: '2025-26' },
          { student_id: student.id, fee_type: 'Lab Fee',            amount: 5000,  due_date: '2026-03-31', status: 'pending', academic_year: '2025-26' },
          { student_id: student.id, fee_type: 'Exam Fee',           amount: 3000,  due_date: '2026-04-30', status: 'pending', academic_year: '2025-26' },
        ], { onConflict: 'student_id,fee_type,academic_year' });
        if (feeErr) console.error('⚠️  Fees:', feeErr.message);
        else console.log('✅ Fees seeded');
      }

      // 10. Seed assignments
      const { error: asgErr } = await supabase.from('assignments').upsert([
        { title: 'ML Assignment 1 — Linear Regression', description: 'Implement linear regression from scratch using Python.', course_id: courses[0]?.id, faculty_id: faculty.id, due_date: '2026-05-05T23:59:00', max_marks: 20 },
        { title: 'Cloud Architecture Design',           description: 'Design a scalable cloud architecture for an e-commerce platform.', course_id: courses[1]?.id, faculty_id: faculty.id, due_date: '2026-05-08T23:59:00', max_marks: 25 },
        { title: 'SE Project Report',                   description: 'Submit the complete project report for Phase 2.', course_id: courses[2]?.id, faculty_id: faculty.id, due_date: '2026-04-25T23:59:00', max_marks: 30 },
      ], { onConflict: 'title' }).select();
      if (asgErr) console.error('⚠️  Assignments:', asgErr.message);
      else console.log(`✅ Assignments seeded: ${asgErr ? 0 : 3}`);
    }
  }

  console.log('\n🎉 Database seeding complete!');
  console.log('📧 Login credentials:');
  console.log('   Admin   → admin@mitadt.edu   / password123');
  console.log('   Faculty → faculty@mitadt.edu / password123');
  console.log('   Student → student@mitadt.edu / password123');
}

seed().catch(console.error);
