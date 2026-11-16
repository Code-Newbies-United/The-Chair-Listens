import { useState } from "react";
import { useRouter } from "next/router";
import AdminAuthShell from "@/components/AdminAuthShell";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { hasAdminInviteFlag, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/adminInvite";

export async function getServerSideProps({ req, res }) {
  try {
    const { supabase } = createSupabaseServerClient(req, res);
    const { data, error } = await supabase.auth.getUser();
    if (!error && hasAdminInviteFlag(data?.user)) {
      return { props: {} };
    }
  } catch (err) {
    console.error("set-password page error:", err);
  }
  return { redirect: { destination: "/admin/login", permanent: false } };
}

export default function SetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tooShort = password.length < MIN_PASSWORD_LENGTH;
  const mismatch = password !== confirm;
  const disabled = loading || tooShort || mismatch;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Could not set your password. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !disabled) handleSubmit();
  }

  return (
    <AdminAuthShell title="Set password" script="Almost there.">
      <div className="aas-form">
        <label className="aas-label" htmlFor="new-password">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          className="aas-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          maxLength={MAX_PASSWORD_LENGTH}
          autoFocus
        />
        <label className="aas-label" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          id="confirm-password"
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
        <button type="button" className="aas-button" onClick={handleSubmit} disabled={disabled}>
          {loading ? "Saving..." : "Set password and continue"}
        </button>
      </div>
    </AdminAuthShell>
  );
}
