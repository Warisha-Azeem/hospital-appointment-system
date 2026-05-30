function Register() {
  return (
    <main className="site-shell">
      <section className="section section-compact" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <div className="form-card">
          <div className="section-heading">
            <p className="section-overline">Create account</p>
            <h2>Register as a patient</h2>
          </div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Full Name</label>
          <input className="input" type="text" placeholder="Jane Doe" />
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Email</label>
          <input className="input" type="email" placeholder="hello@example.com" />
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Password</label>
          <input className="input" type="password" placeholder="********" />
          <button className="button button-primary" style={{ width: "100%" }}>
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}

export default Register;