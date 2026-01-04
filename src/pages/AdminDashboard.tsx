import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Users, Calendar, Volume2, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { studySpaces, bookings, noiseReports } = useData();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const getSpaceName = (spaceId: string) => {
    const space = studySpaces.find(s => s.space_id === spaceId);
    return space?.space_name || 'Unknown';
  };

  const today = new Date().toISOString().split('T')[0];
  const getActiveBookingsForSpace = (spaceId: string) => {
    return bookings.filter(b => 
      b.space_id === spaceId && 
      b.date === today && 
      b.status === 'active'
    ).length;
  };

  const stats = [
    { label: 'Total Spaces', value: studySpaces.length, icon: MapPin, color: 'primary' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'success' },
    { label: 'Noise Reports', value: noiseReports.length, icon: Volume2, color: 'warning' },
    { label: 'Check-ins Today', value: bookings.filter(b => b.check_in_time && b.date === today).length, icon: CheckCircle, color: 'primary' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Monitor bookings, reports, and space utilization
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-soft transition-shadow"
              >
                <div className={`h-10 w-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Study Spaces Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Study Spaces Overview</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {studySpaces.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No study spaces configured.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Space</th>
                      <th className="text-left p-4 font-medium text-foreground">Location</th>
                      <th className="text-left p-4 font-medium text-foreground">Type</th>
                      <th className="text-left p-4 font-medium text-foreground">Capacity</th>
                      <th className="text-left p-4 font-medium text-foreground">Active Today</th>
                      <th className="text-left p-4 font-medium text-foreground">Available</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {studySpaces.map(space => {
                      const activeBookings = getActiveBookingsForSpace(space.space_id);
                      const availableSlots = Math.max(0, space.capacity - activeBookings);
                      return (
                        <tr key={space.space_id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{space.space_name}</td>
                          <td className="p-4 text-muted-foreground">{space.location}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {space.type}
                            </span>
                          </td>
                          <td className="p-4">{space.capacity}</td>
                          <td className="p-4">{activeBookings}</td>
                          <td className="p-4">
                            <span className={`font-medium ${availableSlots > 0 ? 'text-success' : 'text-destructive'}`}>
                              {availableSlots}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>

        {/* All Bookings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-success" />
            <h2 className="text-xl font-semibold text-foreground">All Bookings</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {bookings.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">User</th>
                      <th className="text-left p-4 font-medium text-foreground">Space</th>
                      <th className="text-left p-4 font-medium text-foreground">Date</th>
                      <th className="text-left p-4 font-medium text-foreground">Time</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Check-in</th>
                      <th className="text-left p-4 font-medium text-foreground">Check-out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map(booking => (
                      <tr key={booking.booking_id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">{booking.user_email}</td>
                        <td className="p-4">{getSpaceName(booking.space_id)}</td>
                        <td className="p-4">{booking.date}</td>
                        <td className="p-4 text-muted-foreground">{booking.start_time} - {booking.end_time}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'active' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-secondary text-secondary-foreground'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {booking.check_in_time 
                            ? new Date(booking.check_in_time).toLocaleTimeString() 
                            : '-'}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {booking.check_out_time 
                            ? new Date(booking.check_out_time).toLocaleTimeString() 
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>

        {/* Noise Reports */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="text-xl font-semibold text-foreground">Noise Reports</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {noiseReports.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No noise reports yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Reporter</th>
                      <th className="text-left p-4 font-medium text-foreground">Space</th>
                      <th className="text-left p-4 font-medium text-foreground">Time</th>
                      <th className="text-left p-4 font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {noiseReports.map(report => (
                      <tr key={report.report_id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">{report.user_email}</td>
                        <td className="p-4">{getSpaceName(report.space_id)}</td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {new Date(report.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 max-w-xs truncate">{report.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>

        {/* Check-in Logs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Check-in Logs</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {bookings.filter(b => b.check_in_time).length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No check-in logs yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">User</th>
                      <th className="text-left p-4 font-medium text-foreground">Space</th>
                      <th className="text-left p-4 font-medium text-foreground">Check-in</th>
                      <th className="text-left p-4 font-medium text-foreground">Check-out</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings
                      .filter(b => b.check_in_time)
                      .map(booking => (
                        <tr key={booking.booking_id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">{booking.user_email}</td>
                          <td className="p-4">{getSpaceName(booking.space_id)}</td>
                          <td className="p-4 text-xs">
                            {booking.check_in_time 
                              ? new Date(booking.check_in_time).toLocaleString() 
                              : '-'}
                          </td>
                          <td className="p-4 text-xs">
                            {booking.check_out_time 
                              ? new Date(booking.check_out_time).toLocaleString() 
                              : <span className="text-warning">Ongoing</span>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
