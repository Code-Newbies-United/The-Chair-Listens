import { useState } from "react";
import Link from "next/link";
import AdminAuthShell from "@/components/AdminAuthShell";
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/adminInvite";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = password !== confirm;
  const disabled =
    loading || !email.trim() || !code.trim() || password.length < MIN_PASSWORD_LENGTH || mismatch;

  async function handleRegister() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setError(data.message || "Could not create your account. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !disabled) handleRegister();
  }

  if (done) {
    return (
      <AdminAuthShell title="You're in" script="Welcome to the team.">
        <div className="aas-form">
          <p className="aas-help">Your account is ready. Log in with your email and the password you just chose.</p>
          <Link href="/admin/login" className="aas-button" style={{ textAlign: "center", textDecoration: "none" }}>
            Go to login
          </Link>
        </div>
      </AdminAuthShell>
    );
  }

  return (
    <AdminAuthShell title="Join the team" script="Create your login.">
      <div className="aas-form">
        <p className="aas-help">
          Enter the email an admin added and the one-time code they sent you, then choose your own password.
        </p>
        <label className="aas-label" htmlFor="reg-email">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          className="aas-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="email"
        />
        <label className="aas-label" htmlFor="reg-code">
          Invitation code
        </label>
        <input
          id="reg-code"
          type="text"
          className="aas-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="XXXX-XXXX-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
        />
        <label className="aas-label" htmlFor="reg-password">
          Choose a password
        </label>
        <input
          id="reg-password"
          type="password"
          className="aas-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          maxLength={MAX_PASSWORD_LENGTH}
        />
        <label className="aas-label" htmlFor="reg-confirm">
          Confirm password
        </label>
        <input
          id="reg-confirm"
          type="password"
          className="aas-input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          maxLength={MAX_PASSWORD_LENGTH}
        />
        <p className="aas-help">
          {MIN_PASSWORD_LENGTH} to {MAX_PASSWORD_LENGTH} characters. A few random words works well.
        </p>
        {password && confirm && mismatch && (
          <p className="aas-error" role="alert">
            The two passwords do not match.
          </p>
        )}
        {error && (
          <p className="aas-error" role="alert">
            {error}
          </p>
        )}
        <button type="button" className="aas-button" onClick={handleRegister} disabled={disabled}>
          {loading ? "Creating..." : "Create my login"}
        </button>
      </div>
    </AdminAuthShell>
  );
}