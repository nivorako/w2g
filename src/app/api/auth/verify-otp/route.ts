import { NextResponse } from "next/server";
import { initParse } from "@/lib/parse";

export const runtime = "nodejs";

/**
 * Vérifie un code OTP.
 *
 * @param {Request} req - La requête HTTP
 * @returns {Promise<Response>} La réponse HTTP
 *
 * @throws {Error} Si l'email ou le code est manquant ou si le serveur rencontre une erreur inattendue.
 */
export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();
        if (!email || !code) {
            return NextResponse.json({ error: "Email et code requis" }, { status: 400 });
        }
        const Parse = initParse();
        const OTP = Parse.Object.extend("EmailOTP");
        const query = new Parse.Query(OTP);
        query.equalTo("email", email);
        query.descending("createdAt");
        const latest = await query.first({ useMasterKey: true });
        if (!latest) return NextResponse.json({ valid: false }, { status: 200 });
        const expiresAt: Date = latest.get("expiresAt");
        const consumed: boolean = latest.get("consumed") ?? false;
        const savedCode: string = latest.get("code");
        const now = new Date();
        const valid = !consumed && expiresAt && expiresAt > now && savedCode === code;
        return NextResponse.json({ valid });
    } catch (e) {
        console.error("/api/auth/verify-otp error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
