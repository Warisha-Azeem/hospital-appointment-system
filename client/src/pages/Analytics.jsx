import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    dailyStats: [],
    weeklyStats: [],
    doctorStats: [],
    peakHours: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/appointments/analytics`)
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load analytics data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const { dailyStats, weeklyStats, doctorStats, peakHours } = analytics;

  return (
    <main className="site-shell">
      <section className="section">
        <div className="section-heading">
          <p className="section-overline">Operations insight</p>
          <h2>Analytics Dashboard</h2>
          <p className="subtitle">Track appointment volume, top doctors, and the busiest booking times.</p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: "30px", textAlign: "center" }}>
            Loading analytics...
          </div>
        ) : error ? (
          <div className="card" style={{ padding: "30px", textAlign: "center", color: "var(--error)" }}>
            {error}
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: "28px" }}>
            <div className="card">
              <h3>Appointments per day</h3>
              <p className="subtitle" style={{ marginBottom: "20px" }}>Daily booking volume for the current schedule.</p>
              {dailyStats.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--muted)" }}>No appointment history available.</div>
              ) : (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={dailyStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#16a34a" fill="#dcfce7" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Appointments per week</h3>
              <p className="subtitle" style={{ marginBottom: "20px" }}>Weekly totals grouped by booking week.</p>
              {weeklyStats.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--muted)" }}>No weekly analytics yet.</div>
              ) : (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <AreaChart data={weeklyStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#047857" fill="#dcfce7" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Most booked doctors</h3>
              <p className="subtitle" style={{ marginBottom: "20px" }}>Top specialists by appointment count.</p>
              {doctorStats.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--muted)" }}>No doctor booking data available.</div>
              ) : (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={doctorStats} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                      <XAxis dataKey="doctor" tick={{ fontSize: 12 }} interval={0} angle={-25} textAnchor="end" height={80} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="card">
              <h3>Peak booking times</h3>
              <p className="subtitle" style={{ marginBottom: "20px" }}>Most popular appointment hours.</p>
              {peakHours.length === 0 ? (
                <div style={{ padding: "20px", color: "var(--muted)" }}>No booking time data available.</div>
              ) : (
                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={peakHours} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Analytics;
