import { useEffect, useState } from "react";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/appointments")
      .then((res) => setAppointments(res.data));
  }, []);

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Your schedule</p>
          <h2>Upcoming appointments</h2>
          <p className="subtitle">Check all your booked visits and stay on top of your care plan.</p>
        </div>
        <div className="grid grid-2">
          {appointments.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
              No appointments found.
            </div>
          ) : (
            appointments.map((app) => (
              <div key={app._id} className="appointment-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{app.patientName}</h3>
                    <p style={{ margin: "10px 0 0", color: "var(--muted)" }}>{app.doctorName}</p>
                  </div>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>{app.time}</span>
                </div>
                <div style={{ marginTop: "18px", color: "var(--muted)" }}>
                  <p style={{ margin: 0 }}><strong>Date:</strong> {app.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Appointments;