import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [srn, setSrn] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!srn.trim()) {
      alert("Please enter your SRN");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCred.user;

      // 2️⃣ Store SRN in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        srn: srn.toUpperCase(),
        createdAt: serverTimestamp(),
      });

      navigate("/courts");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2 className="auth-title">Register</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="PESU Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="text"
          placeholder="SRN (eg. PES1UG22CS123)"
          value={srn}
          onChange={(e) => setSrn(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button className="auth-btn" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <div className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
