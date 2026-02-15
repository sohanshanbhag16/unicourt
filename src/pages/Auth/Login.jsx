import { useState } from "react";
import { pesuLogin } from "../../services/pesu-auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [srn, setSrn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await pesuLogin(srn, password);

      if (!res.status) {
        throw new Error(res.message || "Authentication failed");
      }

      login(res.profile);
      navigate("/courts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      {/* BRAND */}
      <div className="auth-header">
        <h1 className="brand">UniCourt</h1>
        <p className="tagline">
          Book courts faster. Play more.
        </p>
      </div>

      {/* LOGIN CARD */}
      <form className="auth-card" onSubmit={handleLogin}>

        <h2 className="welcome">Welcome Back</h2>
        <p className="subtitle">Sign in using your PESU Credentials</p>

        {error && <p className="auth-error">{error}</p>}

        <input
          className="auth-input"
          placeholder="SRN / PRN"
          value={srn}
          onChange={(e) => setSrn(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="PESU Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </form>
    </div>
  );
}
