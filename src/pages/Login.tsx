import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email, role);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-6 border border-border bg-card">
        <h1 className="text-xl font-medium mb-6 text-center">
          RVCE Study Space Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
              placeholder="student@rvce.edu.in"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value as 'student' | 'admin')}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground text-sm"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          No authentication required for this prototype
        </p>
      </div>
    </div>
  );
};

export default Login;
