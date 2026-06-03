import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get userId from localStorage (set during login)
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/${userId}`
      );
      setUser(response.data);
      setName(response.data.name);
      setPhone(response.data.phone || "");
      setProfilePicture(response.data.profilePicture || "");
      setPreview(response.data.profilePicture || "");
    } catch (err) {
      console.error(err);
      setError("Unable to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    // Basic phone validation (10-15 digits)
    const phoneRegex = /^[0-9\-\+\s\(\)]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/${userId}`,
        {
          name,
          phone,
          profilePicture
        }
      );

      setUser(response.data.user);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const errMsg =
        err?.response?.data?.message || "Error updating profile. Please try again.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", color: "var(--muted)", padding: "60px 0" }}>
            Loading profile...
          </div>
        </section>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="site-shell">
        <section className="section">
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <h2>{error}</h2>
            <button className="button" style={{ marginTop: 24 }} onClick={() => navigate("/login")}>
              Go to Login
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
            <p className="section-overline">Account</p>
            <h2>Your Profile</h2>
            <p className="subtitle">Update your personal information and profile picture.</p>
          </div>

          <div className="form-card" style={{ maxWidth: "520px", margin: "0 auto" }}>
            {message && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(22, 163, 74, 0.1)",
                  color: "var(--accent)",
                  fontSize: "0.95rem"
                }}
              >
                ✓ {message}
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  fontSize: "0.95rem"
                }}
              >
                ✗ {error}
              </div>
            )}

            {/* Profile Picture */}
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: preview ? `url(${preview})` : "var(--accent-soft)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  color: "var(--accent)"
                }}
              >
                {!preview && "👤"}
              </div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                📷 Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: "block",
                  margin: "8px auto",
                  padding: "8px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  width: "100%"
                }}
              />
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "8px 0 0" }}>
                Supported formats: JPG, PNG (Max 5MB)
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
                👤 Name
              </label>
              <input
                className="input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, marginTop: "16px" }}>
                📱 Phone Number
              </label>
              <input
                className="input"
                type="tel"
                placeholder="+1 (234) 567-8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface)",
                  fontSize: "0.9rem"
                }}
              >
                <strong>Email:</strong> {user?.email}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  className="button button-primary"
                  type="submit"
                  style={{ flex: 1, opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                  disabled={submitting}
                >
                  {submitting ? "⏳ Saving..." : "✓ Save Changes"}
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={() => navigate("/")}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>

            <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                <strong>Account created:</strong> {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
