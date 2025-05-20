import React, { useState, useEffect } from 'react';
import { getPosts } from '../../services/postService';
import { Post } from '../../types';
import PostCard from '../../components/post/PostCard';
import { Newspaper, TrendingUp, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, sortBy, activeCategory]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (activeCategory) {
        params.category = activeCategory;
      }

      // In a real API, you'd have a sort parameter
      // This is a placeholder for demonstration
      if (sortBy === 'popular') {
        params.sort = 'popular';
      }

      const response = await getPosts(params);
      setPosts(response.posts);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleSortChange = (newSortBy: 'latest' | 'popular') => {
    if (sortBy !== newSortBy) {
      setSortBy(newSortBy);
      setCurrentPage(1);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    if (activeCategory !== category) {
      setActiveCategory(category);
      setCurrentPage(1);
    }
  };

  const categories = [
    'Technology', 
    'Travel', 
    'Food', 
    'Health', 
    'Business', 
    'Art', 
    'Science'
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Stories, Ideas, and Expertise
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore a world of captivating content from our community of writers and creators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Sort controls */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleSortChange('latest')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === 'latest'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Newspaper size={16} />
                <span>Latest</span>
              </button>
              
              <button
                onClick={() => handleSortChange('popular')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === 'popular'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <TrendingUp size={16} />
                <span>Popular</span>
              </button>
            </div>
            
            <div className="lg:hidden">
              <button className="flex items-center text-gray-600 dark:text-gray-400">
                <Filter size={18} className="mr-1" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Posts list */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No posts found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdate={handlePostUpdate}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeCategory === null
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All Categories
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeCategory === category
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {['javascript', 'webdev', 'tutorial', 'programming', 'react', 'design', 'technology', 'productivity'].map((tag) => (
                  <a
                    key={tag}
                    href={`/tag/${tag}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;