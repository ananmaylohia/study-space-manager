import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const BookSpace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { studySpaces, addBooking } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const preselectedSpace = searchParams.get('space') || '';

  const [spaceId, setSpaceId] = useState(preselectedSpace);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addBooking({
      user_id: user.id,
      space_id: spaceId,
      date,
      start_time: startTime,
      end_time: endTime,
      status: 'active',
    });

    toast({
      title: 'Booking Created',
      description: 'Your booking has been successfully created.',
    });

    navigate('/my-bookings');
  };

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-xl font-medium mb-4">Book Study Space</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="space" className="block text-sm mb-1">
              Select Study Space
            </label>
            <select
              id="space"
              value={spaceId}
              onChange={e => setSpaceId(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
              required
            >
              <option value="">-- Select a space --</option>
              {studySpaces.map(space => (
                <option key={space.space_id} value={space.space_id}>
                  {space.space_name} ({space.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm mb-1">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground text-sm"
          >
            Create Booking
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default BookSpace;
