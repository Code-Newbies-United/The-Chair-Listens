// Destination: lib/requireAdminSSR.js
import { verifyAdminSession } from "@/lib/adminsession";

// Use in any admin page like:
//   export const getServerSideProps = requireAdminSSR();
export function requireAdminSSR() {
    return async function getServerSideProps(context) {
        if (!verifyAdminSession(context.req)) {
            return {
                redirect: {
                    destination: "/admin/login",
                    permanent: false,
                },
            };
        }

        return { props: {} };
    };
}