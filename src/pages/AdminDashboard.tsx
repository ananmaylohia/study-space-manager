import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { studySpaces, bookings, noiseReports } = useData();

  // Only admin can access
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Helper to get space name by id
  const getSpaceName = (spaceId: string) => {
    const space = studySpaces.find(s => s.space_id === spaceId);
    return space?.space_name || 'Unknown';
  };

  // Helper to get user email (since we don't have full user table, we use booking user_id as email proxy)
  const getUserEmail = (userId: string) => {
    // In real app, this would join with users table
    return userId;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor all bookings, noise reports, and check-in activity</p>
      </div>

      {/* All Bookings Section */}
      <section>
        <h2 className="text-lg font-medium mb-3 border-b border-border pb-2">All Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 border-b border-border font-medium">Booking ID</th>
                  <th className="text-left p-2 border-b border-border font-medium">User Email</th>
                  <th className="text-left p-2 border-b border-border font-medium">Study Space</th>
                  <th className="text-left p-2 border-b border-border font-medium">Date</th>
                  <th className="text-left p-2 border-b border-border font-medium">Start Time</th>
                  <th className="text-left p-2 border-b border-border font-medium">End Time</th>
                  <th className="text-left p-2 border-b border-border font-medium">Status</th>
                  <th className="text-left p-2 border-b border-border font-medium">Check-in</th>
                  <th className="text-left p-2 border-b border-border font-medium">Check-out</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.booking_id} className="border-b border-border">
                    <td className="p-2 font-mono text-xs">{booking.booking_id}</td>
                    <td className="p-2">{getUserEmail(booking.user_id)}</td>
                    <td className="p-2">{getSpaceName(booking.space_id)}</td>
                    <td className="p-2">{booking.date}</td>
                    <td className="p-2">{booking.start_time}</td>
                    <td className="p-2">{booking.end_time}</td>
                    <td className="p-2">{booking.status}</td>
                    <td className="p-2 text-xs">
                      {booking.check_in_time 
                        ? new Date(booking.check_in_time).toLocaleTimeString() 
                        : '-'}
                    </td>
                    <td className="p-2 text-xs">
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
      </section>

      {/* Noise Reports Section */}
      <section>
        <h2 className="text-lg font-medium mb-3 border-b border-border pb-2">Noise Reports</h2>
        {noiseReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No noise reports yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 border-b border-border font-medium">Report ID</th>
                  <th className="text-left p-2 border-b border-border font-medium">Reported By (Email)</th>
                  <th className="text-left p-2 border-b border-border font-medium">Study Space</th>
                  <th className="text-left p-2 border-b border-border font-medium">Timestamp</th>
                  <th className="text-left p-2 border-b border-border font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {noiseReports.map(report => (
                  <tr key={report.report_id} className="border-b border-border">
                    <td className="p-2 font-mono text-xs">{report.report_id}</td>
                    <td className="p-2">{getUserEmail(report.user_id)}</td>
                    <td className="p-2">{getSpaceName(report.space_id)}</td>
                    <td className="p-2 text-xs">{new Date(report.timestamp).toLocaleString()}</td>
                    <td className="p-2">{report.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Check-in Logs Section */}
      <section>
        <h2 className="text-lg font-medium mb-3 border-b border-border pb-2">Check-in Logs</h2>
        {bookings.filter(b => b.check_in_time).length === 0 ? (
          <p className="text-sm text-muted-foreground">No check-in logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 border-b border-border font-medium">Booking ID</th>
                  <th className="text-left p-2 border-b border-border font-medium">User Email</th>
                  <th className="text-left p-2 border-b border-border font-medium">Study Space</th>
                  <th className="text-left p-2 border-b border-border font-medium">Check-in Time</th>
                  <th className="text-left p-2 border-b border-border font-medium">Check-out Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter(b => b.check_in_time)
                  .map(booking => (
                    <tr key={booking.booking_id} className="border-b border-border">
                      <td className="p-2 font-mono text-xs">{booking.booking_id}</td>
                      <td className="p-2">{getUserEmail(booking.user_id)}</td>
                      <td className="p-2">{getSpaceName(booking.space_id)}</td>
                      <td className="p-2 text-xs">
                        {booking.check_in_time 
                          ? new Date(booking.check_in_time).toLocaleString() 
                          : '-'}
                      </td>
                      <td className="p-2 text-xs">
                        {booking.check_out_time 
                          ? new Date(booking.check_out_time).toLocaleString() 
                          : '-'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
