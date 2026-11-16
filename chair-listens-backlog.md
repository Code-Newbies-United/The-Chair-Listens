# The Chair Listens: Issue Backlog

Priorities: **P0** = blocks launch / security, **P1** = fix before live activation, **P2** = soon after, **P3** = housekeeping.
Suggested labels are in brackets. Each ticket can be pasted straight into GitHub Issues.

---

# PART 1: FIXES

## FIX-01 · P0 · Rotate leaked secrets and purge `env.local`
**Labels:** `security` `blocker`

**Problem:** `env.local` is in the project archive and contains live credentials: Supabase service-role key, Groq API key, admin password, session secret, Upstash token and a Vercel OIDC token. The root `.gitignore` only ignores `.env.local`, so `env.local` (no leading dot) would be committed.

**Tasks**
- Rotate every credential listed above and set the new values in Vercel env settings only.
- Delete `env.local` from the repo and from git history if it was ever committed (`git filter-repo` or BFG).
- Change `.gitignore` to ignore `.env*` (except `.env.example`) at root and in `app/`.
- Add `.env.example` with variable names and no values.
- Add a secret-scanning step (GitHub secret scanning or gitleaks) to CI.

**Acceptance criteria**
- Old keys no longer work. `git log -p` shows no secrets. `.env.example` lists all required variables.

---

## FIX-02 · P0 · Repair the four API routes that don't compile or run
**Labels:** `bug` `blocker` `api`

**Problem:**
- `api/groq.js` and `api/admin-login.js` each declare two `export default` handlers, which is a build error.
- `api/admin-login.js`, `api/transcribe.js` and `api/session-reflection.js` run rate-limit code at module top level, referencing `req`/`res` that don't exist there, so the module throws on load.
- `@upstash/redis` is imported in `lib/rateLimit.js` but is missing from `package.json`.
- `groq.js` uses limiter key `"grog"`, but its test expects `"groq"`.

**Tasks**
- Keep one handler per file; move `getClientIp` and `rateLimit` calls inside it, after the method check.
- Add `@upstash/redis` to dependencies.
- Fix the key typo.
- Make the `rateLimit` helper fail open (log and allow) if Redis is unreachable, so an Upstash outage doesn't take down the chair at a live event.

**Acceptance criteria**
- `next build` passes. Each route returns 429 after exceeding its limit and works normally under it. Existing `groq.test.js` and `rateLimit.test.js` pass.

---

## FIX-03 · P0 · Align `schema.sql` with what the code actually uses
**Labels:** `bug` `database` `blocker`

**Problem:**
- `questions` lacks `script_key`, `title`, `placeholder` and `sort_order`, which the API reads and writes.
- `quiz_questions` has a `question` column but the API uses `question_text`, `options` (JSONB), `explanation` and `sort_order`.
- `consent` has `location`, but `/api/consent` inserts `location_id`, so every consent insert fails. `index.jsx` swallows the error.
- No RLS policies are defined anywhere, although the code depends on them (see FIX-05).

**Tasks**
- Rewrite `schema.sql` as ordered migrations (Supabase CLI) that match the live code.
- Add `created_at` to `consent` and `quiz_questions`.
- Add `database/seed-data/` with starter questions for all three pathways and sample quiz questions.
- Verify the migration against a fresh Supabase project.

**Acceptance criteria**
- A fresh database built only from migrations and seed data lets the full app flow work end to end.

---

## FIX-04 · P0 · Enforce consent on the server (sessions model)
**Labels:** `bug` `privacy` `popia` `blocker`

**Problem:** Consent is only a disabled button on the client. `/questions` can be opened directly and `/api/responses` accepts anything. Consent rows have no timestamp, no version of the terms and no link to a response, so you can't prove what any participant agreed to. The consent insert currently fails silently (FIX-03).

**Tasks**
- Add a `sessions` table: `id`, `location_id`, `consent_version`, `consented_at`, `created_at`.
- `/api/consent` creates a session and returns an opaque session ID. Store it in `sessionStorage`.
- `/api/responses` requires a valid session ID, rejects sessions without consent, and writes `session_id` on the response.
- `/questions`, `/select-script` and `/check-in` redirect to `/` if no session exists.
- Version the consent terms (`consent_version`) so changes are traceable.
- Surface consent failures to the user instead of swallowing them.

**Acceptance criteria**
- Posting a response without a session returns 403. Every stored response has a session with a consent timestamp and version. Covers README scenario "User cannot submit a response without first giving consent".

---

## FIX-05 · P0 · Lock down Row Level Security and stop leaking reads via the anon key
**Labels:** `security` `database` `blocker`

**Problem:** `stats.js` counts rows from `responses` using the anon client. That only works if the anon key (which is public in every browser) has `SELECT` on `responses`, which would let anyone read the archive of personal stories. `responses`, `consent` and `locations` writes also rely on anon-key inserts with no documented policies.

**Tasks**
- Enable RLS on every table.
- Anon role: no direct access to `responses`, `consent`, `sessions`, `questions` or `quiz_questions`. Allow `SELECT` on `locations` only (non-sensitive).
- Route all writes and reads through server API routes using `supabaseAdmin`. Switch `consent.js`, `responses.js`, `locations.js` and `stats.js` to the server client where appropriate.
- Add a test that attempts anon-key reads and inserts directly against Supabase and expects denial.

**Acceptance criteria**
- Calling Supabase REST with the public anon key cannot read `responses`. All app features still work.

---

## FIX-06 · P1 · Fix project config, test runner and CI
**Labels:** `bug` `devops` `testing`

**Problem:**
- `app/package.json` has `"type": "module"` but `next.config.js` and `jest.config.js` use `module.exports`, which fails under ESM.
- `jest.config.js` sits at the repo root with no `package.json` there; `app/jest.config.js` is empty.
- No `test` script or jest/testing-library dependencies.
- Both GitHub workflow files are empty (`on: jobs:`), so there is no CI.
- Jest path mappers point at `app/components` etc. and don't match the real layout.

**Tasks**
- Convert configs to ESM or rename to `.cjs`.
- Keep one jest config in `app/` with correct path mappers.
- Add `jest`, `jest-environment-jsdom`, `@testing-library/react` and `@testing-library/jest-dom`, plus `test`, `lint` and `build` scripts.
- Write `ci-unit.yml` (lint, test, build on PR) and `ci-acceptance.yml` (Playwright on merge to `main`), as described in the README.
- Add ESLint and Prettier.

**Acceptance criteria**
- A PR triggers CI that builds, lints and runs unit tests. A failing test blocks merge.

---

## FIX-07 · P1 · Tag responses to the chair's real location, not the visitor's GPS guess
**Labels:** `bug` `data-quality` `map`

**Problem:** The README says the QR code encodes a location ID. The code ignores that. `index.jsx` uses browser geolocation plus Nominatim and falls back to a hardcoded "Pretoria". Responses store a free-text city name that rarely matches `locations.name`, so per-stop analytics are unreliable and `locations.response_count` is never updated. Visitor coordinates are also sent to OpenStreetMap, which the consent terms don't disclose.

**Tasks**
- Resolve the stop on the server from the QR parameter (`?stop=<id>`) or the single `locations.active = true` row.
- Store `location_id` (UUID foreign key) on `sessions` and `responses`. Drop the free-text `location`.
- Remove browser geolocation and the Nominatim call from `index.jsx`.
- Update `response_count` (or compute it by query/view) per stop.
- Remove the "Pretoria" default everywhere; show a clear error if no active stop is set.
- Generate the QR so it encodes the stop identifier; document how to regenerate it.

**Acceptance criteria**
- Every response carries a valid `location_id`. Changing the active location in admin changes where new responses are tagged. Covers "A response is correctly tagged to the active campaign location".

---

## FIX-08 · P1 · Stop passing answers through the URL
**Labels:** `privacy` `bug` `frontend`

**Problem:** `finishSession` navigates to `/responses?data=<encoded JSON of all answers>`. Mental-health disclosures end up in browser history, hosting logs and referrers, and long answers can exceed URL length limits.

**Tasks**
- Keep answers in `sessionStorage` (or fetch by response ID from a server route tied to the session).
- Remove `data` from the query string; keep only non-sensitive params if needed.
- Clear stored answers on the thank-you page.

**Acceptance criteria**
- No answer text appears in any URL. Reflection page still renders after submission, including with very long answers.

---

## FIX-7.1 Asking the user for a permision to use their location
**It was part of the flow on fix 7

## FIX-09 · P1 · Rebuild crisis/safety detection
**Labels:** `safety` `bug` `high-impact`

**Problem:** `utils/safety.js` uses plain substring matching. "begun", "Gunther" and "the gun show" trigger on `gun`. It misses many phrasings ("suicidal", "end it all", "don't want to be here anymore", "no point going on") and any non-English text. It fires on every keystroke with a blocking `alert()` and yanks the user off the page. The check runs only on typing and speech, and the AI reflection routes (`/api/groq`, `/api/session-reflection`) have no check. Crisis text is still saved with no flag.

**Tasks**
- Word-boundary regex matching, with a reviewed phrase list (reviewed by a mental-health professional) including SA English variants. Remove bare `gun`.
- Run the check once on submit of each answer rather than on each keystroke, and also server-side in `/api/responses`, `/api/groq` and `/api/session-reflection`.
- Replace `alert()` + hard redirect with an in-page supportive interstitial that shows helplines but lets the person choose to continue or exit; don't discard their progress.
- Do not send flagged text to the AI reflection routes; return a fixed supportive message instead.
- Add `safety_flagged` boolean to `responses` (see FEAT-02).
- Re-verify every helpline number and hours in `emergency.jsx` against current official listings before launch, and add an emergency-services number (112 / 10111).

**Acceptance criteria**
- Unit tests covering false positives (begun, Gunther) and true positives. Flagged sessions are stored with the flag. No flagged text reaches Groq.

---

## FIX-10 · P1 · Don't lose answers on network failure
**Labels:** `bug` `reliability`

**Problem:** `finishSession` logs a failed `/api/responses` call and carries on, telling the person thank you even though nothing was saved. Nothing is persisted until the final question, so a dropped connection or closed tab at an event loses the whole session.

**Tasks**
- Check `res.ok`; show a retry option on failure and don't proceed to the thank-you flow until saved (or the person explicitly skips).
- Save per question (or keep a local retry queue in `sessionStorage`), with an idempotency key to prevent duplicates.
- Disable the submit button while saving to prevent double submits.

**Acceptance criteria**
- Simulated offline submission shows an error and succeeds on retry without duplicates. Closing the tab mid-session keeps already-submitted answers.

---

## FIX-11 · P1 · Validate input and protect the public endpoints
**Labels:** `security` `api`

**Problem:** `/api/responses` and `/api/consent` accept unlimited, unvalidated payloads and have no rate limits. `validators.js` is an empty file. The archive can be spammed or poisoned, and the DB can be filled with junk.

**Tasks**
- Implement `lib/validators.js` (e.g. with zod): `script` must be one of the known keys, `answers` length and per-answer character limits, `location_id`/`session_id` must be valid UUIDs, and request body size limits.
- Add rate limits to `/api/consent`, `/api/responses`, `/api/quiz-questions` and `/api/questions`.
- Tune limits for shared IPs (venue wifi, mobile carrier NAT). 5 requests/min per IP on `transcribe` and `session-reflection` can block legitimate users at an activation; key on session ID in addition to IP.
- Return consistent JSON error shapes.

**Acceptance criteria**
- Oversized or malformed payloads return 400 with no DB write. Rate-limit behaviour is covered by unit tests.

---

## FIX-12 · P1 · Update the consent terms and implement (or clearly disclaim) withdrawal
**Labels:** `privacy` `popia` `content`

**Problem:** `consent-terms.jsx` mentions Groq and retention, which is good, but it also says participants can withdraw. Responses are anonymous, so there is no way to find and delete one person's response. The terms also don't cover browser speech recognition (audio goes to Google/Apple) or any location lookups.

**Tasks**
- Decide: (a) give each participant a short withdrawal code at the end of the session that lets them request deletion, or (b) state plainly that withdrawal isn't possible after submission because data is anonymous.
- If (a), add a `/api/withdraw` flow and an admin deletion tool.
- List every third party that receives data (Groq, Supabase, Vercel, Upstash, and any speech provider) with purpose and region.
- Add a minimum-age statement.
- Campaign owner / legal gives written sign-off on the final wording and the `consent_version` (as the README requires).

**Acceptance criteria**
- Terms accurately reflect actual data flows. Legal sign-off recorded in `docs/data-privacy.md`.

---

## FIX-13 · P2 · Reduce personal information sent to Groq
**Labels:** `privacy` `ai`

**Problem:** Free-text answers are sent to Groq as typed. In small communities, a name, workplace or place plus a timestamp can re-identify someone.

**Tasks**
- Add a light PII-scrubbing step (phone numbers, email addresses, ID numbers, obvious names) before sending text to Groq, and ideally before storing.
- Confirm Groq's data-retention and training settings for the account; document them.
- Add a notice near the text box: "Please avoid names or contact details."

**Acceptance criteria**
- Unit tests show phone/email/ID patterns are removed. The notice is visible on question screens.

---

## FIX-14 · P2 · Consolidate the voice-input path and harden transcription
**Labels:** `tech-debt` `frontend` `api`

**Problem:** `questions.jsx` uses the browser Web Speech API (inconsistent support, audio goes to Google/Apple, hardcoded `en-ZA`). `VoiceRecorder.jsx` and `/api/transcribe` (Groq Whisper) exist but are never used. The README describes MediaRecorder plus Cloudinary storage, which doesn't exist. `transcribe.js` has no file size/type limit and doesn't delete the temp upload.

**Tasks**
- Choose one path. Recommended: MediaRecorder → `/api/transcribe` (Whisper, auto language detect), with graceful fallback to typing.
- Wire `VoiceRecorder` into the question screen; remove the Web Speech code.
- Limit upload size and MIME type; delete the formidable temp file in a `finally`; set a max recording length.
- Decide whether raw audio is stored. If not, document "audio is transcribed and discarded" in the terms and README.

**Acceptance criteria**
- Voice works on iOS Safari and Android Chrome. Oversized or non-audio uploads are rejected. No temp files remain.

---

## FIX-15 · P2 · Replace the shared admin password
**Labels:** `security` `admin`

**Problem:** One shared password in an env var, compared with `!==` (not constant-time). No per-person identity, no revocation, no audit trail. The README already names Supabase auth for this.

**Tasks**
- Use Supabase Auth (email magic link or password) for admins, with an allowlist/role table.
- Keep or replace the signed-cookie session accordingly; compare any remaining secrets with `crypto.timingSafeEqual`.
- Apply the login rate limit only to failed attempts.
- Log admin actions (question changes, location changes, deletions) with who and when.
- Tighten the cookie regex in `verifyAdminSession` so it can't match a cookie named `xadmin_session`.

**Acceptance criteria**
- Each admin has their own login. Removing a user immediately blocks access. Audit log entries are written.

---

## FIX-16 · P2 · Centralise pathway/script configuration
**Labels:** `tech-debt` `cms`

**Problem:** The script keys and labels (`men_mental_health`, `ally_support`, `fast_track_activations`) are hardcoded in `questions.jsx`, `responses.jsx`, `groq.js` and `stats.js`. `data/pathways.js` and `data/prompts.js` exist but are empty. Adding a pathway needs a code change, which conflicts with the "no redevelopment cycle" goal.

**Tasks**
- Create a `pathways` table (key, label, description, AI system prompt, active, sort order) and a single server helper to read it.
- Replace all hardcoded maps with that source; make `stats.js` breakdown dynamic.
- Keep `data/pathways.js` as seed data only.

**Acceptance criteria**
- Adding a row in `pathways` makes it appear in selection, questions, AI reflections and dashboard stats without a deploy.

---

## FIX-17 · P2 · Review and source all health content
**Labels:** `content` `health`

**Problem:** "Did You Know" facts (e.g. claims about listening and neural pathways) and quiz content are unsourced. This is a health campaign dealing with prostate cancer and mental health, so wrong or overstated claims are a credibility and safety risk. Also check the AI system prompts so they never imply diagnosis or advice.

**Tasks**
- List every fact and quiz item; add a source for each (e.g. CANSA, SADAG, peer-reviewed guidance).
- Clinical or campaign-partner review and sign-off.
- Store sources in the quiz table and show them in the UI.

**Acceptance criteria**
- Every claim has a cited source and a recorded reviewer.

---

## FIX-18 · P2 · Bring README and `docs/` in line with reality
**Labels:** `docs`

**Problem:** README describes the Next.js App Router layout, Cloudinary storage, a PUT-based question CMS and an `app/api/` directory. The code uses the Pages Router, no Cloudinary, add/delete only, and inline styles rather than Tailwind. All five files in `docs/` are empty.

**Tasks**
- Update the architecture diagram and repo structure.
- Fill in `architecture.md`, `api-reference.md` (all routes, auth, payloads), `testing.md`, `data-privacy.md` and `campaign-locations.md`.
- Add a "run locally" and "deploy" section.

**Acceptance criteria**
- A new developer can run the project locally from the README alone.

---

## FIX-19 · P3 · Remove dead code and stray files
**Labels:** `cleanup`

- Delete the ~130-line commented-out duplicate of the page at the bottom of `index.jsx`.
- Remove unused `components/Activitymap.jsx` (or wire it in), `public/index.html`, the nested `app/the-chair-listens/` folder and `pages/api/Untitled-1.md`.
- Delete or implement the empty files (`lib/responses.js`, `data/prompts.js`, empty tests).
- Rename the misleading comment in `api/set-location.js` ("Destination: pages/api/admin/…").

---

## FIX-20 · P3 · Clean up campaign links
**Labels:** `content` `cleanup`

- `lib/campaignLinks.js` still has `learnMore: "#"`.
- The Change.org petition URL includes personal tracking parameters (`recruited_by_id`, `fbclid`, `share_id`). Replace it with the clean canonical URL.
- Move links to env vars or the CMS so they can change without a deploy.

---

## FIX-21 · P3 · Styling and performance
**Labels:** `frontend` `performance`

- Tailwind is installed but nearly all styling is inline. Pick one approach and use shared components (buttons, cards, page shell) to remove the duplicated style blocks.
- Self-host IBM Plex fonts via `next/font` instead of `@import`ing Google Fonts on every page (privacy and slow-network gains).
- Lazy-load Leaflet and the logos. Compress `partner-3.png` (about 1.4 MB).

---
## FIX-22 Step 2: Check two potential issues IN session-reflection.js

Input validation: The handler currently passes script and answers into the AI prompt without validating their types or size. You can add validation to reduce malformed or excessively large requests.

API key configuration: GROQ_API_KEY must be configured in your environment. If it is missing, the Groq client may fail when the API is used. Your catch block already returns a fallback reflection.

These are separate from the main location fix, so you can leave them for now.
---
## FIX-23 Row Level Security for all the tables and the POLICIES

Enable rls and draw up policies

# PART 2: NEW FEATURES

## FEAT-01 · P1 · Admin responses browser and export
**Labels:** `feature` `admin`

**Why:** The "Chair Collects / Connects" stages have no admin view. Right now the team can see counts but can't read, filter or export the stories.

**Scope**
- Paginated list of responses with filters: pathway, stop, date range, safety flag.
- Detail view showing each answer per question.
- Full-text search.
- CSV/JSON export (anonymised, includes `consent_version`).
- Admin-only; every export logged in the audit log.

**Acceptance criteria**
- Admin can find and export all responses for one stop and pathway.

---

## FEAT-02 · P1 · Safety-flag review queue
**Labels:** `feature` `safety` `admin`

**Why:** Responses containing crisis language need human attention and must never appear in anything public.

**Scope**
- Flagged responses surface in a dedicated admin queue with status (new / reviewed / actioned).
- Notification (email or Slack) to a nominated contact when a flag occurs.
- Documented escalation procedure for the campaign team, including what can and cannot be done with an anonymous response.
- Flagged items automatically excluded from exports and public views unless explicitly cleared.

---

## FEAT-03 · P1 · Per-stop analytics and live participation map
**Labels:** `feature` `analytics` `map`

**Scope**
- Responses per stop, per pathway and per day; completion rate.
- Admin map shows each stop with response counts and a "performance" indicator (as the README promises).
- Optional public version of the map with aggregate counts only.

**Depends on:** FIX-07.

---

## FEAT-04 · P2 · Funnel and drop-off analytics
**Labels:** `feature` `analytics`

**Scope**
- Track sessions started, consented, pathway selected, each question reached, completed and reflection viewed (counts only, no identifiers).
- Dashboard funnel chart and per-question drop-off.
- Use it to refine question wording.

---

## FEAT-05 · P2 · Full question and pathway CMS
**Labels:** `feature` `cms`

**Scope**
- Edit existing questions (the API lacks PUT/PATCH), reorder by drag and drop, activate/deactivate instead of deleting.
- Create and edit pathways (builds on FIX-16) and quiz questions with sources.
- Confirmation on destructive actions; preview mode to see the live flow before publishing.
- Version history so changes can be tied to the responses collected under them.

**Acceptance criteria**
- Covers README scenario "An admin can add, edit or remove a question and it reflects immediately".

---

## FEAT-06 · P2 · Multilingual support
**Labels:** `feature` `i18n` `accessibility`

**Scope**
- Language selector at the start; at minimum English, isiZulu, Afrikaans and Sesotho (confirm with the campaign team).
- Translate UI strings, questions, consent terms and emergency page; use professional translators and have consent text legally reviewed per language.
- Store the language on each response.
- Verify Whisper transcription quality per language and document limitations.

---

## FEAT-07 · P2 · Moderated public "stories" surface
**Labels:** `feature` `moderation` `public`

**Why:** "The Chair Connects" calls for stories and insights to surface through the campaign platform.

**Scope**
- Admin marks responses as "approved for publication"; only approved, unflagged, scrubbed responses are shown.
- Consent wording must explicitly cover public display (separate opt-in).
- Public page with filters by theme and stop; no timestamps precise enough to identify someone.
- Optional curated "quote cards" for social sharing.

**Depends on:** FIX-12, FEAT-01, FEAT-02.

---

## FEAT-08 · P2 · Theme and sentiment insights
**Labels:** `feature` `ai` `analytics`

**Scope**
- Batch job that tags responses with themes (stigma, work stress, relationships, prostate screening, etc.) using the LLM, run on scrubbed text.
- Dashboard of top themes by stop and pathway over time.
- Human-reviewable tags; clear labelling that this is automated.

---

## FEAT-09 · P2 · Monitoring and alerting
**Labels:** `feature` `devops`

**Scope**
- Sentry for frontend and API errors (with PII scrubbing so response text is never sent).
- UptimeRobot (or similar) checks on `/`, `/api/questions` and `/api/locations` with SMS/email alerts during activations.
- Upstash and Groq quota alerts.

---

## FEAT-10 · P2 · Automated test suite matching the README scenarios
**Labels:** `testing`

**Scope**
- Fill the empty unit tests: consent, responses, questions, locations, ConsentForm, QuestionCard, TextResponse, VoiceRecorder, LocationMap. Target 80%+ on consent, response submission and question CRUD.
- Playwright journeys: scan link → consent → pathway → text and voice answer → confirmation; admin question edits persist; dashboard totals equal stored responses.
- Supertest/contract tests for every API route, including 401/403/429 cases.
- RLS tests (see FIX-05).
- Wire into CI; failing acceptance tests block deploy.

---

## FEAT-11 · P2 · Data retention, deletion and privacy tooling
**Labels:** `feature` `privacy` `popia`

**Scope**
- Define and document a retention period; scheduled job deletes or archives older raw responses.
- Admin tool to delete a response (e.g. on a withdrawal request) with an audit entry.
- Fill `docs/data-privacy.md`: data inventory, purposes, processors, retention, breach procedure and the Information Officer contact.

---

## FEAT-12 · P3 · Low-bandwidth and offline resilience
**Labels:** `feature` `frontend`

**Scope**
- Test on throttled 3G and low-end Android.
- Cache the question set and app shell with a service worker, so the flow keeps working through brief signal drops; queue submissions and sync when back online (builds on FIX-10).
- Lighter bundles and no render-blocking external fonts.

---

## FEAT-13 · P3 · Accessibility audit
**Labels:** `accessibility`

**Scope**
- WCAG 2.2 AA review: colour contrast on navy/gold palette, focus order, labels, screen-reader support for the voice recorder and map, large tap targets, reduced-motion support for animations.
- Replace blocking `alert()` calls everywhere.
- Fix issues found and add automated axe checks to the Playwright suite.

---

## FEAT-14 · P3 · Activation runbook and pre-launch checklist
**Labels:** `docs` `ops`

**Scope**
- Staging environment with its own Supabase project.
- Per-stop checklist: set active location, print/verify QR, test scan on iOS and Android, run a test submission, confirm monitoring is green, confirm the safety notification contact is on duty.
- Rollback plan and incident contacts.
- Seed script that can reset the staging database.
