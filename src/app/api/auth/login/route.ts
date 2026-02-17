import { NextResponse } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export async function POST(request: Request) {
  if (!SITE_PASSWORD) {
    return NextResponse.json(
      {
        message:
          "Server-Passwort ist nicht konfiguriert. Bitte die Umgebungsvariable SITE_PASSWORD setzen.",
      },
      { status: 500 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Ungültige Anfrage. Passwort wird als JSON erwartet." },
      { status: 400 }
    );
  }

  const { password } = (body ?? {}) as { password?: string };

  if (!password || password !== SITE_PASSWORD) {
    return NextResponse.json(
      { message: "Das Passwort ist leider falsch." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  // Setze ein HttpOnly-Cookie, das von der Middleware geprüft wird
  response.cookies.set("site_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 Stunden
  });

  return response;
}

