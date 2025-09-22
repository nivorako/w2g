import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { initParse } from "@/lib/parse";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            /**
             * Authorize user based on provided credentials.
             * If credentials are invalid, return null.
             * If authorization fails, return null.
             * If authorization succeeds, return a User object with id, email and name.
             * @param {credentials} - Object containing email and password.
             * @returns {User | null} - Authorized user or null if authorization failed.
             */
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const Parse = initParse();
                try {
                    console.log("credentials :", credentials);
                    // Use email as username in Parse
                    const loggedIn = await Parse.User.logIn(
                        credentials.email,
                        credentials.password,
                    );
                    const authedUser: User = {
                        id: loggedIn.id,
                        email: loggedIn.get("email") ?? credentials.email,
                        name: loggedIn.get("name") ?? null,
                    };
                    console.log("authedUser :", authedUser);
                    // Optional: log out server-side session to avoid persisting Parse session on server
                    await Parse.User.logOut();
                    return authedUser;
                } catch {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        /**
         * Modify a JWT token to include the user's ID.
         *
         * @param {token} - The JWT token to modify.
         * @param {user} - The user object that contains the ID.
         * @returns {token} - The modified JWT token.
         */
        async jwt({ token, user }) {
            if (user) {
                // `id` is added via module augmentation in src/types/next-auth.d.ts
                token.id = user.id as string;
                // Persist user's name on the token so it can be mapped to the session later
                if (user.name) token.name = user.name;
            }
            return token;
        },
        /**
         * Modifies a session object to include the user's ID from a JWT token.
         *
         * @param {session} - The session object to modify.
         * @param {token} - The JWT token that contains the user's ID.
         * @returns {session} - The modified session object.
         */
        async session({ session, token }) {
            if (session.user) {
                // `id` is added via module augmentation in src/types/next-auth.d.ts
                if (token?.id) session.user.id = token.id;
                // Map name from token to session for easy client access
                if (token?.name && !session.user.name) session.user.name = token.name;
            }
            return session;
        },
    },
    events: {
        /**
         * Fired when a user signs in.
         *
         * @param {object} message - An object containing:
         *   user: {boolean} - Whether the user signed in.
         *   account: {object} - The account object from the provider.
         *   isNewUser: {boolean} - Whether the user is new or not.
         */
        async signIn(message) {
            console.log("[NextAuth events.signIn]", {
                user: !!message.user,
                accountProvider: message.account?.provider,
                isNewUser: message.isNewUser,
            });
        },
    },
    logger: {
        error(code, metadata) {
            console.error("[NextAuth logger.error]", code, metadata);
        },
        warn(code) {
            console.warn("[NextAuth logger.warn]", code);
        },
        debug(code, metadata) {
            console.log("[NextAuth logger.debug]", code, metadata);
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
