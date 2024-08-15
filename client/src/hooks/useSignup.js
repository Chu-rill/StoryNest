import { useState } from "react";
import { toast } from "react-hot-toast";

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async (username, password) => {
    const success = handleInputErrors(username, password);
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("https://nspire.vercel.app/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json(); // Return user info or any relevant data
        toast.success("SignUp Successful");
        return data; // Ensure you return the data
      } else {
        toast.error("Signup failed");
        console.error("Error response:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

function handleInputErrors(username, password) {
  if (!username || !password) {
    toast.error("Please fill all fields");
    return false;
  }
  return true; // Ensure the function returns true if all checks are passed
}

export default useSignup;
