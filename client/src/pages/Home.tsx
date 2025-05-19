import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PostList from '../components/posts/PostList';

const Home = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    setSearchQuery(query || '');
  }, [location.search]);

  return (
    <div className="container py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insights, experiences and knowledge shared by our community.
        </p>
      </div>
      
      {searchQuery && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Search results for: <span className="text-primary">"{searchQuery}"</span>
          </h2>
        </div>
      )}
      
      <PostList searchQuery={searchQuery} />
    </div>
  );
};

export default Home;