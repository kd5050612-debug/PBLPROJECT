import { Course, Assignment, AttendanceSummary, Grade, Notice, FeeRecord, Student, Faculty, Department, Notification, SupportTicket, Document } from '../types';

export const mockCourses: Course[] = [
  { id: 'C001', code: 'CS501', name: 'Machine Learning', credits: 4, department: 'Computer Science', facultyId: 'FAC001', facultyName: 'Dr. Priya Sharma', semester: 5, enrolledCount: 62, schedule: 'Mon/Wed 9:00-10:30', room: 'A-301', description: 'Fundamentals of ML algorithms and applications' },
  { id: 'C002', code: 'CS502', name: 'Cloud Computing', credits: 3, department: 'Computer Science', facultyId: 'FAC002', facultyName: 'Prof. Rahul Gupta', semester: 5, enrolledCount: 58, schedule: 'Tue/Thu 11:00-12:30', room: 'A-302', description: 'AWS, Azure, GCP cloud platforms' },
  { id: 'C003', code: 'CS503', name: 'Software Engineering', credits: 4, department: 'Computer Science', facultyId: 'FAC003', facultyName: 'Dr. Anjali Singh', semester: 5, enrolledCount: 65, schedule: 'Mon/Fri 2:00-3:30', room: 'B-201', description: 'SDLC, Agile, DevOps' },
  { id: 'C004', code: 'CS504', name: 'Computer Networks', credits: 3, department: 'Computer Science', facultyId: 'FAC004', facultyName: 'Prof. Vikram Patel', semester: 5, enrolledCount: 60, schedule: 'Wed/Fri 9:00-10:30', room: 'B-202', description: 'TCP/IP, routing, protocols' },
  { id: 'C005', code: 'CS505', name: 'Database Systems', credits: 3, department: 'Computer Science', facultyId: 'FAC001', facultyName: 'Dr. Priya Sharma', semester: 5, enrolledCount: 55, schedule: 'Tue/Thu 2:00-3:30', room: 'A-303', description: 'SQL, NoSQL, query optimization' },
];

export const mockAssignments: Assignment[] = [
  { id: 'A001', title: 'Linear Regression Implementation', courseId: 'C001', courseName: 'Machine Learning', dueDate: '2026-05-10', maxMarks: 25, description: 'Implement linear regression from scratch using NumPy.', status: 'pending' },
  { id: 'A002', title: 'AWS S3 Bucket Configuration', courseId: 'C002', courseName: 'Cloud Computing', dueDate: '2026-05-08', maxMarks: 20, description: 'Configure S3 bucket with IAM policies.', status: 'submitted', submittedAt: '2026-05-01' },
  { id: 'A003', title: 'UML Diagram for E-commerce System', courseId: 'C003', courseName: 'Software Engineering', dueDate: '2026-04-30', maxMarks: 30, description: 'Create complete UML diagrams.', status: 'graded', grade: 26, feedback: 'Excellent sequence diagrams! Class diagram needs minor refinement.', submittedAt: '2026-04-28' },
  { id: 'A004', title: 'TCP/IP Packet Analysis', courseId: 'C004', courseName: 'Computer Networks', dueDate: '2026-05-15', maxMarks: 20, description: 'Analyze network packets using Wireshark.', status: 'pending' },
  { id: 'A005', title: 'SQL Query Optimization Report', courseId: 'C005', courseName: 'Database Systems', dueDate: '2026-05-03', maxMarks: 25, description: 'Optimize given queries and measure performance improvement.', status: 'late', submittedAt: '2026-05-04' },
];

export const mockAttendance: AttendanceSummary[] = [
  { courseId: 'C001', courseName: 'Machine Learning', total: 40, present: 36, absent: 3, late: 1, percentage: 90 },
  { courseId: 'C002', courseName: 'Cloud Computing', total: 35, present: 28, absent: 6, late: 1, percentage: 80 },
  { courseId: 'C003', courseName: 'Software Engineering', total: 42, present: 38, absent: 4, late: 0, percentage: 90.5 },
  { courseId: 'C004', courseName: 'Computer Networks', total: 38, present: 30, absent: 7, late: 1, percentage: 78.9 },
  { courseId: 'C005', courseName: 'Database Systems', total: 36, present: 32, absent: 3, late: 1, percentage: 88.9 },
];

export const mockGrades: Grade[] = [
  { courseId: 'C001', courseName: 'Machine Learning', internal: 42, external: 78, total: 120, grade: 'A', gpa: 9.0, semester: 5 },
  { courseId: 'C002', courseName: 'Cloud Computing', internal: 35, external: 65, total: 100, grade: 'B+', gpa: 8.0, semester: 5 },
  { courseId: 'C003', courseName: 'Software Engineering', internal: 45, external: 82, total: 127, grade: 'A+', gpa: 10.0, semester: 5 },
  { courseId: 'C004', courseName: 'Computer Networks', internal: 38, external: 70, total: 108, grade: 'A-', gpa: 8.5, semester: 5 },
  { courseId: 'C005', courseName: 'Database Systems', internal: 40, external: 74, total: 114, grade: 'A', gpa: 9.0, semester: 5 },
];

export const mockNotices: Notice[] = [
  { id: 'N001', title: '🎓 End Semester Exam Schedule Released', content: 'The end semester examination schedule for May 2026 has been released. Students are advised to check their individual timetable. Hall tickets will be available from May 5, 2026.', category: 'exam', publishedBy: 'Examination Department', publishedAt: '2026-04-25T10:00:00', targetRoles: ['student', 'faculty'], isRead: false },
  { id: 'N002', title: '📚 Library Extended Hours During Exam Season', content: 'The central library will remain open 24/7 from May 1 to May 31, 2026. Additional study rooms have been made available.', category: 'general', publishedBy: 'Library Administration', publishedAt: '2026-04-24T14:00:00', targetRoles: ['student', 'faculty'], isRead: true },
  { id: 'N003', title: '🔴 URGENT: Internal Assessment Submission Deadline', content: 'All faculty must submit internal assessment marks by April 30, 2026. Please use the Faculty Portal for mark entry.', category: 'urgent', publishedBy: 'Academic Office', publishedAt: '2026-04-23T09:00:00', targetRoles: ['faculty'], isRead: false },
  { id: 'N004', title: '🏆 National Hackathon Registration Open', content: 'MIT ADT University is participating in the Smart India Hackathon 2026. Teams of 5-6 students can register. Last date: May 15, 2026.', category: 'event', publishedBy: 'Student Affairs', publishedAt: '2026-04-22T11:00:00', targetRoles: ['student', 'faculty', 'admin'], isRead: true },
  { id: 'N005', title: '💰 Scholarship Applications Now Open', content: 'Merit-cum-Means scholarship for AY 2026-27 is now open. Eligible students (CGPA ≥ 8.0, family income < 6 LPA) can apply through the Student Portal.', category: 'academic', publishedBy: 'Scholarship Cell', publishedAt: '2026-04-20T16:00:00', targetRoles: ['student'], isRead: false },
];

export const mockFeeRecords: FeeRecord[] = [
  { id: 'FEE2026S5', semester: 'Semester 5 (2025-26)', amount: 85000, paid: 85000, due: 0, dueDate: '2025-12-31', status: 'paid', items: [{ label: 'Tuition Fee', amount: 60000 }, { label: 'Lab Fee', amount: 8000 }, { label: 'Library Fee', amount: 3000 }, { label: 'Sports Fee', amount: 2000 }, { label: 'Development Fee', amount: 7000 }, { label: 'Exam Fee', amount: 5000 }] },
  { id: 'FEE2026S6', semester: 'Semester 6 (2026)', amount: 88000, paid: 50000, due: 38000, dueDate: '2026-06-30', status: 'partial', items: [{ label: 'Tuition Fee', amount: 62000 }, { label: 'Lab Fee', amount: 9000 }, { label: 'Library Fee', amount: 3000 }, { label: 'Sports Fee', amount: 2000 }, { label: 'Development Fee', amount: 7000 }, { label: 'Exam Fee', amount: 5000 }] },
];

export const mockStudents: Student[] = [
  { id: 'STU001', name: 'Arjun Mehta', email: 'arjun.mehta@mitadt.edu.in', universityId: 'MIT2024CS001', department: 'Computer Science', semester: 5, batch: '2022-2026', phone: '+91 98765 43210', cgpa: 9.2, attendancePercentage: 90.0, status: 'active' },
  { id: 'STU002', name: 'Sneha Patel', email: 'sneha.patel@mitadt.edu.in', universityId: 'MIT2024CS002', department: 'Computer Science', semester: 5, batch: '2022-2026', phone: '+91 98765 43211', cgpa: 8.7, attendancePercentage: 85.0, status: 'active' },
  { id: 'STU003', name: 'Rohan Verma', email: 'rohan.verma@mitadt.edu.in', universityId: 'MIT2024EC001', department: 'Electronics', semester: 3, batch: '2023-2027', phone: '+91 98765 43212', cgpa: 7.5, attendancePercentage: 72.0, status: 'active' },
  { id: 'STU004', name: 'Kavya Iyer', email: 'kavya.iyer@mitadt.edu.in', universityId: 'MIT2024CS003', department: 'Computer Science', semester: 5, batch: '2022-2026', phone: '+91 98765 43213', cgpa: 9.8, attendancePercentage: 95.0, status: 'active' },
  { id: 'STU005', name: 'Aditya Sharma', email: 'aditya.sharma@mitadt.edu.in', universityId: 'MIT2024ME001', department: 'Mechanical', semester: 7, batch: '2021-2025', phone: '+91 98765 43214', cgpa: 8.1, attendancePercentage: 80.0, status: 'active' },
  { id: 'STU006', name: 'Priya Nair', email: 'priya.nair@mitadt.edu.in', universityId: 'MIT2024AI001', department: 'AI & ML', semester: 3, batch: '2023-2027', phone: '+91 98765 43215', cgpa: 8.9, attendancePercentage: 88.0, status: 'active' },
  { id: 'STU007', name: 'Vivek Kumar', email: 'vivek.kumar@mitadt.edu.in', universityId: 'MIT2024CS004', department: 'Computer Science', semester: 5, batch: '2022-2026', phone: '+91 98765 43216', cgpa: 7.2, attendancePercentage: 68.5, status: 'inactive' },
  { id: 'STU008', name: 'Ananya Gupta', email: 'ananya.gupta@mitadt.edu.in', universityId: 'MIT2024IT001', department: 'Information Technology', semester: 1, batch: '2024-2028', phone: '+91 98765 43217', cgpa: 9.0, attendancePercentage: 92.0, status: 'active' },
  { id: 'STU009', name: 'Siddharth Rao', email: 'siddharth.rao@mitadt.edu.in', universityId: 'MIT2024CE001', department: 'Civil', semester: 5, batch: '2022-2026', phone: '+91 98765 43218', cgpa: 7.8, attendancePercentage: 78.0, status: 'active' },
  { id: 'STU010', name: 'Pooja Mehta', email: 'pooja.mehta@mitadt.edu.in', universityId: 'MIT2024DS001', department: 'Data Science', semester: 3, batch: '2023-2027', phone: '+91 98765 43219', cgpa: 8.5, attendancePercentage: 83.0, status: 'active' },
];

export const mockFaculty: Faculty[] = [
  { id: 'FAC001', name: 'Dr. Priya Sharma', email: 'priya.sharma@mitadt.edu.in', universityId: 'MITFAC0042', department: 'Computer Science', designation: 'Associate Professor', phone: '+91 98765 11110', coursesCount: 3, studentsCount: 172, status: 'active' },
  { id: 'FAC002', name: 'Prof. Rahul Gupta', email: 'rahul.gupta@mitadt.edu.in', universityId: 'MITFAC0015', department: 'Computer Science', designation: 'Professor', phone: '+91 98765 22220', coursesCount: 2, studentsCount: 108, status: 'active' },
  { id: 'FAC003', name: 'Dr. Anjali Singh', email: 'anjali.singh@mitadt.edu.in', universityId: 'MITFAC0023', department: 'Computer Science', designation: 'Assistant Professor', phone: '+91 98765 33330', coursesCount: 2, studentsCount: 130, status: 'active' },
  { id: 'FAC004', name: 'Prof. Vikram Patel', email: 'vikram.patel@mitadt.edu.in', universityId: 'MITFAC0031', department: 'Electronics', designation: 'Professor', phone: '+91 98765 44440', coursesCount: 3, studentsCount: 150, status: 'active' },
  { id: 'FAC005', name: 'Dr. Sneha Kulkarni', email: 'sneha.kulkarni@mitadt.edu.in', universityId: 'MITFAC0018', department: 'Mechanical', designation: 'Associate Professor', phone: '+91 98765 55550', coursesCount: 2, studentsCount: 95, status: 'inactive' },
  { id: 'FAC006', name: 'Prof. Arun Nair', email: 'arun.nair@mitadt.edu.in', universityId: 'MITFAC0009', department: 'Civil', designation: 'Professor', phone: '+91 98765 66660', coursesCount: 4, studentsCount: 190, status: 'active' },
];

export const mockDepartments: Department[] = [
  { id: 'D001', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Ramesh Iyer', studentsCount: 480, facultyCount: 18, coursesCount: 42 },
  { id: 'D002', name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. Madhuri Patil', studentsCount: 360, facultyCount: 14, coursesCount: 36 },
  { id: 'D003', name: 'Mechanical Engineering', code: 'ME', hod: 'Prof. Suresh Bhat', studentsCount: 300, facultyCount: 12, coursesCount: 30 },
  { id: 'D004', name: 'Civil Engineering', code: 'CE', hod: 'Dr. Anil Desai', studentsCount: 240, facultyCount: 10, coursesCount: 28 },
  { id: 'D005', name: 'Artificial Intelligence & ML', code: 'AIML', hod: 'Dr. Kavita Mehta', studentsCount: 200, facultyCount: 8, coursesCount: 22 },
  { id: 'D006', name: 'Information Technology', code: 'IT', hod: 'Prof. Nitin Joshi', studentsCount: 280, facultyCount: 11, coursesCount: 32 },
  { id: 'D007', name: 'Data Science', code: 'DS', hod: 'Dr. Smita Wagh', studentsCount: 160, facultyCount: 7, coursesCount: 18 },
  { id: 'D008', name: 'MBA', code: 'MBA', hod: 'Prof. Rajendra Salvi', studentsCount: 120, facultyCount: 9, coursesCount: 24 },
];

export const mockNotifications: Notification[] = [
  { id: 'NOT001', title: 'Assignment Due Tomorrow', message: 'Linear Regression Implementation is due tomorrow at 11:59 PM', type: 'warning', isRead: false, createdAt: '2026-04-28T08:00:00' },
  { id: 'NOT002', title: 'Grade Posted', message: 'Your UML Diagram assignment has been graded. Score: 26/30', type: 'success', isRead: false, createdAt: '2026-04-27T15:30:00' },
  { id: 'NOT003', title: 'New Notice', message: 'End Semester Exam Schedule has been released', type: 'info', isRead: true, createdAt: '2026-04-25T10:00:00' },
  { id: 'NOT004', title: 'Low Attendance Warning', message: 'Your attendance in Computer Networks is below 80%', type: 'danger', isRead: false, createdAt: '2026-04-24T09:00:00' },
];

export const mockTickets: SupportTicket[] = [
  { id: 'TKT001', subject: 'Cannot access course material for CS501', description: 'The lecture slides for Week 8 are not loading.', status: 'resolved', priority: 'medium', createdAt: '2026-04-20', updatedAt: '2026-04-22', category: 'Technical' },
  { id: 'TKT002', subject: 'Request for bonafide certificate', description: 'Need bonafide certificate for bank account opening.', status: 'in_progress', priority: 'low', createdAt: '2026-04-26', updatedAt: '2026-04-27', category: 'Administrative' },
];

export const mockDocuments: Document[] = [
  { id: 'DOC001', name: 'Semester 4 Marksheet.pdf', type: 'marksheet', uploadedAt: '2026-01-15', size: '245 KB', downloadUrl: '#' },
  { id: 'DOC002', name: 'Bonafide Certificate.pdf', type: 'certificate', uploadedAt: '2026-02-10', size: '128 KB', downloadUrl: '#' },
  { id: 'DOC003', name: 'Student ID Card.pdf', type: 'id_card', uploadedAt: '2022-08-01', size: '89 KB', downloadUrl: '#' },
  { id: 'DOC004', name: 'ML Course Notes - Unit 1.pdf', type: 'resource', uploadedAt: '2026-03-05', size: '1.2 MB', downloadUrl: '#' },
];

export const attendanceTrendData = [
  { month: 'Jan', ML: 95, CC: 88, SE: 92, CN: 76, DB: 91 },
  { month: 'Feb', ML: 88, CC: 82, SE: 89, CN: 80, DB: 85 },
  { month: 'Mar', ML: 92, CC: 78, SE: 94, CN: 75, DB: 88 },
  { month: 'Apr', ML: 90, CC: 80, SE: 90, CN: 79, DB: 89 },
];

export const departmentEnrollmentData = [
  { name: 'CSE', students: 480, fill: '#6366f1' },
  { name: 'ECE', students: 360, fill: '#8b5cf6' },
  { name: 'ME', students: 300, fill: '#06b6d4' },
  { name: 'CE', students: 240, fill: '#10b981' },
  { name: 'AIML', students: 200, fill: '#f59e0b' },
  { name: 'IT', students: 280, fill: '#ef4444' },
  { name: 'DS', students: 160, fill: '#ec4899' },
];

export const adminStatsTimeline = [
  { month: 'Sep', students: 1820, faculty: 68, courses: 180 },
  { month: 'Oct', students: 1840, faculty: 70, courses: 182 },
  { month: 'Nov', students: 1860, faculty: 70, courses: 184 },
  { month: 'Dec', students: 1870, faculty: 72, courses: 185 },
  { month: 'Jan', students: 1890, faculty: 72, courses: 186 },
  { month: 'Feb', students: 1920, faculty: 74, courses: 188 },
  { month: 'Mar', students: 1940, faculty: 74, courses: 190 },
  { month: 'Apr', students: 1960, faculty: 76, courses: 192 },
];
