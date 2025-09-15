"use client";

import styled from "styled-components";
import Link from "next/link";

const FooterRoot = styled.footer`
    margin-top: 2rem;
    background: var(--primary, #cf3201);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    color: #fff;
`;

const FooterInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.25rem 1rem;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
`;

const FooterLinks = styled.div`
    display: flex;
    gap: 1rem;
    a {
        color: #fff;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
        color: var(--secondary, #ff7642);
    }
`;

export default function Footer() {
    return (
        <FooterRoot>
            <FooterInner>
                <FooterLinks>
                    <Link href="/mentions-legales">Mentions légales</Link>
                    <Link href="/confidentialite">Politique de confidentialité</Link>
                    <Link href="/cookies">Cookies</Link>
                </FooterLinks>
                <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                    © {new Date().getFullYear()} Weare together
                </div>
            </FooterInner>
        </FooterRoot>
    );
}
