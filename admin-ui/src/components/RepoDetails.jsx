import { useEffect, useState } from "react";

export default function RepoDetails({ repoId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/admin/repos/${repoId}`)
      .then(r => {
        if (!r.ok) throw new Error("Repo not found");
        return r.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [repoId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading repo data…</p>;

  return (
    <div
      style={{
        marginTop: 20,
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 8
      }}
    >
      <h4>{repoId}</h4>

      <p>Total reminders: {data.totalReminders}</p>
      <p>Pending: {data.pending}</p>
      <p>Sent: {data.sent}</p>

      <h5>Recent reminders</h5>
      <ul>
        {data.recent.map(r => (
          <li key={r.id}>
            Issue #{r.issueNumber} — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
