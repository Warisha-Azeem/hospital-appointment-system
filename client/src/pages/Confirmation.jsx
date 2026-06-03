import { useLocation, useNavigate } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  if (!appointment) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2>No appointment found</h2>
            <p className="subtitle">You don't have a recent appointment to display.</p>
            <div style={{ marginTop: 24 }}>
              <button className="button" onClick={() => navigate('/appointment')}>Book an appointment</button>
              <button className="button" style={{ marginLeft: 12 }} onClick={() => navigate('/')}>Go Home</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const receiptId = appointment._id || appointment.id || String(Date.now());

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Confirmation</p>
          <h2>Your appointment is confirmed</h2>
          <p className="subtitle">Below is your appointment summary and receipt. You can print this page for your records.</p>
        </div>

        <div className="form-card" style={{ maxWidth: 720, margin: '24px auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Appointment Receipt</h3>
            <div style={{ color: 'var(--muted)' }}>Receipt #: {receiptId}</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <p style={{ margin: '8px 0' }}><strong>Patient:</strong> {appointment.patientName}</p>
            <p style={{ margin: '8px 0' }}><strong>Doctor:</strong> {appointment.doctorName}</p>
            <p style={{ margin: '8px 0' }}><strong>Date:</strong> {appointment.date}</p>
            <p style={{ margin: '8px 0' }}><strong>Time:</strong> {appointment.time}</p>
            {appointment.status && <p style={{ margin: '8px 0' }}><strong>Status:</strong> {appointment.status}</p>}
            {appointment.fees && <p style={{ margin: '8px 0' }}><strong>Fees:</strong> Rs {appointment.fees}</p>}
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="button button-primary" onClick={() => window.print()}>Print Receipt</button>
            <button className="button" onClick={() => navigate('/appointments')}>View My Appointments</button>
            <button className="button" onClick={() => navigate('/')}>Back to Home</button>
          </div>

          <div style={{ marginTop: 20, color: 'var(--muted)' }}>
            <small>This receipt confirms your appointment request. Please arrive 10 minutes before your scheduled time.</small>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Confirmation;
