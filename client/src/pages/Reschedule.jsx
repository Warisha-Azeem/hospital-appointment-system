import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Reschedule() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch the appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          "${import.meta.env.VITE_API_URL}/appointments"
        );
        const apt = response.data.find((a) => a._id === appointmentId);
        if (apt) {
          setAppointment(apt);
          setNewDate(apt.date);
          setNewTime(apt.time);
        } else {
          setError("Appointment not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load appointment.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  // Check doctor availability for new date/time
  useEffect(() => {
    if (!appointment || !newDate || !newTime) {
      setIsAvailable(true);
      return;
    }

    // If date/time hasn't changed, it's available
    if (newDate === appointment.date && newTime === appointment.time) {
      setIsAvailable(true);
      return;
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const response = await axios.get(
          "${import.meta.env.VITE_API_URL}/appointments"
        );

        const appointments = response.data || [];

        // Check if doctor has an appointment at the new date and time (excluding current appointment)
        const conflict = appointments.some(
          (apt) =>
            apt._id !== appointmentId &&
            apt.doctorName === appointment.doctorName &&
            apt.date === newDate &&
            apt.time === newTime
        );

        setIsAvailable(!conflict);
      } catch (err) {
        console.error("Error checking availability:", err);
        setIsAvailable(true);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [appointment, newDate, newTime, appointmentId]);

  const handleReschedule = async () => {
    if (!isAvailable) {
      alert("This time slot is not available. Please choose a different date or time.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/appointments/${appointmentId}`,
        {
          date: newDate,
          time: newTime
        }
      );

      alert("Appointment rescheduled successfully!");
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Error rescheduling appointment.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0" }}>
            Loading appointment...
          </div>
        </section>
      </main>
    );
  }

  if (error || !appointment) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2>{error || "Appointment not found"}</h2>
            <button className="button" style={{ marginTop: 24 }} onClick={() => navigate("/appointments")}>
              Back to Appointments
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <section className="section">
        <div style={{ maxWidth: "840px", margin: "0 auto" }}>
          <div className="section-heading">
            <p className="section-overline">Reschedule appointment</p>
            <h2>Change your appointment date or time</h2>
            <p className="subtitle">Select a new date and time for your visit.</p>
          </div>

          <div className="form-card" style={{ maxWidth: "520px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "16px" }}>Current Appointment</h3>
            <div style={{ padding: "16px", backgroundColor: "var(--surface)", borderRadius: "var(--radius-sm)", marginBottom: "24px" }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Doctor:</strong> {appointment.doctorName}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Date:</strong> {appointment.date}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Time:</strong> {appointment.time}
              </p>
            </div>

            <h3 style={{ marginBottom: "16px", marginTop: "28px" }}>New Date & Time</h3>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>📅 New Date</label>
            <input
              className="input"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>⏰ New Time</label>
            <input
              className="input"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            {/* Availability status */}
            {newDate && newTime && (newDate !== appointment.date || newTime !== appointment.time) && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: isAvailable ? "rgba(22, 163, 74, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  color: isAvailable ? "var(--accent)" : "#ef4444",
                  fontSize: "0.95rem"
                }}
              >
                {checkingAvailability ? (
                  "⏳ Checking availability..."
                ) : isAvailable ? (
                  "✓ This slot is available"
                ) : (
                  "✗ This slot is already booked. Please choose a different time."
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                className="button button-primary"
                style={{ flex: 1, opacity: (isAvailable && !checkingAvailability && !submitting) ? 1 : 0.6, cursor: (isAvailable && !checkingAvailability && !submitting) ? "pointer" : "not-allowed" }}
                onClick={handleReschedule}
                disabled={!isAvailable || checkingAvailability || submitting}
              >
                {submitting ? "⏳ Rescheduling..." : "✓ Confirm Reschedule"}
              </button>
              <button
                className="button"
                onClick={() => navigate("/appointments")}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Reschedule;
