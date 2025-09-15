"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const HeaderRoot = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
    background: var(--primary, #cf3201);
    color: #fff;
`;

const HeaderInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
`;

const LogoWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 1rem;

    a {
        color: #fff;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    a:hover {
        color: var(--secondary, #ff7642);
    }
`;

export default function Header() {
    return (
        <HeaderRoot>
            <HeaderInner>
                <LogoWrap>
                    <Link href="/" aria-label="Accueil">
                        <Image src="/Logo.png" alt="Logo" width={36} height={36} priority />
                    </Link>
                </LogoWrap>
                <Nav>
                    <Link href="/a-propos">À propos</Link>
                    <Link href="/evenements">Événements</Link>
                    <Link href="/galerie">Galerie</Link>
                    <Link href="/apprentissage">Apprentissage</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/login">Connexion</Link>
                    <Link href="/register">Inscription</Link>
                </Nav>
            </HeaderInner>
        </HeaderRoot>
    );
}
