import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Mail, Users, ArrowRight, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

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
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative gradient-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-display text-2xl font-bold">RVCE Study</span>
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-4 leading-tight">
              Find Your Perfect<br />Study Space
            </h1>
            <p className="text-lg opacity-90 max-w-md leading-relaxed">
              Book quiet rooms, collaborative spaces, and everything in between. 
              Manage your academic productivity with ease.
            </p>

            <div className="mt-12 flex items-center gap-4">
              <motion.div 
                className="flex -space-x-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-10 w-10 rounded-full bg-primary-foreground/30 border-2 border-primary-foreground/50 flex items-center justify-center text-xs font-medium"
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </div>
                ))}
              </motion.div>
              <p className="text-sm opacity-80">500+ students already using</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold gradient-text">RVCE Study</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to manage your study space bookings
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="student@rvce.edu.in"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                Role
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value as 'student' | 'admin')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <motion.div 
            className="mt-8 p-4 rounded-xl bg-accent/50 border border-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Demo Mode</p>
                <p className="text-xs text-muted-foreground mt-1">
                  No authentication required for this prototype. Enter any email to continue.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
