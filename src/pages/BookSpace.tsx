import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

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

  const selectedSpace = studySpaces.find(s => s.space_id === spaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addBooking({
      user_id: user.id,
      user_email: user.email,
      space_id: spaceId,
      date,
      start_time: startTime,
      end_time: endTime,
    });

    toast({
      title: 'Booking Created',
      description: 'Your booking has been successfully created.',
    });

    navigate('/my-bookings');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Book Study Space
          </h1>
          <p className="text-muted-foreground">
            Reserve your preferred study environment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-soft"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="space" className="block text-sm font-medium text-foreground mb-2">
                Study Space
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <select
                  id="space"
                  value={spaceId}
                  onChange={e => setSpaceId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a study space</option>
                  {studySpaces.map(space => (
                    <option key={space.space_id} value={space.space_id}>
                      {space.space_name} ({space.type}) - {space.location}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {selectedSpace && (
              <motion.div 
                className="p-4 rounded-xl bg-accent/50 border border-accent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedSpace.space_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSpace.location} · Capacity: {selectedSpace.capacity}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="startTime" className="block text-sm font-medium text-foreground mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="endTime" className="block text-sm font-medium text-foreground mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Create Booking
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default BookSpace;
