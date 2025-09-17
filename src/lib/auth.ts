import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { initParse } from "@/lib/parse";

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            
            if (!credentials?.email || !credentials?.password) return null;
            const Parse = initParse();
            try {
            console.log("credentials :", credentials);
            // Use email as username in Parse
            const loggedIn = await Parse.User.logIn(credentials.email, credentials.password);
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
        async jwt({ token, user }) {
        if (user) {
            // `id` is added via module augmentation in src/types/next-auth.d.ts
            token.id = user.id as string;
        }
        return token;
        },
        async session({ session, token }) {
        if (session.user && token?.id) {
            // `id` is added via module augmentation in src/types/next-auth.d.ts
            session.user.id = token.id;
        }
        return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
