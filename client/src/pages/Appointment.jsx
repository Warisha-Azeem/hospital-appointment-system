import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Appointment() {

  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const steps = ["Patient Info", "Select Doctor", "Choose Date", "Confirm"];

  const getStepProgress = () => {
    if (patientName) return Math.max(1, currentStep);
    if (patientName && doctorName) return Math.max(2, currentStep);
    if (patientName && doctorName && date) return Math.max(3, currentStep);
    return currentStep;
  };

  // Check doctor availability when doctor, date, or time changes
  useEffect(() => {
    if (!doctorName || !date || !time) {
      setIsAvailable(true);
      return;
    }

    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/appointments`
        );

        const appointments = response.data || [];
        
        // Check if doctor has an appointment at the same date and time
        const conflict = appointments.some(
          (apt) =>
            apt.doctorName === doctorName &&
            apt.date === date &&
            apt.time === time
        );

        setIsAvailable(!conflict);
      } catch (error) {
        console.error("Error checking availability:", error);
        // If we can't check, assume available (fail open)
        setIsAvailable(true);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [doctorName, date, time]);

  const navigate = useNavigate();

  const handleSubmit = async () => {

    // simple client-side validation
    if (!patientName || !patientEmail || !doctorName || !date || !time) {
      alert("Please fill all fields before confirming the appointment.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check availability before submitting
    if (!isAvailable) {
      alert("This time slot is no longer available. Please select a different date or time.");
      return;
    }

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/appointments/book`,
        {
          patientName,
          patientEmail,
          doctorName,
          date,
          time
        }
      );

      const appointment = response?.data?.appointment || { patientName, patientEmail, doctorName, date, time };

      setCurrentStep(1);
      setPatientName("");
      setPatientEmail("");
      setDoctorName("");
      setDate("");
      setTime("");

      navigate("/confirmation", { state: { appointment } });

    } catch (error) {

      console.error(error);
      const message = error?.response?.data?.message || error.message || "Error booking appointment.";
      alert(message);
    }
  };

  return (
    <main className="site-shell">
      <section className="section">
        <div style={{ maxWidth: "840px", margin: "0 auto" }}>
          <div className="section-heading">
            <p className="section-overline">Book appointment</p>
            <h2>Schedule your visit with a specialist.</h2>
            <p className="subtitle">Fill the form below and confirm your appointment quickly.</p>
          </div>

          <div style={{ maxWidth: "520px", margin: "0 auto 40px" }}>
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div key={index} className="progress-step">
                  <div className={`step-circle ${index + 1 <= getStepProgress() ? "active" : ""}`}>
                    {index + 1 <= getStepProgress() ? "✓" : index + 1}
                  </div>
                  <span className={`step-label ${index + 1 <= getStepProgress() ? "active" : ""}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-card" style={{ maxWidth: "520px", margin: "0 auto" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>👤 Patient Name</label>
            <input className="input" type="text" placeholder="John Doe" value={patientName} onChange={(e) => setPatientName(e.target.value)} />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>📧 Email</label>
            <input className="input" type="email" placeholder="your.email@example.com" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>Doctor</label>
            <select className="select" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}>
              <option value="">Select Doctor</option>
              <option value="Dr Ahmed">Dr Ahmed - Cardiologist</option>
              <option value="Dr Sara">Dr Sara - Dermatologist</option>
              <option value="Dr Ali">Dr Ali - Neurologist</option>
              <option value="Dr Hina">Dr Hina - Pediatrician</option>
            </select>

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>📅 Date</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>⏰ Time</label>
            <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} />

            {/* Availability status message */}
            {doctorName && date && time && (
              <div style={{ 
                marginTop: "16px", 
                padding: "12px", 
                borderRadius: "8px", 
                backgroundColor: isAvailable ? "rgba(22, 163, 74, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: isAvailable ? "var(--accent)" : "#ef4444",
                fontSize: "0.95rem"
              }}>
                {checkingAvailability ? (
                  "⏳ Checking availability..."
                ) : isAvailable ? (
                  "✓ This slot is available"
                ) : (
                  "✗ This slot is already booked. Please choose a different time."
                )}
              </div>
            )}

            <button 
              className="button button-primary" 
              style={{ width: "100%", marginTop: "24px", opacity: (isAvailable && !checkingAvailability) ? 1 : 0.6, cursor: (isAvailable && !checkingAvailability) ? "pointer" : "not-allowed" }} 
              onClick={handleSubmit}
              disabled={!isAvailable || checkingAvailability}
            >
              ✓ Confirm Appointment
            </button>
          </div>
        </div>
      </section>
    </main>
  );

}

export default Appointment;