import { NextResponse } from "next/server";
import { initParse } from "@/lib/parse";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/**
 * Generates a random 6-digit code as a string.
 *
 * @returns {string} A 6-digit code as a string.
 */
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Envoie un code OTP à l'email spécifié.
 *
 * @param {Request} req - La requête HTTP
 * @returns {Promise<Response>} La réponse HTTP
 *
 * @throws {Error} Si l'email est manquant ou si le serveur rencontre une erreur inattendue.
 */
export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        const Parse = initParse();
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const OTP = Parse.Object.extend("EmailOTP");
        const otp = new OTP();
        otp.set("email", email);
        otp.set("code", code);
        otp.set("expiresAt", expiresAt);
        otp.set("consumed", false);
        await otp.save(null, { useMasterKey: true });

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;
        const to = email;
        if (!user || !pass) {
            return NextResponse.json(
                { error: "Configuration email manquante" },
                { status: 500 },
            );
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });

        const subject = "Votre code de vérification";
        const text = `Votre code OTP est: ${code}. Il expire dans 10 minutes.`;
        const html = `<p>Voici votre code de vérification:</p><h2>${code}</h2><p>Il expire dans 10 minutes.</p>`;
        await transporter.sendMail({ from: `No-Reply <${user}>`, to, subject, text, html });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("/api/auth/send-otp error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
