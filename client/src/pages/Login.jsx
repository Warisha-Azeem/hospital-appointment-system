import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password
        }
      );

      const { token, user } = response.data;

      // Store token and user info in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role || "patient");

      alert("Login Successful");
      navigate("/");

    } catch(error) {

      console.error(error);
      const errMsg = error?.response?.data?.message || "Login failed. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-shell">
      <section className="section section-compact" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="form-card">
          <div className="section-heading">
            <p className="section-overline">Welcome back</p>
            <h2>Sign in to your account</h2>
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontSize: "0.95rem"
              }}
            >
              ✗ {error}
            </div>
          )}

          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Email</label>
          <input className="input" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>Password</label>
          <input className="input" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button 
            className="button button-primary" 
            style={{ width: "100%", marginTop: "24px", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }} 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;