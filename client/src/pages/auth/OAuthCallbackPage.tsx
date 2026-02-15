import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        toast.error(
          `Authentication failed: ${error.replace(/_/g, " ")}`
        );
        navigate("/login", { replace: true });
        return;
      }

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));

          // Save token and user to localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Update auth context
          setToken(token);
          setUser(user);

          toast.success("Logged in successfully with Google!");
          navigate("/", { replace: true });
        } catch (error) {
          console.error("Error parsing OAuth response:", error);
          toast.error("Authentication failed. Please try again.");
          navigate("/login", { replace: true });
        }
      } else {
        toast.error("Invalid authentication response");
        navigate("/login", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
