"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { BsFillPersonFill } from "react-icons/bs";

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
        width: 50%;
        position: fixed;
        inset: 0;
        z-index: 20;
        background: var(--primary, #cf3201);
        color: #fff;
        flex-direction: column;
        align-items: flex-start;
        padding: 5rem 1.5rem 2rem;
        gap: 1.25rem;
        display: ${(p) => (p.$open ? "flex" : "none")};
        right: 0;
        left: auto;

        a {
            color: #fff;
            font-size: 1.1rem;
            -webkit-tap-highlight-color: rgba(207, 50, 1, 0.15);
        }

        a:hover {
            color: var(--secondary, #ff7642);
        }

        /* Touch feedback (mobile doesn't trigger :hover reliably) */
        a:active {
            color: var(--primary, #cf3201);
        }

        /* Keyboard accessibility on mobile/desktop */
        a:focus-visible {
            outline: 2px solid var(--primary, #cf3201);
            outline-offset: 2px;
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
    span {
        background: transparent;
    }
    span::before {
        transform: rotate(45deg);
    }
    span::after {
        transform: rotate(-45deg);
    }
`;

const PersonBtn = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid #fff;
    color: #fff;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
    &:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 2px;
    }
`;

const UserMenuWrap = styled.div`
    position: relative;
    display: inline-flex;
    align-items: center;
    z-index: 40; /* ensure above header content */

    /* Reveal submenu on hover or when any child has focus */
    &:hover > .submenu,
    &:focus-within > .submenu {
        display: flex;
    }
`;

const SubMenu = styled.div.attrs({ className: "submenu" })`
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 180px;
    display: none; /* hidden by default */
    flex-direction: column;
    gap: 0.35rem;
    background: var(--primary, #ff7642);
    color: #fff;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    z-index: 50; /* above wrapper */

    a {
        color: #fff;
        text-decoration: none;
        font-weight: 600;
        padding: 0.35rem 0.25rem;
        border-radius: 6px;
    }

    a:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    /* Allow buttons as submenu items */
    button.submenu-item {
        text-align: left;
        background: transparent;
        border: none;
        color: #fff;
        font-weight: 600;
        padding: 0.35rem 0.25rem;
        border-radius: 6px;
        cursor: pointer;
    }
    button.submenu-item:hover {
        background: rgba(255, 255, 255, 0.15);
    }

    /* Mobile: white background and primary-colored text */
    @media (max-width: 768px) {
        background: #ffffff;
        color: var(--primary, #cf3201);
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 10px 18px rgba(0, 0, 0, 0.18);

        a {
            color: var(--primary, #cf3201);
        }

        a:hover {
            background: rgba(207, 50, 1, 0.08);
        }

        button.submenu-item {
            color: var(--primary, #cf3201);
        }
        button.submenu-item:hover {
            background: rgba(207, 50, 1, 0.08);
        }
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    width: 90%;
    max-width: 420px;
    background: #fff;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
    margin: 0 0 0.5rem 0;
    color: #111;
`;

const ModalText = styled.p`
    margin: 0.25rem 0 0.75rem 0;
    color: #333;
`;

const ModalActions = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 0.75rem;
`;

const Btn = styled.button<{ $variant?: "primary" | "ghost" }>`
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid ${(p) => (p.$variant === "primary" ? "var(--primary, #cf3201)" : "#ccc")};
    background: ${(p) => (p.$variant === "primary" ? "var(--primary, #cf3201)" : "#fff")};
    color: ${(p) => (p.$variant === "primary" ? "#fff" : "#111")};
    cursor: pointer;
    font-weight: 600;
`;

export default function Header() {
    const [open, setOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState<"confirm" | "otp">("confirm");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const displayName = session?.user?.name ?? session?.user?.email ?? null;

    // Ensure the menu closes on any route change
    useEffect(() => {
        if (open) setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Show success banner when redirected after account deletion
    useEffect(() => {
        const deleted = searchParams?.get("account_deleted");
        if (deleted) {
            setBanner("Votre compte a bien été supprimé");
            // Clean the URL (remove query param)
            router.replace(pathname);
            const t = setTimeout(() => setBanner(null), 6000);
            return () => clearTimeout(t);
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, pathname]);

    // (Removed) outside-click closing to keep behavior strictly on hover and link clicks

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
                    <Link href="/a-propos" prefetch onClick={() => setOpen(false)}>
                        À propos
                    </Link>
                    <Link href="/evenements" prefetch onClick={() => setOpen(false)}>
                        Événements
                    </Link>
                    <Link href="/galerie" prefetch onClick={() => setOpen(false)}>
                        Galerie
                    </Link>
                    <Link href="/apprentissage" prefetch onClick={() => setOpen(false)}>
                        Apprentissage
                    </Link>
                    <Link href="/contact" prefetch onClick={() => setOpen(false)}>
                        Contact
                    </Link>
                    {displayName ? (
                        <UserMenuWrap>
                            <PersonBtn
                                aria-label="Menu utilisateur"
                                aria-expanded={false}
                                aria-controls="user-submenu"
                                aria-haspopup="menu"
                            >
                                <BsFillPersonFill size={18} />
                            </PersonBtn>
                            <SubMenu id="user-submenu" role="menu">
                                <button
                                    className="submenu-item"
                                    onClick={() => {
                                        setOpen(false);
                                        signOut({ callbackUrl: "/" });
                                    }}
                                >
                                    Déconnexion
                                </button>
                                <button
                                    className="submenu-item"
                                    onClick={() => {
                                        setError(null);
                                        setOtp("");
                                        setDeleteStep("confirm");
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Supprimer mon compte
                                </button>
                            </SubMenu>
                        </UserMenuWrap>
                    ) : (
                        <UserMenuWrap>
                            <PersonBtn
                                aria-label="Menu utilisateur"
                                aria-expanded={false}
                                aria-controls="user-submenu"
                                aria-haspopup="menu"
                            >
                                <BsFillPersonFill size={18} />
                            </PersonBtn>
                            <SubMenu id="user-submenu" role="menu">
                                <Link href="/login" prefetch>
                                    Connexion
                                </Link>
                            </SubMenu>
                        </UserMenuWrap>
                    )}
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
                            <path
                                d="M6 6L18 18M6 18L18 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M3 6H21M3 12H21M3 18H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </Burger>
            </HeaderInner>
            {banner && (
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        background: "#e6ffed",
                        color: "#034d1f",
                        borderTop: "1px solid #c6f6d5",
                        borderBottom: "1px solid #c6f6d5",
                        padding: "0.5rem 1rem",
                        fontWeight: 600,
                    }}
                >
                    {banner}
                </div>
            )}
            {showDeleteModal && (
                <ModalOverlay onClick={() => !loading && setShowDeleteModal(false)}>
                    <ModalBox onClick={(e) => e.stopPropagation()}>
                        {deleteStep === "confirm" ? (
                            <>
                                <ModalTitle>Suppression de compte</ModalTitle>
                                <ModalText>
                                    Êtes-vous sûr de vouloir supprimer votre compte ? Cette action
                                    est définitive.
                                </ModalText>
                                {error && (
                                    <ModalText style={{ color: "#b00020" }}>{error}</ModalText>
                                )}
                                <ModalActions>
                                    <Btn
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </Btn>
                                    <Btn
                                        $variant="primary"
                                        onClick={async () => {
                                            try {
                                                setLoading(true);
                                                setError(null);
                                                const res = await fetch(
                                                    "/api/account/delete/request",
                                                    {
                                                        method: "POST",
                                                    },
                                                );
                                                if (!res.ok) {
                                                    const j: { error?: string } = await res
                                                        .json()
                                                        .catch(() => ({}) as { error?: string });
                                                    throw new Error(
                                                        j.error || "Échec d'envoi du code",
                                                    );
                                                }
                                                setDeleteStep("otp");
                                            } catch (e: unknown) {
                                                const msg =
                                                    e instanceof Error
                                                        ? e.message
                                                        : "Erreur inconnue";
                                                setError(msg);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? "Envoi..." : "Oui, envoyer le code"}
                                    </Btn>
                                </ModalActions>
                            </>
                        ) : (
                            <>
                                <ModalTitle>Entrez le code reçu par email</ModalTitle>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="Code à 6 chiffres"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    style={{
                                        width: "100%",
                                        padding: "0.6rem 0.7rem",
                                        borderRadius: 8,
                                        border: "1px solid #ccc",
                                        fontSize: "1rem",
                                        letterSpacing: "0.2em",
                                    }}
                                />
                                {error && (
                                    <ModalText style={{ color: "#b00020" }}>{error}</ModalText>
                                )}
                                <ModalActions>
                                    <Btn
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </Btn>
                                    <Btn
                                        $variant="primary"
                                        onClick={async () => {
                                            try {
                                                setLoading(true);
                                                setError(null);
                                                const res = await fetch(
                                                    "/api/account/delete/confirm",
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ code: otp }),
                                                    },
                                                );
                                                if (!res.ok) {
                                                    const j: { error?: string } = await res
                                                        .json()
                                                        .catch(() => ({}) as { error?: string });
                                                    throw new Error(j.error || "Code invalide");
                                                }
                                                // success: sign out with banner flag and close
                                                setShowDeleteModal(false);
                                                signOut({ callbackUrl: "/?account_deleted=1" });
                                            } catch (e: unknown) {
                                                const msg =
                                                    e instanceof Error
                                                        ? e.message
                                                        : "Erreur inconnue";
                                                setError(msg);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading || otp.length < 6}
                                    >
                                        {loading ? "Vérification..." : "Confirmer la suppression"}
                                    </Btn>
                                </ModalActions>
                            </>
                        )}
                    </ModalBox>
                </ModalOverlay>
            )}
        </HeaderRoot>
    );
}
