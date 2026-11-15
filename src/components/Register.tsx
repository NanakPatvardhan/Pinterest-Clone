import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";



export default function Register() {

    const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const authContext = useContext(AuthContext);

if (!authContext) {
  throw new Error("Register must be used inside AuthProvider");
}

const { register } = authContext;
const navigate = useNavigate();

const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  setError(null);
  setLoading(true);

  try {
    await register(username, email, password);
    navigate("/");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Registration failed");
  } finally {
    setLoading(false);
  }
}
return (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">P</div>

      <h1>Create an account</h1>
      <p className="auth-subtitle">Start collecting your inspiration.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  </div>
);

}