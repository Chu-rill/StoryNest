import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import { Post } from '../../types';
import PostCard from '../../components/post/PostCard';
import Input from '../../components/ui/Input';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchPosts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setSearchResults(
      searchResults.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <Input
            type="text"
            placeholder="Search posts, tags, and topics..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            fullWidth
            icon={<SearchIcon size={18} className="text-gray-500 dark:text-gray-400" />}
          />
        </form>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      ) : query && searchResults.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No results found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any posts matching your search query.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Try different keywords or check out our{' '}
            <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              latest posts
            </Link>
            .
          </p>
        </div>
      ) : query ? (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Found {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </p>
          
          {searchResults.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={handlePostUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Search for content
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter keywords above to find posts, topics, and more.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;