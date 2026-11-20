# Admin access runbook

Admins sign in with their own email and password through Supabase Auth. Nobody can sign up by themselves. An admin adds a person's email and sends them a one-time code, and the person creates their own login with it. No emails are sent. Every admin page and API route checks, on **every request**, that the session is valid **and** that `admins.active = true`. Deactivating an admin blocks their very next request.

Each Supabase project (dev, test, production) is separate and needs its own setup.

## 1. One-time setup per Supabase project

1. In the SQL editor run `database/admins.sql`, then `database/admin-invites.sql`.
2. Authentication > Sign In / Providers: turn **off** "Allow new users to sign up".
3. Authentication > Sign In / Providers > Email: set the minimum password length to **12**.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` (Vercel and `.env.local`, see `app/.env.example`) to the values of the matching project.

No email provider is needed.

## 2. First admin

From the `app` folder (single quotes in PowerShell):

    node scripts/add-admin.js add you@example.com 'a-long-password-12-plus'

Then log in at `/admin/login`.

## 3. Adding more admins

1. Log in, open the dashboard, tap **Manage Admins**.
2. Enter the person's email and tap **Add admin**.
3. A one-time code appears once. Tap **Copy message to send** and send it to them privately (for example WhatsApp).
4. The person opens `/admin/register`, enters their email and the code, and chooses their own password (12 to 72 characters).
5. They log in at `/admin/login`.

The code works once, expires after 7 days, and is stored hashed. Lost the code? Add the same email again for a new one (the old one stops working). To cancel, tap **Revoke** under "Waiting to register".

## 4. Deactivate or re-activate

On **Manage Admins**, tap **Deactivate** or **Re-activate**. It takes effect on their next request. You cannot deactivate yourself or the last active admin. Or from the shell:

    node scripts/add-admin.js deactivate someone@example.com
    node scripts/add-admin.js activate someone@example.com

## 5. Login, logout, rate limiting

- Logging out ends that session at Supabase and clears the cookies.
- Cookies are httpOnly, sameSite=lax, and secure in production.
- Failed logins and failed registrations are limited to 5 per email and IP per 15 minutes. The counters are in memory, so on Vercel they apply per server instance.
- A signed-in user who is not an active admin gets no session.

## 6. Hidden shortcut

Tapping the logo on the landing page 5 times within 3 seconds opens `/admin/login`. The login is the real protection.

## 7. Troubleshooting

| Symptom | Check |
| --- | --- |
| "email and code do not match" | Wrong code, expired (7 days), already used, or revoked. Add the email again for a new code. |
| "An account with this email already exists" | An old test account. Delete it in Supabase > Authentication > Users, then register again. |
| Logged in but sent back to login | No active row in `admins` for that user. Re-activate them. |
| "Too many failed attempts" | Wait 15 minutes, or restart the server locally. |

## 8. Audit trail

`requireAdmin(req, res)` returns `{ id, email, role }`. When the audit trail (FIX-15.3) lands, use `const admin = await requireAdmin(req, res)` and record `admin.id`.