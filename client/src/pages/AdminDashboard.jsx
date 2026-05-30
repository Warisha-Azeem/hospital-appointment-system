function AdminDashboard() {

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Admin panel</p>
          <h2>Key statistics at a glance</h2>
          <p className="subtitle">Track doctor availability, appointment volume, and patient engagement from one dashboard.</p>
        </div>
        <div className="stat-grid">
          <div className="stat-card stat-doctors">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Doctors</h3>
                <p style={{ marginTop: "16px", fontSize: "2.5rem", fontWeight: 700, color: "var(--accent)" }}>4</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.2 }}>👨‍⚕️</div>
            </div>
            <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>Active medical professionals</p>
          </div>
          <div className="stat-card stat-appointments">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Appointments</h3>
                <p style={{ marginTop: "16px", fontSize: "2.5rem", fontWeight: 700, color: "#f59e0b" }}>10</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.2 }}>📅</div>
            </div>
            <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>Scheduled visits</p>
          </div>
          <div className="stat-card stat-patients">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0 }}>Total Patients</h3>
                <p style={{ marginTop: "16px", fontSize: "2.5rem", fontWeight: 700, color: "#06b6d4" }}>8</p>
              </div>
              <div style={{ fontSize: "3rem", opacity: 0.2 }}>🧑‍💼</div>
            </div>
            <p style={{ margin: "12px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>Registered patients</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;