import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Building, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const { login, user, isLoading } = useAuth();

  // -----------------------------
  // Hooks are always called first
  // -----------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // -----------------------------
  // Only redirect if user is confirmed and auth is done loading
  // -----------------------------
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show a spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(0,0%,6%)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(142,76%,36%)]"></div>
      </div>
    );
  }

  // -----------------------------
  // Handle login submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  // -----------------------------
  // Render login form
  // -----------------------------
  return (
    <div className="min-h-screen bg-[hsl(0,0%,6%)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[hsl(142,76%,36%)] rounded-2xl mb-4">
            <Building className="w-8 h-8 text-[hsl(0,0%,98%)]" />
          </div>
          <h1 className="text-3xl font-bold text-[hsl(0,0%,98%)]">
            Welcome Back
          </h1>
          <p className="text-[hsl(0,0%,98%)] mt-2">
            Sign in to your EMS account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[hsl(0,0%,98%)] mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-hsl(var(--border)) rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter your email"
            />
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[hsl(0,0%,98%)]"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[hsl(142,76%,36%)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-hsl(var(--border)) rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-[hsl(0,0%,98%)] pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[hsl(0,0%,80%)] hover:text-[hsl(0,0%,98%)]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 border border-red-600 bg-red-500/10 text-red-600 rounded-lg transition-opacity duration-500 ease-in-out animate-fadeIn">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,40%)] text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
