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

      // ✅ Save only profile data (NO PASSWORD)
      login(res.profile);
      console.log("LOGIN RESPONSE:", res);

      navigate("/courts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2 className="auth-title">UniCourt Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
