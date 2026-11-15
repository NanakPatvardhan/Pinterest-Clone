import { useState, useContext } from "react";import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";


export default function Login() {

    const [email, setEmail] = useState("");
const [password, setPassword] = useState("");


const authContext = useContext(AuthContext);

if (!authContext) {
  throw new Error("Login must be used inside AuthProvider");
}

const { login } = authContext;
const navigate = useNavigate();

const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  setError(null);
  setLoading(true);

  try {
    await login(email, password);
    navigate("/");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Login failed");
  } finally {
    setLoading(false);
  }
}return (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">P</div>

      <h1>Welcome back</h1>
      <p className="auth-subtitle">Log in to discover your inspiration.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  </div>
);

}