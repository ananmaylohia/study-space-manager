import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, LogIn, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

const MyBookings = () => {
  const { bookings, studySpaces, checkIn, checkOut } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const userBookings = bookings.filter(b => b.user_id === user?.id);

  const getSpaceName = (spaceId: string) => {
    const space = studySpaces.find(s => s.space_id === spaceId);
    return space?.space_name || 'Unknown';
  };

  const handleCheckIn = (bookingId: string) => {
    checkIn(bookingId);
    toast({
      title: 'Checked In',
      description: `Check-in time logged: ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleCheckOut = (bookingId: string) => {
    checkOut(bookingId);
    toast({
      title: 'Checked Out',
      description: `Check-out time logged: ${new Date().toLocaleTimeString()}`,
    });
  };

  const getStatusBadge = (booking: typeof userBookings[0]) => {
    if (booking.check_out_time) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    }
    if (booking.check_in_time) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          <Clock className="h-3 w-3" />
          In Progress
        </span>
      );
    }
    if (booking.status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
          <AlertCircle className="h-3 w-3" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
        {booking.status}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <motion.h1 
            className="text-3xl font-display font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            My Bookings
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            View and manage your study space reservations
          </motion.p>
        </div>

        {userBookings.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground">Go to the dashboard to book a study space.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {userBookings.map((booking) => (
              <motion.div
                key={booking.booking_id}
                variants={itemVariants}
                className="group bg-card rounded-2xl border border-border p-5 hover:shadow-soft hover:border-primary/30 transition-all duration-300"
                whileHover={{ x: 4 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{getSpaceName(booking.space_id)}</h3>
                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.start_time} - {booking.end_time}</span>
                      </div>
                      {getStatusBadge(booking)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.status === 'active' && !booking.check_in_time && (
                      <motion.button
                        onClick={() => handleCheckIn(booking.booking_id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogIn className="h-4 w-4" />
                        Check In
                      </motion.button>
                    )}
                    {booking.check_in_time && !booking.check_out_time && (
                      <motion.button
                        onClick={() => handleCheckOut(booking.booking_id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium border border-border hover:bg-accent transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <LogOut className="h-4 w-4" />
                        Check Out
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
