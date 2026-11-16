# Admin access runbook

Admins sign in with their own email and password through Supabase Auth. Nobody can sign up by themselves: people are invited. Every admin page and API route checks, on **every request**, that the session is valid **and** that `admins.active = true`. Deactivating an admin blocks their very next request, even from an open session.

Each Supabase project (dev, test, production) is separate and needs its own setup below.

## 1. One-time setup per Supabase project

1. **Table.** In the SQL editor run `database/admins.sql` (RLS on, no policy, no public access).
2. **Sign-ups off.** Authentication > Sign In / Providers > turn **off** "Allow new users to sign up".
3. **Password length.** Authentication > Sign In / Providers > Email > minimum password length **12**.
4. **Site URL.** Authentication > URL Configuration > Site URL = this project's app URL (production URL for production, the client test URL for the test project, `http://localhost:3000` for dev).
5. **Redirect URLs.** Add `http://localhost:3000/**`, the staging/test URL `/**`, and the production URL `/**`.
6. **Custom SMTP.** Authentication > SMTP Settings. Supabase's built-in sender is heavily rate-limited and only delivers to team addresses, so real invitations need your own SMTP provider.
7. **Invite template.** Authentication > Email Templates > "Invite user": paste `docs/invite-email-template.html`.
8. **Environment variables** (Vercel and `.env.local`, see `app/.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Use the values of the matching project.

## 2. First admin (break-glass)

Run from the `app` folder with `.env.local` pointing at the right project. Use **single quotes** in PowerShell so `$` is not expanded:

```powershell
node scripts/add-admin.js add you@example.com 'a-long-password-12-plus'
```

This sets the password from your shell, so use it only for the first admin or an emergency. Then log in at `/admin/login`.

## 3. Inviting more admins

Normal way: `node scripts/add-admin.js invite someone@example.com` (or `POST /api/admin/invite` with `{ "email": "..." }` while logged in as an admin).

What happens:

1. Supabase emails the invite. The server marks the user as an admin invite (`app_metadata.admin_invite`), which the invitee cannot change.
2. The link opens `/admin/accept-invite`. The person clicks **Accept invitation**; only then is the one-time token used.
3. On `/admin/set-password` they choose a password (12 to 72 characters). The `admins` row is created and the invite flag is cleared.

An invitation can never re-activate a deactivated admin: if an `admins` row already exists (active or not), set-password refuses.

## 4. Deactivate or re-activate

```powershell
node scripts/add-admin.js deactivate someone@example.com
node scripts/add-admin.js activate someone@example.com
```

Takes effect on their next request.

## 5. Login, logout, rate limiting

- Logging out ends that session at Supabase (server-side) and clears the cookies. Other devices stay signed in until they log out.
- Cookies are httpOnly, sameSite=lax, and secure in production.
- Failed logins are limited to 5 per email and IP per 15 minutes. This counter is in memory, so on Vercel it is per server instance. For stronger protection use a shared store (for example Upstash Redis). Supabase Auth also applies its own limits.
- A signed-in user who is not an active admin receives no cookie.

## 6. Hidden shortcut

Tapping the logo on the landing page 5 times within 3 seconds opens `/admin/login`. It is only a shortcut; the login is the real protection.

## 7. Troubleshooting

| Symptom | Check |
| --- | --- |
| Invite email never arrives | Custom SMTP configured? Address allowed by your SMTP provider? |
| "invitation link is invalid or has expired" | Link already used, expired, or the person was already onboarded. Deactivated or removed? Re-invite requires deleting the old auth user first. |
| Invite link opens the wrong site | Site URL of that Supabase project (step 4). |
| Logged in but bounced to the login page | No active row in `admins` for that user. Run `add-admin.js activate`. |
| Missing Supabase environment variables | `.env.local` / Vercel variables for that project. |

## 8. Audit trail

`requireAdmin(req, res)` returns `{ id, email, role }` for the active admin. When the audit trail (FIX-15.3) lands, admin routes should use `const admin = await requireAdmin(req, res)` and record `admin.id`.
