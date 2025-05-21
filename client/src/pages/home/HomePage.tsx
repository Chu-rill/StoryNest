import React, { useState, useEffect } from "react";
import { getPosts } from "../../services/postService";
import { Post } from "../../types";
import PostCard from "../../components/post/PostCard";
import { Newspaper, TrendingUp, Filter } from "lucide-react";
import Button from "../../components/ui/Button";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

      if (sortBy === "popular") {
        params.sort = "popular";
      }

      const response = await getPosts(params);
      setPosts(response.posts);
      setTotalPages(response.pages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleSortChange = (newSortBy: "latest" | "popular") => {
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
    // Close mobile filters if open
    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
  };

  const categories = [
    "Technology",
    "Travel",
    "Food",
    "Health",
    "Business",
    "Art",
    "Science",
  ];

  const popularTags = [
    "javascript",
    "webdev",
    "tutorial",
    "programming",
    "react",
    "design",
    "technology",
    "productivity",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Stories, Ideas, and Expertise
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore a world of captivating content from our community of writers
          and creators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area - takes up more space */}
        <div className="lg:col-span-3">
          {/* Sort controls */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleSortChange("latest")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "latest"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Newspaper size={16} />
                <span>Latest</span>
              </button>

              <button
                onClick={() => handleSortChange("popular")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                  sortBy === "popular"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <TrendingUp size={16} />
                <span>Popular</span>
              </button>
            </div>

            <div className="lg:hidden">
              <button
                className="flex items-center text-gray-600 dark:text-gray-400"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter size={18} className="mr-1" />
                <span>{showMobileFilters ? "Hide Filters" : "Filters"}</span>
              </button>
            </div>
          </div>

          {/* Mobile filters - shown only on small screens */}
          {showMobileFilters && (
            <div className="lg:hidden mb-6 grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`px-2 py-1 rounded text-xs ${
                      activeCategory === null
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-2 py-1 rounded text-xs ${
                        activeCategory === category
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 6).map((tag) => (
                    <a
                      key={tag}
                      href={`/tag/${tag}`}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded text-xs"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - more compact */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {/* Categories - more compact layout */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    activeCategory === null
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      activeCategory === category
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags - more compact layout */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <a
                    key={tag}
                    href={`/tag/${tag}`}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>

            {/* New section: Newsletter or Featured post could go here */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Join Our Newsletter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
