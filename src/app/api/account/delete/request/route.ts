import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initParse } from "@/lib/parse";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

/**
 * Generates a random 6-digit code as a string.
 */
function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if (!email) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
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
        if (!user || !pass) {
            return NextResponse.json({ error: "Configuration email manquante" }, { status: 500 });
        }
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });

        const subject = "Suppression de compte - Votre code de confirmation";
        const text = `Votre code OTP est: ${code}. Il expire dans 10 minutes.`;
        const html = `<p>Vous avez demandé la suppression de votre compte.</p><p>Voici votre code de confirmation:</p><h2>${code}</h2><p>Ce code expire dans 10 minutes.</p>`;
        await transporter.sendMail({ from: `No-Reply <${user}>`, to: email, subject, text, html });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("/api/account/delete/request error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
