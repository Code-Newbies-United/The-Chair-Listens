import { useCallback, useEffect, useState } from "react";

export default function AdminTeam() {
  const [team, setTeam] = useState({ me: null, admins: [], invites: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState("");

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/team", {
        credentials: "same-origin"
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Could not load the admin team.");

      setTeam({
        me: data.me,
        admins: Array.isArray(data.admins) ? data.admins : [],
        invites: Array.isArray(data.invites) ? data.invites : []
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  async function handleAction(url, userId, body, confirmation, successMessage) {
    if (!window.confirm(confirmation)) return;

    setProcessing(userId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "The action could not be completed.");

      setMessage(successMessage);
      await loadTeam();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setProcessing("");
    }
  }

  function revokeInvite(invite) {
    const userId = invite.user_id || invite.id;

    if (!userId) {
      setError("This invitation does not have a valid user ID.");
      return;
    }

    handleAction(
      "/api/admin/revoke-invite",
      userId,
      { user_id: userId },
      `Are you sure you want to revoke the invitation for ${invite.email}?`,
      "Invitation revoked successfully."
    );
  }

  function toggleAdmin(admin) {
    const nextActive = !admin.active;

    handleAction(
      "/api/admin/set-admin-active",
      admin.user_id,
      { user_id: admin.user_id, active: nextActive },
      nextActive
        ? `Are you sure you want to reactivate ${admin.email}?`
        : `Are you sure you want to deactivate ${admin.email}?`,
      nextActive ? "Administrator reactivated successfully." : "Administrator deactivated successfully."
    );
  }

  const buttonStyle = {
    padding: "9px 15px",
    borderRadius: "8px",
    border: "1px solid",
    fontWeight: 600,
    cursor: "pointer",
    background: "transparent"
  };

  if (loading) return <p>Loading admin team...</p>;

  return (
    <section style={{ width: "100%", maxWidth: "850px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2>Team Management</h2>
          <p style={{ color: "#68736f" }}>Manage administrators and pending invitations.</p>
        </div>
        <button onClick={loadTeam} style={{ ...buttonStyle, borderColor: "#b9c9c2", color: "#285548" }}>
          Refresh
        </button>
      </div>

      {error && <p role="alert" style={{ background: "#fff0ed", color: "#a83224", padding: "12px", borderRadius: "8px" }}>{error}</p>}
      {message && <p role="status" style={{ background: "#e8f5e9", color: "#256b38", padding: "12px", borderRadius: "8px" }}>{message}</p>}

      <div style={{ marginTop: "28px" }}>
        <h3>Pending Invitations ({team.invites.length})</h3>

        {team.invites.length === 0 ? (
          <p style={{ color: "#68736f" }}>No pending invitations.</p>
        ) : team.invites.map((invite) => {
          const userId = invite.user_id || invite.id;

          return (
            <div key={userId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap", padding: "16px", marginBottom: "12px", border: "1px solid #d8dfda", borderRadius: "12px", background: "#fff" }}>
              <div>
                <strong>{invite.email}</strong>
                <p style={{ margin: "5px 0 0", color: "#9a7425", fontSize: "13px" }}>Pending invitation</p>
              </div>
              <button
                disabled={!userId || processing === userId}
                onClick={() => revokeInvite(invite)}
                style={{ ...buttonStyle, color: "#b83232", borderColor: "#dba4a4", opacity: processing === userId ? 0.5 : 1 }}
              >
                {processing === userId ? "Processing..." : "Revoke Invitation"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "35px" }}>
        <h3>Administrators ({team.admins.length})</h3>

        {team.admins.length === 0 ? (
          <p style={{ color: "#68736f" }}>No administrators found.</p>
        ) : team.admins.map((admin) => (
          <div key={admin.user_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap", padding: "16px", marginBottom: "12px", border: "1px solid #d8dfda", borderRadius: "12px", background: "#fff" }}>
            <div>
              <strong>{admin.email || admin.user_id}</strong>
              <p style={{ margin: "5px 0 0", color: admin.active ? "#287b48" : "#a83232", fontSize: "13px" }}>
                {admin.active ? "Active administrator" : "Inactive administrator"}
              </p>
            </div>
            <button
              disabled={processing === admin.user_id || (admin.user_id === team.me && admin.active)}
              onClick={() => toggleAdmin(admin)}
              style={{ ...buttonStyle, color: admin.active ? "#b83232" : "#287b48", borderColor: admin.active ? "#dba4a4" : "#9bc8a5", opacity: processing === admin.user_id || (admin.user_id === team.me && admin.active) ? 0.5 : 1 }}
            >
              {processing === admin.user_id ? "Processing..." : admin.active ? "Deactivate" : "Reactivate"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
