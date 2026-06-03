import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      alert("Registration Successful!");
      console.log(response.data);

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(error);
      alert("Registration Failed");
    }
  };

  return (
    <main className="site-shell">
      <section
        className="section section-compact"
        style={{ maxWidth: "520px", margin: "0 auto" }}
      >
        <div className="form-card">
          <div className="section-heading">
            <p className="section-overline">Create account</p>
            <h2>Register as a patient</h2>
          </div>

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Full Name
          </label>

          <input
            className="input"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              marginTop: "15px",
              fontWeight: 600,
            }}
          >
            Email
          </label>

          <input
            className="input"
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              marginTop: "15px",
              fontWeight: 600,
            }}
          >
            Password
          </label>

          <input
            className="input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="button button-primary"
            style={{ width: "100%", marginTop: "20px" }}
            onClick={handleRegister}
          >
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}

export default Register;