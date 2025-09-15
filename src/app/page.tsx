"use client";

import styled from "styled-components";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Events from "@/components/Events";
import Button from "@/components/Button";

const Page = styled.main`
    max-width: 1200px;
    margin: 1.25rem auto 2rem;
    padding: 0 1rem;
    color: var(--ink, #5a3a2a);
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
    align-self: flex-start;
`;

const Grid = styled.section`
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 18px;
    margin-top: 10px;
    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const TwoColGrid = styled(Grid)`
    grid-template-columns: 1fr 1fr;
    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

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
`;

const Muted = styled.p`
    color: #6b5b53;
`;

/* Table moved into components/Events.tsx */

const SmallButton = styled(Button).attrs({ size: "sm" as const, variant: "outline" as const })``;

export default function Home() {
    return (
        <Page>
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

            {/* Grid of sections: About + Events */}
            <Grid>
                <Card>
                    <SectionTitle>Qui sommes-nous ?</SectionTitle>
                    <Muted>Notre passion pour la danse</Muted>
                    <div style={{ marginTop: 12 }}>
                        <SmallButton>En savoir plus</SmallButton>
                    </div>
                </Card>

                <Events />
            </Grid>

            {/* Testimonials + Gallery */}
            <TwoColGrid>
                <Testimonials />
                <Gallery />
            </TwoColGrid>

            {/* Learning */}
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
