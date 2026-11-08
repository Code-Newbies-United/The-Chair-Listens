import { useState } from "react";
import { useRouter } from "next/router";
import AdminAuthShell from "@/components/AdminAuthShell";

export default function AcceptInvite() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tokenHash = typeof router.query.token_hash === "string" ? router.query.token_hash : "";
  const validLink = router.isReady && tokenHash && router.query.type === "invite";

  async function handleAccept() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_hash: tokenHash }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        router.push("/admin/set-password");
      } else {
        setError(data.message || "This invitation link is invalid or has expired.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAuthShell title="Join the team" script="You're invited.">
      <div className="aas-form">
        <p className="aas-help">
          You have been invited to the admin dashboard. Click the button to accept, then choose
          your own password.
        </p>
        {router.isReady && !validLink && (
          <p className="aas-error" role="alert">
            This invitation link is incomplete. Open the link from your email again.
          </p>
        )}
        {error && (
          <p className="aas-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          className="aas-button"
          onClick={handleAccept}
          disabled={loading || !validLink}
        >
          {loading ? "Checking..." : "Accept invitation"}
        </button>
      </div>
    </AdminAuthShell>
  );
}
