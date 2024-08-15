import { useState } from "react";
import { toast } from "react-hot-toast";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    const success = handleInputErrors(username, password);
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("https://nspire.vercel.app/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Login Successful");
        return data; // Return user info here
      } else {
        console.error("Server response:", res.status, res.statusText);
        toast.error("Login failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill all fields");
    return false;
  }
  return true; // Ensure the function returns true if all checks are passed
}

export default useLogin;
