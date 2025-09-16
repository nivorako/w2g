"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

const Nav = styled.nav<{ $open: boolean }>`
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

    /* Mobile behavior */
    @media (max-width: 768px) {
        position: fixed;
        inset: 0;
        z-index: 20;
        background: #ffffff;
        color: var(--ink, #5a3a2a);
        flex-direction: column;
        align-items: flex-start;
        padding: 5rem 1.5rem 2rem;
        gap: 1.25rem;
        display: ${(p) => (p.$open ? "flex" : "none")};

        a {
            color: var(--ink, #5a3a2a);
            font-size: 1.1rem;
        }

        a:hover {
            color: var(--primary, #cf3201);
        }
    }
`;

const Burger = styled.button<{ $open: boolean }>`
    display: none;
    position: relative;
    width: 36px;
    height: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    margin-left: 0.5rem;
    color: #fff; /* icon color on header */

    @media (max-width: 768px) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        width: 26px;
        height: 26px;
        display: block;
    }
`;

const CloseBtn = styled.button`
    display: none;
    @media (max-width: 768px) {
        display: inline-flex;
        position: absolute;
        top: 14px;
        right: 12px;
        width: 38px;
        height: 38px;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        cursor: pointer;
        z-index: 25;
    }

    /* X icon */
    span,
    span::before,
    span::after {
        content: "";
        position: absolute;
        width: 26px;
        height: 2px;
        background: #000;
    }
    span { background: transparent; }
    span::before { transform: rotate(45deg); }
    span::after { transform: rotate(-45deg); }
`;

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Ensure the menu closes on any route change
    useEffect(() => {
        if (open) setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <HeaderRoot>
            <HeaderInner>
                <LogoWrap>
                    <Link href="/" aria-label="Accueil">
                        <Image src="/Logo.png" alt="Logo" width={36} height={36} priority />
                    </Link>
                </LogoWrap>

                {/* Desktop nav + Mobile overlay */}
                <Nav id="menu" $open={open}>
                    {open && (
                        <CloseBtn aria-label="Fermer le menu" onClick={() => setOpen(false)}>
                            <span />
                        </CloseBtn>
                    )}
                    <Link href="/a-propos" prefetch onClick={() => setOpen(false)}>À propos</Link>
                    <Link href="/evenements" prefetch onClick={() => setOpen(false)}>Événements</Link>
                    <Link href="/galerie" prefetch onClick={() => setOpen(false)}>Galerie</Link>
                    <Link href="/apprentissage" prefetch onClick={() => setOpen(false)}>Apprentissage</Link>
                    <Link href="/contact" prefetch onClick={() => setOpen(false)}>Contact</Link>
                    <Link href="/login" prefetch onClick={() => setOpen(false)}>Connexion</Link>
                    <Link href="/register" prefetch onClick={() => setOpen(false)}>Inscription</Link>
                </Nav>

                {/* Burger button (shows on mobile) */}
                <Burger
                    aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                    aria-expanded={open}
                    aria-controls="menu"
                    $open={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    )}
                </Burger>
            </HeaderInner>
        </HeaderRoot>
    );
}
