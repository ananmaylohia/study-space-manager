import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout';
import { MapPin, Users, BookOpen, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { studySpaces } = useData();
  const navigate = useNavigate();

  const handleBook = (spaceId: string) => {
    navigate(`/book?space=${spaceId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'quiet':
        return 'bg-success/10 text-success border-success/20';
      case 'group':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'computer':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
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
            Available Study Spaces
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Find and book your perfect study environment
          </motion.p>
        </div>

        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {studySpaces.map((space, index) => (
            <motion.div
              key={space.space_id}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-soft hover:border-primary/30 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                    <BookOpen className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(space.type)}`}>
                    {space.type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {space.space_name}
                </h3>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{space.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Capacity: {space.capacity} people</span>
                  </div>
                </div>

                <motion.button
                  onClick={() => handleBook(space.space_id)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Now
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {studySpaces.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No spaces available</h3>
            <p className="text-muted-foreground">Check back later for available study spaces.</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
