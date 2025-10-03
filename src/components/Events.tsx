"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "@/components/Button";

export type EventItem = {
    id: string;
    date: string;
    city: string;
    style: string;
    level: string;
    address?: string;
    time?: string;
};

const Wrapper = styled.section`
    background: var(--paper, #f3e7d9);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 1rem 2rem ;
    /* Allow grid item to shrink so it doesn't force page-wide overflow */
    min-width: 0;
`;

const SectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary, #cf3201);
    margin-bottom: 0.6rem; 
    text-align: center;
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 0.95rem;
    td,
    th {
        padding: 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    th {
        text-align: left;
        color: var(--primary, #cf3201);
        font-weight: 700;
    }
    td,
    th {
        word-wrap: break-word;
        overflow-wrap: anywhere;
    }
`;

// const EventsBTN = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     margin-top: 1rem;
// `;

// Modal styles
const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 1000;
`;

const ModalCard = styled.div`
    width: min(620px, 100%);
    background: #ffffff; /* white background, no motifs */
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.08);
    padding: 1.25rem 1.25rem 1.5rem;
    position: relative;
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #888;
    &:hover { color: #333; }
`;

const FlyerTitle = styled.h3`
    text-align: center;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--primary, #cf3201);
    letter-spacing: 0.5px;
`;

const FlyerMeta = styled.div`
    margin-top: 0.75rem;
    display: grid;
    row-gap: 0.25rem;
    justify-items: center;
    color: #333;
`;

const FlyerSeparator = styled.hr`
    margin: 0.9rem 0 0.8rem;
    border: none;
    border-top: 1px dashed rgba(0, 0, 0, 0.15);
`;

const FlyerDetails = styled.ul`
    list-style: none;
    display: grid;
    row-gap: 0.35rem;
    justify-items: center;
    color: #444;
`;

export default function Events({ items }: { items?: EventItem[] }) {
    const data: EventItem[] = items ?? [
        { id: "1", date: "12 mai", city: "Lyon", style: "Salsa", level: "Débutant", address: "espace Dance 13 rue Gl leclerc 69 lyon" },
        { id: "2", date: "22 mai", city: "Bordeaux", style: "Zouk", level: "Inter", address: "Esplanade de Danse 3 rue des Abbesses 33000 Bordeaux" },
        { id: "3", date: "5 juin", city: "Marseille", style: "Mix", level: "Tous niveaux", address: "Place de la Danse 13 rue des Abbesses 13000 Marseille" },
    ];

    const [selected, setSelected] = useState<EventItem | null>(null);

    // Close on ESC
    useEffect(() => {
        if (!selected) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);

    return (
        <Wrapper>
            <SectionTitle>Événements à venir</SectionTitle>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Ville</th>
                           
                            
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e) => (
                            <tr key={e.id}>
                                <td>{e.date}</td>
                                <td>{e.city}</td>
                               
                                
                                <td style={{ textAlign: "center" }}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSelected(e)}
                                    >
                                        Détails
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
            {/* <EventsBTN>
                <Button size="sm" variant="primary">
                    Voir tous les évènements
                </Button>
            </EventsBTN> */}

            {selected && (
                <Backdrop onClick={() => setSelected(null)} role="dialog" aria-modal="true">
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <CloseBtn aria-label="Fermer" onClick={() => setSelected(null)}>
                            ×
                        </CloseBtn>
                        <FlyerTitle>WEARE TOGETHER</FlyerTitle>
                        <FlyerMeta>
                            <div><strong>Date:</strong> {selected.date}</div>
                            {selected.time && <div><strong>Heure:</strong> {selected.time}</div>}
                            <div><strong>Ville:</strong> {selected.city}</div>
                            {selected.address && <div><strong>Adresse:</strong> {selected.address}</div>}
                            <div><strong>Style:</strong> {selected.style}</div>
                            <div><strong>Niveau:</strong> {selected.level}</div>
                        </FlyerMeta>
                        <FlyerSeparator />
                        <FlyerDetails>
                            <li>Entrée libre</li>
                            <li>Musique • Danse • Rencontres</li>
                        </FlyerDetails>
                        <FlyerSeparator />
                        <div style={{ textAlign: "center", marginTop: "0.5rem", color: "#666", fontSize: "0.9rem" }}>
                            Plus d&#39;infos prochainement. RSVP sur le site.
                        </div>
                    </ModalCard>
                </Backdrop>
            )}
        </Wrapper>
    );
}

