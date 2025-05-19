import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserPosts } from '../api/posts';
import { getUserProfile } from '../api/auth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PostCard from '../components/posts/PostCard';
import ProfileHeader from '../components/user/ProfileHeader';
import { Post, User } from '../types';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch user profile
        const userData = await getUserProfile(id);
        setUser(userData);
        
        // Fetch user posts
        const userPosts = await getUserPosts(id, 1);
        setPosts(userPosts);
        
        // Check if there might be more posts
        if (userPosts.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        setError('Failed to load profile');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
    // Reset state when ID changes
    return () => {
      setUser(null);
      setPosts([]);
      setLoading(true);
      setError(null);
      setPage(1);
      setHasMore(true);
    };
  }, [id]);

  const loadMorePosts = async () => {
    if (!id || !hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const morePosts = await getUserPosts(id, nextPage);
      
      if (morePosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...morePosts]);
        setPage(nextPage);
      }
    } catch (error) {
      toast.error('Failed to load more posts');
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (error || !user) {
    return (
      <div className="container py-12 text-center">
        <div className="bg-error/10 p-6 rounded-lg">
          <h1 className="text-xl font-medium text-error mb-2">
            {error || 'User not found'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ProfileHeader 
        user={user} 
        postsCount={posts.length} 
        onUserUpdated={setUser}
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No posts yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post}
                  onLikeChange={handlePostUpdate}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="btn btn-outline"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading more...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;