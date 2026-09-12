import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [consentCount, setConsentCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      router.push("/admin/login");
      return;
    }

    async function fetchCounts() {
      const { data: consentData, error: consentError } = await supabase
        .from("consent")
        .select("*");

      const { data: responseData, error: responseError } = await supabase
        .from("responses")
        .select("*");

      if (!consentError) setConsentCount(consentData.length);
      if (!responseError) setResponseCount(responseData.length);

      setLoading(false);
    }

    fetchCounts();
  }, [router]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading dashboard...</p>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <p>Total Consents</p>
          <h2>{consentCount}</h2>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <p>Total Responses</p>
          <h2>{responseCount}</h2>
        </div>
      </div>
    </main>
  );
}