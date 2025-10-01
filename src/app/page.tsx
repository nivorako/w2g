"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styled from "styled-components";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Events from "@/components/Events";
import Button from "@/components/Button";

const Page = styled.main`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    color: var(--ink, #5a3a2a);
    @media (max-width: 764px) {
        padding: 0 1rem;
    }
`;

const HeroCard = styled.section`
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    height: 360px;
    margin-bottom: 24px;
`;

const HeroOverlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    color: #fff7ec;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
`;

const HeroTitle = styled.h1`
    text-align: center;
    font-size: clamp(1.8rem, 3.5vw, 3rem);
    line-height: 1.2;
    font-weight: 700;
    font-family: var(--serif, Georgia, "Times New Roman", serif);
    margin-bottom: 0.75rem;
`;

const CTA = styled(Button).attrs({ size: "lg" as const, variant: "primary" as const })`
    /* prevent flex container from stretching it to full width */
    align-self: center;
`;

/* Grilles retirées: sections désormais empilées en pleine largeur */

const Card = styled.div`
    background: var(--paper, #f3e7d9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 1rem;
    /* Allow grid items to shrink within CSS Grid to avoid horizontal overflow */
    min-width: 0;
`;

const SectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary, #cf3201);
    margin-bottom: 0.6rem;
    text-align: center;
`;

const Muted = styled.p`
    color: #6b5b53;
`;

/* Table moved into components/Events.tsx */

const SmallButton = styled(Button).attrs({ size: "sm" as const, variant: "outline" as const })``;

/**
 * Page component for the home page.
 *
 * Displays a hero card with an overlay, a grid of sections for About and Events,
 * a two-column grid for Testimonials and Gallery, and a section for learning.
 *
 * @returns {React.ReactElement} The page content.
 */
export default function Home() {
    const { data: session } = useSession();
    const [banner, setBanner] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // Show success banner when redirected after account deletion (moved from Header)
    useEffect(() => {
        const deleted = searchParams?.get("account_deleted");
        if (deleted) {
            setBanner("Votre compte a bien été supprimé");
            // Clean the URL (remove query param)
            router.replace(pathname);
            const t = setTimeout(() => setBanner(null), 4000);
            return () => clearTimeout(t);
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, pathname]);
    return (
        <Page>
            {banner && (
                <p
                    role="status"
                    aria-live="polite"
                    style={{
                        color: "var(--primary, #cf3201)",
                        textAlign: "end",
                        fontWeight: 600,
                    }}
                >
                    {banner}
                </p>
            )}
            {session?.user.name && (
                <p
                    style={{
                        color: "var(--primary, #cf3201)",
                        textAlign: "end",
                    }}
                >
                    Bienvenu (e) {session?.user.name}
                </p>
            )}
            {/* Hero */}
            <HeroCard>
                <Image
                    src="/danse.jpg"
                    alt="Scène de danse"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: "cover" }}
                />
                <HeroOverlay>
                    <HeroTitle>
                        Danser, apprendre, partager
                        <br />
                        We are together !
                    </HeroTitle>
                    <CTA>Voir les prochains évènements</CTA>
                </HeroOverlay>
            </HeroCard>

            {/* Sections en pleine largeur, empilées */}
            <Card>
                <SectionTitle>Qui sommes-nous ?</SectionTitle>
                <Muted>Notre passion pour la danse</Muted>
                <div style={{ marginTop: 12 }}>
                    <SmallButton>En savoir plus</SmallButton>
                </div>
            </Card>

            <section style={{ marginTop: 18 }}>
                <Events />
            </section>

            <section style={{ marginTop: 18 }}>
                <Testimonials />
            </section>

            <section style={{ marginTop: 18 }}>
                <Gallery />
            </section>

            {/* Apprentissage */}
            <Card style={{ marginTop: 18 }}>
                <SectionTitle>Apprentissage</SectionTitle>
                <Muted>Découvrez les danses caribéennes</Muted>
                <div style={{ marginTop: 12 }}>
                    <SmallButton>Explorer les styles</SmallButton>
                </div>
            </Card>
        </Page>
    );
}
