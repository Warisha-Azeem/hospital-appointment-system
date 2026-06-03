import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [reviewSubmittingId, setReviewSubmittingId] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  const updateReviewDraft = (id, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSubmitReview = async (id) => {
    const draft = reviewDrafts[id] || {};
    if (!draft.rating || !draft.review?.trim()) {
      alert("Please provide a rating and comment before submitting.");
      return;
    }

    setReviewSubmittingId(id);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}/review`,
        {
          rating: draft.rating,
          review: draft.review
        }
      );

      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? response.data.appointment : app))
      );
      alert("Thank you! Your review has been submitted.");
    } catch (err) {
      console.error(err);
      alert("Unable to submit review. Please try again.");
    } finally {
      setReviewSubmittingId(null);
    }
  };

  const visibleAppointments = appointments.filter(
    (app) => userEmail && app.patientEmail === userEmail
  );

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/appointments`)
      .then((res) => setAppointments(res.data));
  }, []);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_URL}`);

    socket.on("appointmentStatusUpdated", (payload) => {
      if (!payload?.appointment) return;
      const updated = payload.appointment;
      if (userEmail && updated.patientEmail !== userEmail) return;

      setAppointments((prev) =>
        prev.map((app) => (app._id === updated._id ? updated : app))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userEmail]);

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Your schedule</p>
          <h2>Upcoming appointments</h2>
          <p className="subtitle">Check all your booked visits and stay on top of your care plan.</p>
        </div>
        <div className="grid grid-2">
          {visibleAppointments.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
              No appointments found for your account.
            </div>
          ) : (
            visibleAppointments.map((app) => {
              const draft = reviewDrafts[app._id] || {};

              return (
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
                    <p style={{ margin: 0, marginTop: "8px" }}><strong>Status:</strong> {app.status}</p>
                  </div>

                  {app.status === "completed" ? (
                    <div style={{ marginTop: "18px" }}>
                      {app.reviewed ? (
                        <div style={{ background: "rgba(44, 139, 88, 0.08)", padding: "14px", borderRadius: "14px", border: "1px solid rgba(44, 139, 88, 0.16)" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "var(--accent)" }}>Your review</p>
                          <p style={{ margin: "10px 0 0" }}><strong>Rating:</strong> {app.rating} / 5</p>
                          <p style={{ margin: "10px 0 0" }}>{app.review}</p>
                        </div>
                      ) : (
                        <div style={{ marginTop: "16px", padding: "16px", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--surface)" }}>
                          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Leave a review for {app.doctorName}</p>
                          <label style={{ display: "block", marginBottom: "12px" }}>
                            Rating:
                            <select
                              value={draft.rating || ""}
                              onChange={(e) => updateReviewDraft(app._id, "rating", e.target.value)}
                              style={{ width: "100%", marginTop: "8px", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}
                            >
                              <option value="">Select rating</option>
                              {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                              ))}
                            </select>
                          </label>
                          <label style={{ display: "block", marginBottom: "12px" }}>
                            Comment:
                            <textarea
                              rows="4"
                              value={draft.review || ""}
                              onChange={(e) => updateReviewDraft(app._id, "review", e.target.value)}
                              style={{ width: "100%", marginTop: "8px", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}
                              placeholder="Share your experience with the doctor"
                            />
                          </label>
                          <button
                            className="button"
                            style={{ width: "100%", padding: "10px", fontSize: "0.95rem" }}
                            onClick={() => handleSubmitReview(app._id)}
                            disabled={reviewSubmittingId === app._id}
                          >
                            {reviewSubmittingId === app._id ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}

                  <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                    <button 
                      className="button" 
                      style={{ flex: 1, fontSize: "0.9rem", padding: "8px" }}
                      onClick={() => navigate(`/reschedule/${app._id}`)}
                    >
                      📅 Reschedule
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

export default Appointments;