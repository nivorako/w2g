"use client";

import styled from "styled-components";
import Image from "next/image";

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
    font-size: clamp(1.8rem, 3.5vw, 3rem);
    line-height: 1.2;
    font-weight: 700;
    font-family: var(--serif, Georgia, "Times New Roman", serif);
    margin-bottom: 0.75rem;
`;

const CTA = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    background: var(--primary, #cf3201);
    color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: background .2s ease;
    &:hover { background: var(--secondary, #ff7642); }
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

const Card = styled.div`
    background: var(--paper, #f3e7d9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 1rem;
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

const TwoCol = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    td, th { padding: 8px; border-bottom: 1px solid rgba(0,0,0,0.06); }
    th { text-align: left; color: var(--primary, #cf3201); font-weight: 700; }
`;

const SmallButton = styled.button`
    padding: 0.4rem 0.6rem;
    border-radius: 7px;
    background: var(--primary, #cf3201);
    color: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: opacity .2s ease;
    &:hover { opacity: .95; background: var(--secondary, #ff7642); }
`;

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
                        Danser, apprendre, partager – partout, ensemble !
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

                <Card>
                    <SectionTitle>Événements à venir</SectionTitle>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Ville</th>
                                <th>Style</th>
                                <th>Niveau</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>12 mai</td>
                                <td>Lyon</td>
                                <td>Salsa</td>
                                <td>Débutant</td>
                                <td><SmallButton>Détails</SmallButton></td>
                            </tr>
                            <tr>
                                <td>22 mai</td>
                                <td>Bordeaux</td>
                                <td>Zouk</td>
                                <td>Inter</td>
                                <td><SmallButton>Détails</SmallButton></td>
                            </tr>
                            <tr>
                                <td>5 juin</td>
                                <td>Marseille</td>
                                <td>Mix</td>
                                <td>Tous niveaux</td>
                                <td><SmallButton>Détails</SmallButton></td>
                            </tr>
                        </tbody>
                    </Table>
                    <div style={{ marginTop: 10 }}>
                        <SmallButton>Voir tous les évènements</SmallButton>
                    </div>
                </Card>
            </Grid>

            {/* Testimonials + Gallery */}
            <Grid style={{ gridTemplateColumns: "1fr 1fr" }}>
                <Card>
                    <SectionTitle>Témoignages</SectionTitle>
                    <TwoCol>
                        <Card>
                            <strong>Julie</strong>
                            <Muted>On urol woi... Le bièn bien et travaillnsa</Muted>
                        </Card>
                        <Card>
                            <strong>David</strong>
                            <Muted>Je resonne strsiac! Salsa</Muted>
                        </Card>
                        <Card>
                            <strong>Sasia</strong>
                            <Muted>—</Muted>
                        </Card>
                        <Card>
                            <strong>Sophie</strong>
                            <Muted>Me refereus une vendne — Dance</Muted>
                        </Card>
                    </TwoCol>
                </Card>
                <Card>
                    <SectionTitle>Galerie</SectionTitle>
                    <TwoCol>
                        <div style={{ background: "#ead8c7", height: 120, borderRadius: 10 }} />
                        <div style={{ background: "#ead8c7", height: 120, borderRadius: 10 }} />
                        <div style={{ background: "#ead8c7", height: 120, borderRadius: 10 }} />
                        <div style={{ background: "#ead8c7", height: 120, borderRadius: 10 }} />
                    </TwoCol>
                    <div style={{ marginTop: 10 }}>
                        <SmallButton>Accéder à la galerie complète</SmallButton>
                    </div>
                </Card>
            </Grid>

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
