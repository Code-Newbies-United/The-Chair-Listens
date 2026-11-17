/* global __ENV */
// loadtest/chair-session.k6.js
//
// Simulates people at a busy activation: each virtual user opens the site,
// consents, answers three questions, saves, and sometimes asks for an AI
// reflection. Run it against STAGING ONLY, never production.
//
// ---------------------------------------------------------------------------
// BEFORE YOU RUN IT (staging checklist)
//   1. Use a SEPARATE Supabase project and Vercel deployment for staging.
//      The test creates thousands of fake sessions and responses.
//   2. On staging only, set RATE_LIMIT_MULTIPLIER=100 in Vercel and redeploy.
//      All the virtual users come from ONE machine, so without it the per-IP
//      limits would block the test long before the real servers are stressed.
//      (To test the real limits, leave it unset and expect 429s.)
//   3. In the staging database, make sure one location is active and the
//      pathway below exists and is active.
//   4. AI calls cost real money and use up your Groq limits. They are OFF by
//      default (AI_SHARE=0). Turn them on in small steps: AI_SHARE=0.1 first.
//
// HOW TO RUN (install k6 from https://k6.io/docs/get-started/installation/)
//   k6 run -e BASE_URL=https://your-staging.vercel.app loadtest/chair-session.k6.js
//
// OPTIONS (all optional, set with -e NAME=value)
//   PATHWAY          pathway key to use              default men_mental_health
//   CONSENT_VERSION  must match lib/consentVersion.js  default 2026-10-v1
//   PEAK_VUS         peak simultaneous virtual people  default 200
//   AI_SHARE         0 to 1: share who request AI reflections  default 0
//   TESTER_AUTH      user:password, if staging uses TESTER_LOGINS
//
// WHAT TO WATCH
//   * http_req_failed        should stay under 2%
//   * http_req_duration p95  should stay under 1.5 s
//   * rate_limited           should be 0 when RATE_LIMIT_MULTIPLIER is set
//   And, while it runs, the Vercel function logs, the Supabase dashboard
//   (CPU, connections) and the Upstash dashboard (commands per second).
// ---------------------------------------------------------------------------
import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, group, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const BASE_URL = (__ENV.BASE_URL || '').replace(/\/$/, '');
if (!BASE_URL) {
  throw new Error(
    'Set BASE_URL, for example: k6 run -e BASE_URL=https://your-staging.vercel.app loadtest/chair-session.k6.js',
  );
}
if (/chair-listens\.vercel\.app|thechairlistens/i.test(BASE_URL) && !__ENV.I_AM_SURE) {
  throw new Error(
    'BASE_URL looks like PRODUCTION. Load tests belong on staging. (Set -e I_AM_SURE=1 only if you really mean it.)',
  );
}

const PATHWAY = __ENV.PATHWAY || 'men_mental_health';
const CONSENT_VERSION = __ENV.CONSENT_VERSION || '2026-10-v1';
const PEAK_VUS = Number(__ENV.PEAK_VUS || 200);
const AI_SHARE = Math.min(1, Math.max(0, Number(__ENV.AI_SHARE || 0)));

// A fixed phrase, so the fake rows are easy to find and delete afterwards.
const TEST_ANSWER = 'Load test answer.';

const rateLimited = new Counter('rate_limited');

export const options = {
  scenarios: {
    activation: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: Math.round(PEAK_VUS / 4) }, // people start arriving
        { duration: '3m', target: PEAK_VUS }, // the crowd
        { duration: '1m', target: PEAK_VUS }, // hold the peak
        { duration: '1m', target: 0 }, // people leave
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1500'],
    rate_limited: ['count==0'],
  },
};

function jsonHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (__ENV.TESTER_AUTH) {
    headers.Authorization = `Basic ${encoding.b64encode(__ENV.TESTER_AUTH)}`;
  }
  return headers;
}

function between(min, max) {
  return min + Math.random() * (max - min);
}

function track(res) {
  if (res.status === 429) rateLimited.add(1);
  return res;
}

export default function () {
  // 1. Someone scans the QR code. Every page load makes these public reads.
  group('landing page', () => {
    for (const path of ['/api/locations', '/api/visitor-pins', '/api/messages']) {
      const res = track(http.get(`${BASE_URL}${path}`, { headers: jsonHeaders() }));
      check(res, { [`${path} is 200`]: (r) => r.status === 200 });
    }
  });
  sleep(between(1, 3));

  // 2. They tick the consent box.
  let sessionId = null;
  group('consent', () => {
    const res = track(
      http.post(
        `${BASE_URL}/api/consent`,
        JSON.stringify({ consent_version: CONSENT_VERSION }),
        { headers: jsonHeaders() },
      ),
    );
    check(res, { 'consent is 201': (r) => r.status === 201 });
    try {
      sessionId = res.json('sessionId');
    } catch (e) {
      sessionId = null;
    }
  });
  if (!sessionId) return; // no session, nothing more this person can do

  const headers = jsonHeaders({ 'x-session-id': sessionId });

  // 3. The questions load.
  group('questions', () => {
    const res = track(
      http.get(`${BASE_URL}/api/questions?script=${PATHWAY}`, { headers }),
    );
    check(res, { 'questions is 200': (r) => r.status === 200 });
  });

  // 4. They answer three questions, taking their time. Some ask for a reflection.
  const answers = [];
  for (let i = 1; i <= 3; i++) {
    sleep(between(4, 10));
    answers.push({
      questionId: `load-test-q${i}`,
      title: 'Check-in',
      question: `Question ${i}?`,
      answer: TEST_ANSWER,
    });

    if (Math.random() < AI_SHARE) {
      group('AI reflection', () => {
        const res = track(
          http.post(
            `${BASE_URL}/api/groq`,
            JSON.stringify({ script: PATHWAY, question: `Question ${i}?`, answer: TEST_ANSWER }),
            { headers },
          ),
        );
        // 503 means Groq itself is busy: worth knowing, but not our server failing.
        check(res, { 'groq is 200 or 503': (r) => r.status === 200 || r.status === 503 });
      });
    }
  }

  // 5. They save their answers.
  group('save responses', () => {
    const res = track(
      http.post(
        `${BASE_URL}/api/responses`,
        JSON.stringify({ session_id: sessionId, script: PATHWAY, answers }),
        { headers },
      ),
    );
    check(res, { 'responses is 200': (r) => r.status === 200 });
  });

  // 6. Some read the closing reflection.
  if (Math.random() < AI_SHARE) {
    group('session reflection', () => {
      const res = track(
        http.post(
          `${BASE_URL}/api/session-reflection`,
          JSON.stringify({ script: PATHWAY, answers }),
          { headers },
        ),
      );
      check(res, { 'reflection is 200': (r) => r.status === 200 });
    });
  }

  sleep(between(2, 5));
}
