"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

const Wrapper = styled.section`
    background: var(--paper, #f3e7d9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 1rem;
    max-width: 1200px; /* largeur max du bloc */
    margin: 0 auto; /* centrer */
`;

/* Boîte de droite réellement utilisée dans le JSX (évite tout conflit de cache de classes) */
const RightPanelBox = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 160px;
    background: var(--paper, #f3e7d9);
    text-align: center;
    padding: 20px 40px 
    isolation: isolate; /* crée un nouveau contexte de pile pour ::before */
    /* Empêcher les textes très longs/URLs de déborder */
    overflow-wrap: anywhere;
    word-break: break-word;
    hyphens: auto;
    max-width: 100%;
    & > * {
        position: relative;
        z-index: 1;
    }
    /* Forcer une couleur de texte sombre pour assurer la lisibilité sur fond clair */
    & p { color: var(--ink, #5a3a2a); text-align: left; margin-left: 20px;}
    &::before {
        content: "“"; /* guillemet ouvrant décoratif (unicode direct) */
        position: absolute;
        left: 12px;
        top: 10px;
        font-size: 24px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.35);
        font-weight: 700;
        z-index: 0;
        pointer-events: none;
        font-family: Georgia, "Times New Roman", serif;
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary, #cf3201);
    margin-bottom: 0.6rem;
    text-align: center;
`;

const HeaderRow = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 1rem;
    @media (min-width: 425px) and (max-width: 1200px) {
        flex-direction: row;
        align-items: center;
        gap: 16px;
    }
`;

const CountBadge = styled.span`
    background: rgba(0, 0, 0, 0.08);
    color: var(--ink, #5a3a2a);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.9rem;
`;

// Carousel layout
const CarouselRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
`;

const Viewport = styled.div`
    position: relative;
    overflow: hidden;
    width: 100%;
    flex: 1 1 0%; /* occupe l'espace restant entre les flèches */
    min-height: 180px; /* évite l'effet d'affichage de toutes les cartes avant mesure */
`;

const Track = styled.div<{ $translate: number }>`
    display: flex;
    gap: 12px;
    transition: transform 300ms ease;
    transform: translateX(${(p) => `-${p.$translate}px`});
`;

const ArrowBtn = styled.button`
    border: none;
    background: rgba(0, 0, 0, 0.06);
    color: var(--ink, #5a3a2a);
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    font-weight: 700;
    transition: background 150ms ease;
    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }
    &:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.12);
    }
`;

const ItemSlide = styled.div<{ $widthPx: number }>`
    flex: 0 0 auto;
    width: ${(p) => `${p.$widthPx}px`};
    min-width: ${(p) => `${p.$widthPx}px`};
    max-width: ${(p) => `${p.$widthPx}px`};
`;

const ItemCard = styled.div`
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 1rem;
    color: var(--ink, #5a3a2a);
    height: 100%;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    transition:
        transform 180ms ease,
        box-shadow 180ms ease;
    display: flex;
    flex-direction: column;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.09);
    }
`;

const CardGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr; /* par défaut: empilé */
    gap: 0; /* séparateur géré par bordures, pas par l'espace */
    align-items: stretch;
    grid-auto-rows: 1fr; /* force des cellules de même hauteur */
    min-height: 180px;
    border-radius: 8px;
    overflow: hidden;
    @media (min-width: 426px) {
        grid-template-columns: 1fr 1fr; /* au-dessus de 425px: deux colonnes égales */
    }
`;

const LeftPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: rgba(255, 255, 255, 0.9);
    padding: 16px 12px;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    @media (max-width: 425px) {
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
`;

const RightContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const PhotoBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff;
    color: #8b7b72;
    overflow: hidden;
    position: relative;
`;

const Muted = styled.p`
    color: #6b5b53;
    line-height: 1.6;
    margin-top: 5px;
    margin-bottom: 0;
    /* Sécuriser l'affichage des textes très longs avec retours à la ligne */
    overflow-wrap: anywhere;
    word-break: break-word;
    hyphens: auto;
    white-space: pre-wrap;
    max-width: 100%;
`;

// TitleBar removed (no longer used)

const Author = styled.span`
    font-weight: 700;
    font-size: 1rem;
    color: var(--ink, #5a3a2a);
    text-align: center;
`;

const DateText = styled.span`
    color: #6b5b53;
    font-weight: 500;
    font-size: 0.9rem;
    white-space: nowrap;
    text-align: center;
`;

type Testimonial = {
    id: string;
    author: string;
    message: string;
    createdAt: string; // ISO
    senderId?: string | null;
    imageUrl?: string | null; // optionnel
    photo?: string | null; // compat: certaines API peuvent renvoyer `photo`
};

export default function Testimonials() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const res = await fetch("/api/testimonials", { cache: "no-store" });
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                if (!cancelled) {
                    setItems(Array.isArray(data.items) ? data.items : []);
                    setCount(typeof data.count === "number" ? data.count : 0);
                }
            } catch (err: unknown) {
                const msg =
                    err instanceof Error ? err.message : "Impossible de charger les témoignages";
                if (!cancelled) setError(msg);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Responsive: max 1200px, >=768px: 3 cartes, >=425px et <768px: 2, <425px: 1.
    const GAP = 12; // doit matcher l'écart du Track
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [viewportW, setViewportW] = useState<number>(0);
    const [windowW, setWindowW] = useState<number>(0);
    const visibleCount = useMemo(() => {
        const w = windowW || viewportW || 1200; // se base sur la fenêtre pour les breakpoints
        if (w > 768) return 3;
        if (w > 425) return 2;
        return 1;
    }, [windowW, viewportW]);
    const itemWidth = useMemo(() => {
        const baseW = viewportW || 1200; // fallback pour rendu initial
        const inner = Math.min(1200, baseW) - GAP * (visibleCount - 1);
        return Math.max(1, Math.floor(inner / visibleCount));
    }, [viewportW, visibleCount]);
    const maxIndex = useMemo(
        () => Math.max(0, items.length - visibleCount),
        [items.length, visibleCount],
    );
    const canPrev = index > 0;
    const canNext = index < maxIndex;

    const goPrev = () => setIndex((v) => (v > 0 ? v - 1 : 0));
    const goNext = () => setIndex((v) => (v < maxIndex ? v + 1 : v));

    const translatePx = index * (itemWidth + GAP); // translation du track en pixels

    // S'assurer que l'index reste valide si la liste ou la largeur change
    useEffect(() => {
        setIndex((v) => (v > maxIndex ? maxIndex : v));
    }, [maxIndex]);

    // Observer la taille du viewport
    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = Math.min(1200, Math.floor(entry.contentRect.width));
                setViewportW(w);
            }
        });
        ro.observe(el);
        // Initialiser
        const rect = el.getBoundingClientRect();
        setViewportW(Math.min(1200, Math.floor(rect.width)));
        return () => ro.disconnect();
    }, []);

    // Suivre la largeur de la fenêtre pour piloter les breakpoints (SSR safe)
    useEffect(() => {
        const update = () => {
            if (typeof window !== "undefined") {
                setWindowW(window.innerWidth);
                const el = viewportRef.current;
                if (el) {
                    const rect = el.getBoundingClientRect();
                    setViewportW(Math.min(1200, Math.floor(rect.width)));
                }
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <Wrapper>
            <HeaderRow>
                <SectionTitle>Ce que nos danseurs disent</SectionTitle>
                <CountBadge>
                    {count} message{count > 1 ? "s" : ""}
                </CountBadge>
            </HeaderRow>

            {loading && <Muted>Chargement…</Muted>}
            {error && !loading && <Muted>{error}</Muted>}

            {!loading && !error && (
                <CarouselRow>
                    <ArrowBtn aria-label="Précédent" onClick={goPrev} disabled={!canPrev}>
                        ◀
                    </ArrowBtn>
                    <Viewport ref={viewportRef}>
                        {items.length === 0 && <Muted>Aucun témoignage pour l’instant.</Muted>}
                        {items.length > 0 && itemWidth > 0 && (
                            <Track $translate={translatePx}>
                                {items.map((t) => {
                                    const date = new Date(t.createdAt);
                                    const formatted = isNaN(date.getTime())
                                        ? t.createdAt
                                        : date.toLocaleDateString("fr-FR", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                          });
                                    const photo = t.photo ?? t.imageUrl ?? null;
                                    return (
                                        <ItemSlide key={t.id} $widthPx={itemWidth}>
                                            <ItemCard>
                                                {(() => {
                                                    return (
                                                        <CardGrid>
                                                            <LeftPanel>
                                                                <div style={{ width: "100%" }}>
                                                                    <PhotoBox>
                                                                        {photo ? (
                                                                            <Image
                                                                                src={photo}
                                                                                alt={`Photo de ${t.author}`}
                                                                                fill
                                                                                style={{
                                                                                    objectFit:
                                                                                        "cover",
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <span>Photo ici</span>
                                                                        )}
                                                                    </PhotoBox>
                                                                </div>
                                                                <Author
                                                                    style={{
                                                                        marginTop: 8,
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {t.author}
                                                                </Author>
                                                                <DateText
                                                                    style={{
                                                                        marginTop: 4,
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {formatted}
                                                                </DateText>
                                                            </LeftPanel>
                                                            <RightPanelBox>
                                                                <RightContent>
                                                                    <Muted style={{ marginTop: 0 }}>
                                                                        {t.message}
                                                                    </Muted>
                                                                </RightContent>
                                                            </RightPanelBox>
                                                        </CardGrid>
                                                    );
                                                })()}
                                            </ItemCard>
                                        </ItemSlide>
                                    );
                                })}
                            </Track>
                        )}
                        {items.length > 0 && itemWidth <= 0 && (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                                    gap: GAP,
                                }}
                            >
                                {items.slice(0, visibleCount).map((t) => {
                                    const date = new Date(t.createdAt);
                                    const formatted = isNaN(date.getTime())
                                        ? t.createdAt
                                        : date.toLocaleDateString("fr-FR", {
                                              year: "numeric",
                                              month: "short",
                                              day: "2-digit",
                                          });
                                    const photo = t.photo ?? t.imageUrl ?? null;
                                    return (
                                        <div key={t.id}>
                                            <ItemCard>
                                                {(() => {
                                                    return (
                                                        <CardGrid>
                                                            <LeftPanel>
                                                                <div style={{ width: "100%" }}>
                                                                    <PhotoBox>
                                                                        {photo ? (
                                                                            <Image
                                                                                src={photo}
                                                                                alt={`Photo de ${t.author}`}
                                                                                fill
                                                                                style={{
                                                                                    objectFit:
                                                                                        "cover",
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <span>Photo ici</span>
                                                                        )}
                                                                    </PhotoBox>
                                                                </div>
                                                                <Author
                                                                    style={{
                                                                        marginTop: 8,
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {t.author}
                                                                </Author>
                                                                <DateText
                                                                    style={{
                                                                        marginTop: 4,
                                                                        textAlign: "center",
                                                                    }}
                                                                >
                                                                    {formatted}
                                                                </DateText>
                                                            </LeftPanel>
                                                            <RightPanelBox>
                                                                <RightContent>
                                                                    <Muted style={{ marginTop: 0 }}>
                                                                        {t.message}
                                                                    </Muted>
                                                                </RightContent>
                                                            </RightPanelBox>
                                                        </CardGrid>
                                                    );
                                                })()}
                                            </ItemCard>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Viewport>
                    <ArrowBtn aria-label="Suivant" onClick={goNext} disabled={!canNext}>
                        ▶
                    </ArrowBtn>
                </CarouselRow>
            )}
        </Wrapper>
    );
}
