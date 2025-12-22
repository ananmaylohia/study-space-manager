import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/book', label: 'Book Space' },
    { path: '/my-bookings', label: 'My Bookings' },
    { path: '/noise-report', label: 'Report Noise' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-lg font-medium">RVCE Study Spaces</div>
          <nav className="flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm ${
                  location.pathname === link.path
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <span className="text-sm text-muted-foreground ml-4">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground underline ml-2"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        RVCE Study Space Management System
      </footer>
    </div>
  );
};

export default Layout;
