import { NextResponse } from "next/server";
import { initParse } from "@/lib/parse";
import Parse from "parse/node";

export const runtime = "nodejs";

/**
 * GET /api/testimonials
 *
 * Returns the list of testimonials and their total count.
 * Expected Parse schema (flexible):
 *  - Class: Testimonial
 *  - Fields:
 *      - message: string (required)
 *      - authorName: string (optional) OR author: Pointer<_User|User> (optional)
 *      - createdAt: Date (built-in)
 */
export async function GET() {
    try {
        initParse();
        // Use GuestPost as the source class for testimonials
        const GuestPost = Parse.Object.extend("GuestPost");
        const query = new Parse.Query(GuestPost);
        query.descending("createdAt");
        // Include common author pointer fields to resolve names later
        query.include(["author", "user", "owner"]);

        // Fetch list and count
        const [items, total] = await Promise.all([
            query.find({ useMasterKey: true }),
            query.count({ useMasterKey: true }),
        ]);

        const testimonials = items.map((obj) => {
            // Exact field mapping requested:
            // - date: createdAt (built-in)
            // - senderId: string field "senderId"
            // - message: string field "guest"
            // - name: string field "senderUsername"

            const senderId = (obj.get("senderId") as unknown as string | undefined) ?? null;
            const author =
                (obj.get("senderUsername") as unknown as string | undefined) ?? "Anonyme";
            const message: string = (obj.get("guest") as unknown as string | undefined) ?? "";

            const createdAt: string = obj.createdAt
                ? obj.createdAt.toISOString()
                : new Date().toISOString();

            return {
                id: obj.id,
                senderId,
                author,
                message,
                createdAt,
            };
        });

        return NextResponse.json({ count: total, items: testimonials });
    } catch (e) {
        console.error("/api/testimonials error", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
