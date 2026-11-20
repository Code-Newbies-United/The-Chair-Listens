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
  return { ok: res.ok && data.success, data };
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "long" });
}

export default function AdminTeam() {
  const [team, setTeam] = useState({ me: null, admins: [], invites: [] });
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

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

  async function run(key, url, body, successMessage) {
    setBusy(key);
    setError("");
    setMessage("");
    try {
      const result = await postJson(url, body);
      if (result.ok) {
        setMessage(successMessage);
        await load();
      } else {
        setError(result.data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setBusy("");
    }
  }

  async function handleAdd() {
    const address = email.trim();
    if (!address) return;
    setBusy("add");
    setError("");
    setMessage("");
    setCreated(null);
    setCopied(false);
    try {
      const result = await postJson("/api/admin/add-admin", { email: address });
      if (result.ok) {
        setCreated({ email: result.data.email, code: result.data.code, expires_at: result.data.expires_at });
        setEmail("");
        await load();
      } else {
        setError(result.data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setBusy("");
    }
  }

  async function copyMessage() {
    const url = `${window.location.origin}/admin/register`;
    const text =
      `You have been added to The Chair Listens admin team.\n\n` +
      `1. Open ${url}\n` +
      `2. Enter your email (${created.email}) and this code: ${created.code}\n` +
      `3. Choose your own password.\n\n` +
      `The code works once and expires on ${formatDate(created.expires_at)}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError("Could not copy. Select the code and copy it by hand.");
    }
  }

  function handleRevoke(invite) {
    if (!window.confirm(`Revoke the invitation for ${invite.email}? Their code will stop working.`)) return;
    run(invite.id, "/api/admin/revoke-invite", { invite_id: invite.id }, `Invitation for ${invite.email} revoked.`);
  }

  function handleActive(person, active) {
    const verb = active ? "Re-activate" : "Deactivate";
    if (!window.confirm(`${verb} ${person.email}?`)) return;
    run(
      person.user_id,
      "/api/admin/set-admin-active",
      { user_id: person.user_id, active },
      `${person.email} ${active ? "re-activated" : "deactivated"}.`
    );
  }

  return (
    <AdminAuthShell eyebrow="Team" title="Admin team" script="Who has access.">
      <div className="aas-form">
        <label className="aas-label" htmlFor="team-email">
          Add an admin
        </label>
        <input
          id="team-email"
          type="email"
          className="aas-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !busy && handleAdd()}
          placeholder="name@example.com"
          autoComplete="off"
        />
        <button type="button" className="aas-button" onClick={handleAdd} disabled={!!busy || !email.trim()}>
          {busy === "add" ? "Adding..." : "Add admin"}
        </button>
        <p className="aas-help">
          You get a one-time code to send them. They use it on the registration page to choose their own password.
          Lost a code? Add the same email again for a new one.
        </p>

        {created && (
          <div className="team-code-box">
            <span className="aas-label">One-time code for {created.email}</span>
            <code className="team-code">{created.code}</code>
            <p className="aas-help">
              Shown only once. Send it privately. It works once and expires on {formatDate(created.expires_at)}.
            </p>
            <button type="button" className="aas-button" onClick={copyMessage}>
              {copied ? "Copied" : "Copy message to send"}
            </button>
          </div>
        )}

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

        <span className="aas-label team-heading">Waiting to register</span>
        {loading ? (
          <p className="aas-help">Loading...</p>
        ) : team.invites.length === 0 ? (
          <p className="aas-help">Nobody is waiting.</p>
        ) : (
          <ul className="team-list">
            {team.invites.map((invite) => (
              <li key={invite.id} className="team-row">
                <span className="team-email">
                  {invite.email}
                  <span className="team-badge team-badge-wait">Expires {formatDate(invite.expires_at)}</span>
                </span>
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
        .team-code-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border: 1px solid rgba(141, 207, 148, 0.45);
          border-radius: 14px;
          background: rgba(141, 207, 148, 0.1);
        }
        .team-code {
          display: block;
          padding: 12px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.25);
          color: var(--mint-bright);
          font-family: ui-monospace, Menlo, Consolas, monospace;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-align: center;
          user-select: all;
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
        .team-badge-wait {
          background: rgba(188, 149, 83, 0.25);
          color: #e5c88f;
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