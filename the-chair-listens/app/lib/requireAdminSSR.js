import { requireAdmin } from "@/lib/requireAdmin";

export function requireAdminSSR() {
  return async ({ req, res }) => {
    const admin = await requireAdmin(req, res);
    if (!admin) {
      return { redirect: { destination: "/admin/login", permanent: false } };
    }
    return { props: { admin } };
  };
}