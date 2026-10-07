// Receives dealer applications and contact messages.
// TODO: send these somewhere real (email, CRM, Google Sheet). For now they are
// validated and logged on the server so the forms can be built and tested.

const MAX = 2000;

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // honeypot: real people never fill this hidden field
  if (clean(body.website)) return Response.json({ ok: true });

  const kind = clean(body.kind) === "dealer" ? "dealer" : "contact";
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);

  if (!name) return Response.json({ ok: false, error: "Please enter your name." }, { status: 422 });
  if (!/^[+\d][\d\s\-()]{6,}$/.test(phone)) {
    return Response.json({ ok: false, error: "Please enter a valid phone number." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "That email address doesn't look right." }, { status: 422 });
  }

  const entry = {
    kind,
    name,
    phone,
    email,
    district: clean(body.district),
    role: clean(body.role),
    topic: clean(body.topic),
    from: clean(body.from),
    to: clean(body.to),
    size: clean(body.size),
    message: clean(body.message, MAX),
    receivedAt: new Date().toISOString(),
  };
  console.log("[enquiry]", JSON.stringify(entry));

  return Response.json({ ok: true });
}
