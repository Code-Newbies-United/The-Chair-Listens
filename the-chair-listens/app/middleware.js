import { NextResponse } from "next/server";

export function middleware(req) {
  const expires = process.env.TEST_EXPIRES;
  if (expires && Date.now() > new Date(expires).getTime()) {
    return new NextResponse("This test period has ended.", { status: 410 });
  }

  const logins = (process.env.TESTER_LOGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (logins.length === 0) return NextResponse.next();

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      if (logins.includes(decoded)) return NextResponse.next();
    } catch {}
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="The Chair Listens test"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};