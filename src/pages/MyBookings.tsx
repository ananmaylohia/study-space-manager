import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

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

  return (
    <Layout>
      <div>
        <h1 className="text-xl font-medium mb-4">My Bookings</h1>

        {userBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bookings yet. Go to the dashboard to book a space.
          </p>
        ) : (
          <table className="w-full border border-border text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 border-b border-border">Space</th>
                <th className="text-left px-3 py-2 border-b border-border">Date</th>
                <th className="text-left px-3 py-2 border-b border-border">Time</th>
                <th className="text-left px-3 py-2 border-b border-border">Status</th>
                <th className="text-left px-3 py-2 border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map(booking => (
                <tr key={booking.booking_id} className="border-b border-border">
                  <td className="px-3 py-2">{getSpaceName(booking.space_id)}</td>
                  <td className="px-3 py-2">{booking.date}</td>
                  <td className="px-3 py-2">
                    {booking.start_time} - {booking.end_time}
                  </td>
                  <td className="px-3 py-2">{booking.status}</td>
                  <td className="px-3 py-2 space-x-2">
                    {booking.status === 'active' && !booking.check_in_time && (
                      <button
                        onClick={() => handleCheckIn(booking.booking_id)}
                        className="px-2 py-1 bg-primary text-primary-foreground text-xs"
                      >
                        Check In
                      </button>
                    )}
                    {booking.check_in_time && !booking.check_out_time && (
                      <button
                        onClick={() => handleCheckOut(booking.booking_id)}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs border border-border"
                      >
                        Check Out
                      </button>
                    )}
                    {booking.check_out_time && (
                      <span className="text-xs text-muted-foreground">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
