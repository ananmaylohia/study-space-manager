import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

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
      timestamp: new Date().toISOString(),
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
      <div className="max-w-md">
        <h1 className="text-xl font-medium mb-4">Report Noise</h1>

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
                  {space.space_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background text-sm h-24 resize-none"
              placeholder="Describe the noise issue..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground text-sm"
          >
            Report Noise
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default NoiseReport;
