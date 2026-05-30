import { useNavigate } from "react-router-dom";
import hospitalImage from "../../97f55b12d8e89249ae098fc67ff86e66.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    
      <main className="site-shell">
        <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(11,18,35,0.72), rgba(11,18,35,0.72)), url('${hospitalImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "100px 0 120px",
          borderRadius: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="hero-copy">
          <span className="eyebrow">Your trusted clinic partner</span>
          <h1 className="section-title">Find doctors, book appointments, and manage care easily.</h1>
          <p className="subtitle">
            City Med Portal brings modern healthcare booking to your fingertips. Discover top specialists, compare profiles, and reserve visits in seconds.
          </p>

          <div className="hero-actions">
            <button className="button button-primary" onClick={() => navigate("/doctors")}>Browse Doctors</button>
            <button className="button button-secondary" onClick={() => navigate("/appointment")}>Book Appointment</button>
          </div>

          <div className="grid grid-3" style={{ marginTop: "40px" }}>
            <div className="feature-card">
              <h3 style={{ marginBottom: "10px" }}>Trusted doctors</h3>
              <p style={{ color: "var(--muted)" }}>Verified specialists with real experience and patient-focused care.</p>
            </div>
            <div className="feature-card">
              <h3 style={{ marginBottom: "10px" }}>Smooth booking</h3>
              <p style={{ color: "var(--muted)" }}>Fast appointment scheduling with clear availability.</p>
            </div>
            <div className="feature-card">
              <h3 style={{ marginBottom: "10px" }}>Care management</h3>
              <p style={{ color: "var(--muted)" }}>Keep track of visits and stay organized with appointment history.</p>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <img
            src={hospitalImage}
            alt="Hospital building"
            style={{ borderRadius: "24px", boxShadow: "0 28px 60px rgba(15,23,42,0.14)" }}
          />
          <div style={{ display: "grid", gap: "16px" }}>
            <div className="info-card">
              <h3 style={{ margin: 0 }}>Personalized care</h3>
              <p style={{ color: "var(--muted)", margin: "12px 0 0" }}>Track visits and get connected to specialists quickly.</p>
            </div>
            <div className="info-card">
              <h3 style={{ margin: 0 }}>24/7 support</h3>
              <p style={{ color: "var(--muted)", margin: "12px 0 0" }}>Friendly support to guide your booking experience.</p>
            </div>
          </div>
        </div>
        </section>

        <section className="section">
        <div className="section-heading">
          <p className="section-overline">What we offer</p>
          <h2>Everything patients need for faster care.</h2>
        </div>
        <div className="grid grid-3">
          <div className="info-card">
            <h3>Doctor discovery</h3>
            <p style={{ color: "var(--muted)", marginTop: "12px" }}>Search by specialty, experience, and consultation fee.</p>
          </div>
          <div className="info-card">
            <h3>Smart booking</h3>
            <p style={{ color: "var(--muted)", marginTop: "12px" }}>Reserve visits with flexible date and time choices.</p>
          </div>
          <div className="info-card">
            <h3>Appointment history</h3>
            <p style={{ color: "var(--muted)", marginTop: "12px" }}>Keep track of scheduled and past visits.</p>
          </div>
        </div>
      </section>

      <button className="floating-fab" onClick={() => navigate("/appointment")} title="Book Appointment" aria-label="Book appointment">
        📅
      </button>
    </main>
);
}

export default Home;