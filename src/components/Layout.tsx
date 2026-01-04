import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Calendar, Bell, LayoutDashboard, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  const isAdmin = user?.role === 'admin';

  const studentNavLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/book', label: 'Book Space', icon: BookOpen },
    { path: '/my-bookings', label: 'My Bookings', icon: Calendar },
    { path: '/noise-report', label: 'Report Noise', icon: Bell },
  ];

  const adminNavLinks = [
    { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  ];

  const navLinks = isAdmin ? adminNavLinks : studentNavLinks;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <motion.header 
        className="sticky top-0 z-50 glass border-b border-border/50 px-4 py-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <motion.div 
              className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-lg font-semibold gradient-text">RVCE Study</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground truncate max-w-32">
                {user?.email}
              </span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary font-medium">
                  Admin
                </span>
              )}
            </div>
            <motion.button
              onClick={logout}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>

      <motion.footer 
        className="border-t border-border py-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-muted-foreground">
          RVCE Study Space Management System
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Built with ♥ for academic excellence
        </p>
      </motion.footer>
    </div>
  );
};

export default Layout;
