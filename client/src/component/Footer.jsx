function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">City Med Portal</div>
          <div className="footer-small">Patient-first appointment booking for modern clinics.</div>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px", color: "var(--muted)" }}>
            <a href="tel:+1234567890" style={{ color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>📞 +1 (234) 567-8900</a>
          </div>
          <div style={{ marginTop: "8px", display: "flex", gap: "12px", fontSize: "1.2rem" }}>
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>f</a>
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>𝕏</a>
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none" }}>in</a>
          </div>
        </div>
        <div>
          <h4 style={{ margin: "0 0 12px", color: "var(--text)", fontSize: "0.95rem", fontWeight: 700 }}>Quick Links</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a href="/doctors" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}>Browse Doctors</a>
            <a href="/appointment" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}>Book Appointment</a>
            <a href="/admin" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}>Admin Dashboard</a>
          </div>
        </div>
        <div>
          <h4 style={{ margin: "0 0 12px", color: "var(--text)", fontSize: "0.95rem", fontWeight: 700 }}>Emergency Support</h4>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ef4444", marginBottom: "8px" }}>🚑 24/7 Helpline</div>
          <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Call: <span style={{ fontWeight: 600, color: "var(--text)" }}>+1 (555) 911-2024</span></div>
          <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "8px" }}>Email: <span style={{ fontWeight: 600, color: "var(--text)" }}>emergency@citymedportal.com</span></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="footer-small">© 2026 City Med Portal. All rights reserved.</div>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "12px" }}>
            <a href="#" style={{ color: "var(--muted)", textDecoration: "none", marginRight: "16px" }}>Privacy Policy</a>
            <a href="#" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;