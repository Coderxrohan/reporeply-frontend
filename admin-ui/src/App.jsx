import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import RepoDetails from "./components/RepoDetails";

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [days, setDays] = useState(7);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    fetch("/admin/metrics")
      .then(r => r.json())
      .then(setMetrics);

    fetch(`/admin/trends?days=${days}`)
      .then(r => r.json())
      .then(setTrends);
  }, [days]);

  if (!metrics) return <p>Loading…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>RepoReply Admin</h2>

      {/* Counters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <Stat label="Total Repos" value={metrics.totalRepos} />
        <Stat label="Total Reminders" value={metrics.totalReminders} />
        <Stat label="Pending" value={metrics.pendingReminders} />
        <Stat label="Sent Today" value={metrics.sentToday} />
      </div>

      {/* Toggle */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setDays(7)}>7 days</button>
        <button onClick={() => setDays(30)} style={{ marginLeft: 8 }}>
          30 days
        </button>
      </div>

      {/* Chart */}
      <h3>Reminders Sent ({days} days)</h3>

      <LineChart width={600} height={300} data={trends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="sent" stroke="#2563eb" />
      </LineChart>

      {/* Repo drilldown */}
      <h3 style={{ marginTop: 40 }}>Repo Drilldown</h3>

      <input
        placeholder="owner/repo"
        value={selectedRepo || ""}
        onChange={e => setSelectedRepo(e.target.value)}
        style={{ padding: 6, width: 260 }}
      />

      {selectedRepo && (
        <RepoDetails repoId={selectedRepo} />
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
        minWidth: 140
      }}
    >
      <strong>{label}</strong>
      <div>{value}</div>
    </div>
  );
}
