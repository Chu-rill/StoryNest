import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { updatePost, getPostById } from "../../services/postService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import RichTextEditor from "../../components/post/RichTextEditor";
import ImageUpload from "../../components/post/ImageUpload";
import Card, {
  CardBody,
  CardHeader,
  CardFooter,
} from "../../components/ui/Card";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Technology",
  "Travel",
  "Food",
  "Health",
  "Business",
  "Art",
  "Science",
  "Other",
];

const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(200, "Summary must be at most 200 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  image: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  tags: z.string().refine(
    (val) => {
      // Allow empty tags
      if (!val) return true;
      // Check if tags are properly formatted
      const tags = val.split(",").map((tag) => tag.trim());
      return tags.every(
        (tag) =>
          tag.length > 0 && tag.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(tag)
      );
    },
    {
      message:
        "Tags must be separated by commas and only contain letters, numbers, underscores, or hyphens",
    }
  ),
});

type PostFormData = z.infer<typeof postSchema>;

const EditPostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postNotFound, setPostNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      image: "",
      category: "",
      tags: "",
    },
  });

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setPostNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const post = await getPostById(postId);

        // Check if current user is the author
        const getAuthorId = (author: any) => author?.id || author?._id;
        const getUserId = (user: any) => user?.id || user?._id;
        const isAuthor =
          post &&
          user &&
          post.post.author &&
          getAuthorId(post.post.author) === getUserId(user);
        if (!isAuthor) {
          toast.error("You can only edit your own posts");
          navigate("/");
          return;
        }

        // Convert tags array to comma-separated string
        const tagsString = Array.isArray(post.post.tags)
          ? post.post.tags.join(", ")
          : "";

        // Reset form with fetched data
        reset({
          title: post.post.title || "",
          summary: post.post.summary || "",
          content: post.post.content || "",
          image: post.post.image || "",
          category: post.post.category || "",
          tags: tagsString,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        toast.error("Failed to load post data");
        setPostNotFound(true);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, user?.id, reset, navigate]);

  const onSubmit = async (data: PostFormData) => {
    if (!user || !postId) return;

    setIsSubmitting(true);
    try {
      // Transform tags from comma-separated string to array
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const postData = {
        ...data,
        tags: tagsArray,
      };

      const response = await updatePost(postId, postData);
      const updatedPost = response.post;
      toast.success("Post updated successfully!");
      //   console.log(response);
      navigate(`/post/${updatedPost.id}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
          <Card>
            <CardBody>
              <div className="space-y-6">
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Post not found state
  if (postNotFound) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <Card>
          <CardBody className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The post you're trying to edit doesn't exist or you don't have
              permission to edit it.
            </p>
            <Button onClick={() => navigate("/")}>Go Back Home</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Post
      </h1>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="Enter your post title"
              {...register("title")}
              error={errors.title?.message}
              fullWidth
            />

            <TextArea
              label="Summary"
              placeholder="Write a brief summary of your post"
              {...register("summary")}
              error={errors.summary?.message}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  {...register("category")}
                  className={`
                    w-full px-4 py-2 bg-white dark:bg-gray-800 border 
                    ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } 
                    rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-900 dark:text-gray-100
                  `}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <Input
                label="Tags (comma separated)"
                type="text"
                placeholder="reactjs, webdev, tutorial"
                {...register("tags")}
                error={errors.tags?.message}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={errors.image?.message}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content?.message}
                  />
                )}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/post/${postId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Update Post
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditPostPage;
