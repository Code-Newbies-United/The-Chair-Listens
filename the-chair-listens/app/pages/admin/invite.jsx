import { useState } from "react";
import Link from "next/link";
import AdminAuthShell from "@/components/AdminAuthShell";
import { requireAdminSSR } from "@/lib/requireAdminSSR";

export const getServerSideProps = requireAdminSSR();

export default function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = loading || !email.trim();

  async function handleInvite() {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setMessage(`Invitation sent to ${email.trim()}. They will create their own password from the email.`);
        setEmail("");
      } else {
        setError(data.message || "Could not send the invitation.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAuthShell eyebrow="Team" title="Invite admin" script="Grow the team.">
      <div className="aas-form">
        <label className="aas-label" htmlFor="invite-email">
          Email address
        </label>
        <input
          id="invite-email"
          type="email"
          className="aas-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && handleInvite()}
          placeholder="name@example.com"
          autoComplete="off"
          autoFocus
        />
        <p className="aas-help">
          They receive an email, accept the invitation, then choose their own password.
        </p>
        {message && <p className="aas-help" role="status">{message}</p>}
        {error && (
          <p className="aas-error" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="aas-button" onClick={handleInvite} disabled={disabled}>
          {loading ? "Sending..." : "Send invitation"}
        </button>
        <Link href="/admin/dashboard" className="aas-help">
          Back to dashboard
        </Link>
      </div>
    </AdminAuthShell>
  );
}