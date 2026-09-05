import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days — Firebase's session cookie max

export async function POST(request: Request) {
  const { idToken } = (await request.json()) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
