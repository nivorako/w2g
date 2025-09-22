import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { initParse } from "@/lib/parse";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if (!email) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const { code } = await req.json().catch(() => ({}));
        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "Code requis" }, { status: 400 });
        }

        const Parse = initParse();

        // Verify OTP
        const OTP = Parse.Object.extend("EmailOTP");
        const otpQuery = new Parse.Query(OTP);
        otpQuery.equalTo("email", email);
        otpQuery.equalTo("code", code);
        otpQuery.equalTo("consumed", false);
        otpQuery.greaterThan("expiresAt", new Date());

        const match = await otpQuery.first({ useMasterKey: true });
        if (!match) {
            return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });
        }

        // Mark consumed
        match.set("consumed", true);
        await match.save(null, { useMasterKey: true });

        // Delete the user in Parse
        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("email", email);
        const user = await userQuery.first({ useMasterKey: true });
        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        }

        await user.destroy({ useMasterKey: true });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("/api/account/delete/confirm error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
