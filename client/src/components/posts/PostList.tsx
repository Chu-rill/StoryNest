import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllPosts } from '../../api/posts';
import { Post } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import PostCard from './PostCard';

interface PostListProps {
  searchQuery?: string;
}

const PostList = ({ searchQuery }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const loadPosts = async (page: number) => {
    try {
      setLoading(true);
      const fetchedPosts = await getAllPosts(page);
      
      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => page === 1 ? fetchedPosts : [...prevPosts, ...fetchedPosts]);
      }
    } catch (error) {
      toast.error('Failed to load posts');
      console.error(error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  useEffect(() => {
    // Reset pagination when search query changes
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Filtering posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  if (initialLoad) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner message="Loading posts..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No posts matching "${searchQuery}"` 
              : "There are no posts yet. Be the first to create one!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
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
                onClick={handleLoadMore}
                disabled={loading}
                className="btn btn-outline"
              >
                {loading ? (
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
  );
};

export default PostList;