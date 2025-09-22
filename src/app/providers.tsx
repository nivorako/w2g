"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * The Providers component wraps the application with the NextAuth SessionProvider.
 * It passes the children prop down to the SessionProvider component.
 * @param {ReactNode} children - The children elements to be rendered inside the app.
 * @returns {JSX.Element} - The Providers element.
 */
export default function Providers({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
