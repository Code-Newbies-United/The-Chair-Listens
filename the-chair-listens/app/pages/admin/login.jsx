import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


 async function handleLogin() {
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("isAdmin", "true");
        router.push("/admin/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "320px", width: "100%", textAlign: "center" }}>
        <h1>Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
          Log In
        </button>
      </div>
    </main>
  );

}