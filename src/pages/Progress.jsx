import React from "react";

export default function Progress() {
  // Placeholder: Replace with real stats logic
  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Progress & Stats</h2>
      <ul style={{ fontSize: 18, lineHeight: 2 }}>
        <li>Total Stars: <b>6</b></li>
        <li>Challenges Completed: <b>0</b></li>
        <li>Current Streak: <b>0 days</b></li>
        <li>Subscription: <b>Trial</b></li>
      </ul>
      <p style={{ color: '#888', marginTop: 24 }}>More stats coming soon!</p>
    </div>
  );
}

