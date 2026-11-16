import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminAuthShell from "@/components/AdminAuthShell";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.success, message: data.message };
}

export default function AdminTeam() {
  const [team, setTeam] = useState({ me: null, admins: [], invites: [] });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not load the team.");
      setTeam(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function run(key, action, successMessage) {
    setBusy(key);
    setError("");
    setMessage("");
    try {
      const result = await action();
      if (result.ok) {
        setMessage(successMessage);
        await load();
        return true;
      }
      setError(result.message || "Something went wrong. Try again.");
      return false;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      return false;
    } finally {
      setBusy("");
    }
  }

  function handleInvite() {
    const address = email.trim();
    if (!address) return;
    run("invite", () => postJson("/api/admin/invite", { email: address }), `Invitation sent to ${address}.`).then(
      (ok) => {
        if (ok) setEmail("");
      }
    );
  }

  function handleRevoke(invite) {
    if (!window.confirm(`Revoke the invitation for ${invite.email}? Their link will stop working.`)) return;
    run(invite.id, () => postJson("/api/admin/revoke-invite", { user_id: invite.id }), `Invitation for ${invite.email} revoked.`);
  }

  function handleActive(person, active) {
    const verb = active ? "Re-activate" : "Deactivate";
    if (!window.confirm(`${verb} ${person.email}?`)) return;
    run(
      person.user_id,
      () => postJson("/api/admin/set-admin-active", { user_id: person.user_id, active }),
      `${person.email} ${active ? "re-activated" : "deactivated"}.`
    );
  }

  return (
    <AdminAuthShell eyebrow="Team" title="Admin team" script="Who has access.">
      <div className="aas-form">
        <label className="aas-label" htmlFor="team-email">
          Invite by email
        </label>
        <input
          id="team-email"
          type="email"
          className="aas-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && handleInvite()}
          placeholder="name@example.com"
          autoComplete="off"
        />
        <button type="button" className="aas-button" onClick={handleInvite} disabled={!!busy || !email.trim()}>
          {busy === "invite" ? "Sending..." : "Send invitation"}
        </button>

        {message && (
          <p className="aas-help" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="aas-error" role="alert">
            {error}
          </p>
        )}

        <span className="aas-label team-heading">Pending invitations</span>
        {loading ? (
          <p className="aas-help">Loading...</p>
        ) : team.invites.length === 0 ? (
          <p className="aas-help">No pending invitations.</p>
        ) : (
          <ul className="team-list">
            {team.invites.map((invite) => (
              <li key={invite.id} className="team-row">
                <span className="team-email">{invite.email}</span>
                <button
                  type="button"
                  className="team-action"
                  onClick={() => handleRevoke(invite)}
                  disabled={!!busy}
                >
                  {busy === invite.id ? "..." : "Revoke"}
                </button>
              </li>
            ))}
          </ul>
        )}

        <span className="aas-label team-heading">Admins</span>
        {loading ? (
          <p className="aas-help">Loading...</p>
        ) : team.admins.length === 0 ? (
          <p className="aas-help">No admins yet.</p>
        ) : (
          <ul className="team-list">
            {team.admins.map((person) => {
              const isMe = person.user_id === team.me;
              return (
                <li key={person.user_id} className="team-row">
                  <span className="team-email">
                    {person.email}
                    <span className={person.active ? "team-badge" : "team-badge team-badge-off"}>
                      {isMe ? "You" : person.active ? "Active" : "Inactive"}
                    </span>
                  </span>
                  {!isMe && (
                    <button
                      type="button"
                      className="team-action"
                      onClick={() => handleActive(person, !person.active)}
                      disabled={!!busy}
                    >
                      {busy === person.user_id ? "..." : person.active ? "Deactivate" : "Re-activate"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <Link href="/admin/dashboard" className="aas-help">
          Back to dashboard
        </Link>
      </div>

      <style jsx>{`
        .team-heading {
          margin-top: 8px;
        }
        .team-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.07);
        }
        .team-email {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          font-size: 13px;
          overflow-wrap: anywhere;
        }
        .team-badge {
          width: fit-content;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(141, 207, 148, 0.25);
          color: var(--mint);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .team-badge-off {
          background: rgba(255, 176, 163, 0.2);
          color: #ffb0a3;
        }
        .team-action {
          flex-shrink: 0;
          min-height: 36px;
          padding: 8px 14px;
          border: 1px solid rgba(212, 233, 237, 0.35);
          border-radius: 100px;
          background: transparent;
          color: var(--white);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .team-action:hover:not(:disabled) {
          border-color: var(--mint);
          color: var(--mint-bright);
        }
        .team-action:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </AdminAuthShell>
  );
}