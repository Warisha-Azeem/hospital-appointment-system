import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("today");
  const [submittingId, setSubmittingId] = useState(null);

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!userName || userRole !== "doctor") {
      setError("You must be logged in as a doctor to view this dashboard.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/appointments/doctor/${encodeURIComponent(userName)}`
        );
        setAppointments(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load your appointments right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userName, userRole]);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!appointments.length) return [];

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const diff = (appointmentDate - today) / (1000 * 60 * 60 * 24);
      if (viewMode === "today") {
        return (
          appointmentDate.getFullYear() === today.getFullYear() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getDate() === today.getDate()
        );
      }
      return diff >= 0 && diff < 7;
    });
  }, [appointments, today, viewMode]);

  const upcomingCount = filteredAppointments.length;
  const weekCount = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const diff = (appointmentDate - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < 7;
  }).length;

  const handleMarkComplete = async (id) => {
    setSubmittingId(id);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}`,
        { status: "Completed" }
      );
      setAppointments((prev) => prev.map((item) => item._id === id ? { ...item, status: "Completed" } : item));
    } catch (err) {
      console.error(err);
      alert("Unable to update appointment status. Please try again.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0" }}>
            Loading doctor schedule...
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2>{error}</h2>
            <button className="button" style={{ marginTop: 24 }} onClick={() => navigate(userRole === "doctor" ? "/" : "/login")}>Go back</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Doctor dashboard</p>
          <h2>Welcome back, {userName}</h2>
          <p className="subtitle">Review your appointments for today and the coming week, and mark visits complete as patients are seen.</p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: "24px" }}>
          <div className="stat-card stat-appointments">
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>Today</p>
              <h3 style={{ margin: "12px 0 0", fontSize: "2rem" }}>{viewMode === "today" ? upcomingCount : weekCount}</h3>
              <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>{viewMode === "today" ? "Appointments today" : "Appointments this week"}</p>
            </div>
          </div>
          <div className="stat-card stat-doctors">
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>View</p>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button className={`button ${viewMode === "today" ? "button-primary" : ""}`} style={{ flex: 1 }} onClick={() => setViewMode("today")}>Today</button>
                <button className={`button ${viewMode === "week" ? "button-primary" : ""}`} style={{ flex: 1 }} onClick={() => setViewMode("week")}>This Week</button>
              </div>
            </div>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
            No appointments scheduled for this {viewMode === "today" ? "day" : "week"}. Enjoy the downtime or review your schedule later.
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: "20px" }}>
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{appointment.patientName}</h3>
                    <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>{appointment.patientEmail}</p>
                  </div>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>{appointment.time}</span>
                </div>
                <div style={{ marginTop: "18px", color: "var(--muted)" }}>
                  <p style={{ margin: 0 }}><strong>Date:</strong> {appointment.date}</p>
                  <p style={{ margin: "12px 0 0" }}><strong>Status:</strong> <span style={{ color: appointment.status === "Completed" ? "#16a34a" : "#f59e0b" }}>{appointment.status}</span></p>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button
                    className="button"
                    style={{ flex: 1, opacity: appointment.status === "Completed" ? 0.6 : 1, cursor: appointment.status === "Completed" ? "not-allowed" : "pointer" }}
                    disabled={appointment.status === "Completed" || submittingId === appointment._id}
                    onClick={() => handleMarkComplete(appointment._id)}
                  >
                    {appointment.status === "Completed" ? "Completed" : submittingId === appointment._id ? "Marking..." : "Mark Complete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DoctorDashboard;
