"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.section`
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

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
`;

const CountBadge = styled.span`
    background: rgba(0, 0, 0, 0.08);
    color: var(--ink, #5a3a2a);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 0.9rem;
`;

const TwoCol = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const ItemCard = styled.div`
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 0.75rem;
    color: var(--ink, #5a3a2a);
`;

const Muted = styled.p`
    color: #6b5b53;
`;

type Testimonial = {
    id: string;
    author: string;
    message: string;
    createdAt: string; // ISO
    senderId?: string | null;
};

export default function Testimonials() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                <TwoCol>
                    {items.map((t) => {
                        const date = new Date(t.createdAt);
                        const formatted = isNaN(date.getTime())
                            ? t.createdAt
                            : date.toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                              });
                        return (
                            <ItemCard key={t.id}>
                                <strong>
                                    {t.author}

                                    <span style={{ color: "#6b5b53", fontWeight: 500 }}>
                                        {" "}
                                        • {formatted}
                                    </span>
                                </strong>
                                <Muted>{t.message}</Muted>
                            </ItemCard>
                        );
                    })}
                    {items.length === 0 && <Muted>Aucun témoignage pour l’instant.</Muted>}
                </TwoCol>
            )}
        </Wrapper>
    );
}
