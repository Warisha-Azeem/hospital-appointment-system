import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors")
      .then((response) => {
        setDoctors(response.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load doctors at the moment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Our doctors</p>
          <h2>Experienced specialists ready to help.</h2>
          <p className="subtitle">Explore doctor profiles, review their experience, and book an appointment in one click.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0" }}>Loading doctors...</div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "#d97706", padding: "60px 0" }}>{error}</div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0" }}>
            No doctors available right now. Please check back later.
          </div>
        ) : (
          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexShrink: 0 }}>👨‍⚕️</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{doctor.name}</h3>
                    <div style={{ display: "inline-block", marginTop: "12px", padding: "7px 16px", borderRadius: "999px", background: "var(--accent-soft)", color: "var(--accent)", fontSize: "0.9rem", fontWeight: 700 }}>
                      {doctor.specialization}
                    </div>
                  </div>
                </div>

                <div style={{ color: "var(--muted)", lineHeight: 1.8, marginTop: "20px" }}>
                  <p style={{ margin: 0, display: "flex", gap: "8px" }}>
                    <span>📅</span>
                    <span><strong>Experience:</strong> {doctor.experience} years</span>
                  </p>
                  <p style={{ margin: "12px 0 0", display: "flex", gap: "8px" }}>
                    <span>💰</span>
                    <span><strong>Consultation:</strong> Rs {doctor.fees}</span>
                  </p>
                  {doctor.availableDays && doctor.availableDays.length > 0 ? (
                    <p style={{ margin: "12px 0 0", display: "flex", gap: "8px" }}>
                      <span>⏰</span>
                      <span><strong>Available:</strong> {doctor.availableDays.join(", ")}</span>
                    </p>
                  ) : null}
                </div>

                <button className="button button-primary" style={{ marginTop: "24px", width: "100%" }} onClick={() => navigate("/appointment")}>Book Appointment</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Doctors;