import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout';

const Dashboard = () => {
  const { studySpaces } = useData();
  const navigate = useNavigate();

  const handleBook = (spaceId: string) => {
    navigate(`/book?space=${spaceId}`);
  };

  return (
    <Layout>
      <div>
        <h1 className="text-xl font-medium mb-4">Available Study Spaces</h1>

        <table className="w-full border border-border text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-3 py-2 border-b border-border">Space Name</th>
              <th className="text-left px-3 py-2 border-b border-border">Location</th>
              <th className="text-left px-3 py-2 border-b border-border">Capacity</th>
              <th className="text-left px-3 py-2 border-b border-border">Type</th>
              <th className="text-left px-3 py-2 border-b border-border">Action</th>
            </tr>
          </thead>
          <tbody>
            {studySpaces.map(space => (
              <tr key={space.space_id} className="border-b border-border">
                <td className="px-3 py-2">{space.space_name}</td>
                <td className="px-3 py-2">{space.location}</td>
                <td className="px-3 py-2">{space.capacity}</td>
                <td className="px-3 py-2">{space.type}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleBook(space.space_id)}
                    className="px-3 py-1 bg-primary text-primary-foreground text-xs"
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Dashboard;
