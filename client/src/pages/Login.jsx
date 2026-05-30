import { useState } from "react";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      console.log(response.data);

      alert("Login Successful");

    } catch(error) {

      console.log(error);

      alert("Login Failed");
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
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Email</label>
          <input className="input" type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Password</label>
          <input className="input" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="button button-primary" style={{ width: "100%" }} onClick={handleLogin}>
            Login
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;