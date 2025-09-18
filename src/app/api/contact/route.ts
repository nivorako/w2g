import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Avoid caching for this route
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants." },
        { status: 400 }
      );
    }

    // Basic length checks
    if (String(name).trim().length < 2 || String(message).trim().length < 10) {
      return NextResponse.json(
        { error: "Validation invalide." },
        { status: 400 }
      );
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.CONTACT_TO || user; // fallback to sender

    if (!user || !pass || !to) {
      return NextResponse.json(
        {
          error:
            "Configuration manquante. Veuillez définir GMAIL_USER, GMAIL_APP_PASSWORD et CONTACT_TO dans les variables d'environnement.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const subject = `Contact: ${name}`;
    const text = `Vous avez reçu un nouveau message via le formulaire de contact.\n\nNom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    const html = `
      <div>
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
      </div>
    `;

    await transporter.sendMail({
      from: `Contact Form <${user}>`,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("/api/contact error:", message);
    return NextResponse.json(
      { error: "Impossible d'envoyer le message pour le moment." },
      { status: 500 }
    );
  }
}

// Simple HTML escaping to prevent injection in the email HTML
function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
