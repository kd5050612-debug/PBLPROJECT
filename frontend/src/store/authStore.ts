import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Demo login - in production this calls the API
        const demoUsers: Record<string, User & { password: string }> = {
          'student@mitadt.edu.in': {
            id: 'STU001', name: 'Arjun Mehta', email: 'student@mitadt.edu.in',
            password: 'student123', role: 'student', universityId: 'MIT2024CS001',
            department: 'Computer Science', semester: 5, batch: '2022-2026',
            phone: '+91 98765 43210', joinDate: '2022-08-01'
          },
          'faculty@mitadt.edu.in': {
            id: 'FAC001', name: 'Dr. Priya Sharma', email: 'faculty@mitadt.edu.in',
            password: 'faculty123', role: 'faculty', universityId: 'MITFAC0042',
            department: 'Computer Science', phone: '+91 98765 11110',
            joinDate: '2018-06-01'
          },
          'admin@mitadt.edu.in': {
            id: 'ADM001', name: 'Rajesh Kumar', email: 'admin@mitadt.edu.in',
            password: 'admin123', role: 'admin', universityId: 'MITADM0001',
            department: 'Administration', phone: '+91 98765 00001',
            joinDate: '2015-01-01'
          },
        };

        const found = demoUsers[email.toLowerCase()];
        if (!found || found.password !== password) {
          throw new Error('Invalid credentials. Check demo credentials below.');
        }

        const { password: _, ...user } = found;
        const token = `demo_jwt_${user.role}_${Date.now()}`;
        set({ user, token, isAuthenticated: true });
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'caap-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
