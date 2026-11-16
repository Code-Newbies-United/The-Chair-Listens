// Tiny fake request/response objects for testing Next.js API routes.

export const TEST_IP = '203.0.113.7';
export const SESSION_ID = '3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b';

export function mockReq({
  method = 'POST',
  body,
  query = {},
  headers = {},
  ip = TEST_IP,
} = {}) {
  return {
    method,
    body,
    query,
    headers: { 'x-forwarded-for': ip, ...headers },
    socket: { remoteAddress: ip },
  };
}

export function mockRes() {
  const res = { statusCode: undefined, body: undefined, headers: {} };
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn((payload) => {
    res.body = payload;
    return res;
  });
  res.setHeader = jest.fn((name, value) => {
    res.headers[name] = value;
  });
  return res;
}

// The payload the real app sends (see finishSession in pages/questions.jsx).
export function validResponseBody(overrides = {}) {
  return {
    script: 'men_mental_health',
    session_id: SESSION_ID,
    answers: [
      {
        questionId: '9d1f0c7e-2b34-4a56-8c9d-0e1f2a3b4c5d',
        title: 'Check-in',
        question: 'How have you really been lately?',
        answer: 'Honestly, it has been a heavy few weeks.',
      },
    ],
    ...overrides,
  };
}
