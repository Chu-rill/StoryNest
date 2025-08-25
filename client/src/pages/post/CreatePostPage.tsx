import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { createPost } from "../../services/postService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import RichTextEditor from "../../components/post/RichTextEditor";
import MarkdownEditor from "../../components/post/MarkdownEditor";
import ImageUpload from "../../components/post/ImageUpload";
import LoadingSpinner, { ButtonLoader } from "../../components/ui/LoadingSpinner";
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
  format: z.enum(["rich", "markdown"]),
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

const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      format: "rich" as const,
      image: "",
      category: "",
      tags: "",
    },
  });

  const selectedFormat = watch("format");
  const onSubmit = async (data: PostFormData) => {
    if (!user) return;

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

      const newPost = await createPost(postData);
      toast.success("Post created successfully!");
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Share your thoughts with the world. Choose between rich text or markdown formatting.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="rich"
                      {...register("format")}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rich Text</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="markdown"
                      {...register("format")}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Markdown</span>
                  </label>
                </div>
                {errors.format && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.format.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  {...register("category")}
                  className={`
                    w-full px-4 py-2.5 bg-white dark:bg-gray-800 border 
                    ${
                      errors.category
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    } 
                    rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-900 dark:text-gray-100 transition-colors
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  selectedFormat === "markdown" ? (
                    <MarkdownEditor
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.content?.message}
                      placeholder="Write your post in markdown..."
                    />
                  ) : (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.content?.message}
                    />
                  )
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFormat === "markdown" 
                  ? "Using Markdown format - perfect for technical content and documentation" 
                  : "Using Rich Text format - great for general content with visual formatting"
                }
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <ButtonLoader />
                      <span className="ml-2">Creating...</span>
                    </>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatePostPage;
