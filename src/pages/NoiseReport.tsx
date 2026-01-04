import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { MapPin, AlertTriangle, Send, Volume2 } from 'lucide-react';

const NoiseReport = () => {
  const { studySpaces, addNoiseReport } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const [spaceId, setSpaceId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    addNoiseReport({
      space_id: spaceId,
      user_id: user.id,
      user_email: user.email,
      description,
    });

    toast({
      title: 'Report Submitted',
      description: 'Your noise report has been submitted.',
    });

    setSpaceId('');
    setDescription('');
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
            Report Noise
          </h1>
          <p className="text-muted-foreground">
            Help us maintain a quiet study environment
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-soft"
        >
          <motion.div 
            className="p-4 rounded-xl bg-warning/10 border border-warning/20 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <Volume2 className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Anonymous Reporting</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your report will help administrators take action while respecting everyone's privacy.
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
                  <option value="">Select the affected space</option>
                  {studySpaces.map(space => (
                    <option key={space.space_id} value={space.space_id}>
                      {space.space_name} - {space.location}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none min-h-[120px]"
                  placeholder="Describe the noise issue (e.g., loud conversations, phone calls, construction noise...)"
                  required
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Submit Report
              <Send className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NoiseReport;
