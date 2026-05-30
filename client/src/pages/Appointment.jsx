import { useState } from "react";
import axios from "axios";

function Appointment() {

  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const steps = ["Patient Info", "Select Doctor", "Choose Date", "Confirm"];

  const getStepProgress = () => {
    if (patientName) return Math.max(1, currentStep);
    if (patientName && doctorName) return Math.max(2, currentStep);
    if (patientName && doctorName && date) return Math.max(3, currentStep);
    return currentStep;
  };

  const handleSubmit = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          patientName,
          doctorName,
          date,
          time
        }
      );

      alert("Appointment Booked");
      setCurrentStep(1);
      setPatientName("");
      setDoctorName("");
      setDate("");
      setTime("");

    } catch (error) {

      console.log(error);

      alert("Error");
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

            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Doctor</label>
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

            <button className="button button-primary" style={{ width: "100%", marginTop: "24px" }} onClick={handleSubmit}>
              ✓ Confirm Appointment
            </button>
          </div>
        </div>
      </section>
    </main>
  );

}

export default Appointment;