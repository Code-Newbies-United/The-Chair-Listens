import { requireAdmin } from "@/lib/requireAdmin";

// Same name and usage as before: export const getServerSideProps = requireAdminSSR();
export function requireAdminSSR() {
  return async ({ req, res }) => {
    const admin = await requireAdmin(req, res);
    if (!admin) {
      return { redirect: { destination: "/admin/login", permanent: false } };
    }
    return { props: { admin } };
  };
}