import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card, { CardBody } from "../../components/ui/Card";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.username, data.email, data.password);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create account";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Username"
                type="text"
                {...register("username")}
                fullWidth
                error={errors.username?.message}
                icon={
                  <User
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
                placeholder="johndoe"
              />

              <Input
                label="Email Address"
                type="email"
                {...register("email")}
                fullWidth
                error={errors.email?.message}
                icon={
                  <Mail
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                type="password"
                {...register("password")}
                fullWidth
                error={errors.password?.message}
                icon={
                  <Lock
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
                placeholder="••••••••"
              />

              <Input
                label="Confirm Password"
                type="password"
                {...register("confirmPassword")}
                fullWidth
                error={errors.confirmPassword?.message}
                icon={
                  <Lock
                    size={18}
                    className="text-gray-500 dark:text-gray-400"
                  />
                }
                placeholder="••••••••"
              />

              <div className="text-sm text-gray-600 dark:text-gray-400">
                By signing up, you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
                .
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Create Account
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
