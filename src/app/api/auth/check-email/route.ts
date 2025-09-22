import { NextResponse } from "next/server";
import { initParse } from "@/lib/parse";

export const runtime = "nodejs";

/**
 * Check if an email address is already registered.
 *
 * This API will return a JSON object with a single property `exists` which is a boolean indicating whether the email address is already registered.
 *
 * @param {Request} req The request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the NextResponse object.
 */
export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        const Parse = initParse();
        const query = new Parse.Query(Parse.User);
        // In this app we use email as username
        query.equalTo("username", email);
        const existing = await query.first({ useMasterKey: true });

        return NextResponse.json({ exists: !!existing });
    } catch (e) {
        console.error("/api/auth/check-email error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
