import { NextResponse } from "next/server";
import { initParse } from "@/lib/parse";

export const runtime = "nodejs";

/**
 * Crée un nouveau compte utilisateur.
 *
 * La requête doit contenir un objet JSON avec les clés suivantes:
 * - `name`: le nom de l'utilisateur (facultatif)
 * - `email`: l'adresse email de l'utilisateur (obligatoire)
 * - `password`: le mot de passe de l'utilisateur (obligatoire)
 * - `code`: le code de vérification de l'email (obligatoire)
 *
 * La réponse sera un objet JSON avec les clés suivantes:
 * - `id`: l'ID de l'utilisateur créé
 * - `email`: l'adresse email de l'utilisateur créé
 * - `name`: le nom de l'utilisateur créé (facultatif)
 *
 * Si la requête contient des erreurs, la réponse sera un objet JSON avec une clé `error` contenant un message d'erreur.
 *
 * Si la création du compte échoue, la réponse aura un statut 409 Conflict.
 *
 * Si une erreur inattendue se produit, la réponse aura un statut 500 Internal Server Error.
 */
export async function POST(req: Request) {
    try {
        const { name, email, password, code } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
        }
        if (!code) {
            return NextResponse.json({ error: "Code de vérification requis" }, { status: 400 });
        }

        const Parse = initParse();

        // Validate OTP: latest, not consumed, not expired, matching code
        const OTP = Parse.Object.extend("EmailOTP");
        const query = new Parse.Query(OTP);
        query.equalTo("email", email);
        query.descending("createdAt");
        const latest = await query.first({ useMasterKey: true });
        if (!latest) {
            return NextResponse.json({ error: "Code invalide" }, { status: 400 });
        }
        const expiresAt: Date = latest.get("expiresAt");
        const consumed: boolean = latest.get("consumed") ?? false;
        const savedCode: string = latest.get("code");
        const now = new Date();
        const valid = !consumed && expiresAt && expiresAt > now && savedCode === code;
        if (!valid) {
            return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });
        }

        // Proceed to sign up
        const user = new Parse.User();
        user.set("username", email);
        user.set("password", password);
        user.set("email", email);
        if (name) user.set("name", name);
        try {
            const created = await user.signUp();
            // Mark OTP consumed
            latest.set("consumed", true);
            await latest.save(null, { useMasterKey: true });

            const payload = {
                id: created.id,
                email: created.get("email") ?? email,
                name: created.get("name") ?? null,
            };
            return NextResponse.json(payload, { status: 201 });
        } catch (err: unknown) {
            // Parse duplicate errors: 202 (username taken), 203 (email taken)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const code = (err as any)?.code;
            if (code === 202 || code === 203) {
                return NextResponse.json(
                    { error: "Un compte existe déjà avec cet email" },
                    { status: 409 },
                );
            }
            throw err;
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
