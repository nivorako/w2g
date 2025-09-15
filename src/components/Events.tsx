"use client";

import styled from "styled-components";
import Button from "@/components/Button";

export type EventItem = {
    id: string;
    date: string;
    city: string;
    style: string;
    level: string;
};

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

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    td, th { padding: 8px; border-bottom: 1px solid rgba(0,0,0,0.06); }
    th { text-align: left; color: var(--primary, #cf3201); font-weight: 700; }
`;

export default function Events({ items }: { items?: EventItem[] }) {
    const data: EventItem[] = items ?? [
        { id: "1", date: "12 mai", city: "Lyon", style: "Salsa", level: "Débutant" },
        { id: "2", date: "22 mai", city: "Bordeaux", style: "Zouk", level: "Inter" },
        { id: "3", date: "5 juin", city: "Marseille", style: "Mix", level: "Tous niveaux" },
    ];

    return (
        <Wrapper>
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
                    {data.map((e) => (
                        <tr key={e.id}>
                            <td>{e.date}</td>
                            <td>{e.city}</td>
                            <td>{e.style}</td>
                            <td>{e.level}</td>
                            <td><Button size="sm" variant="outline">Détails</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={{ marginTop: 10 }}>
                <Button size="sm" variant="primary">Voir tous les évènements</Button>
            </div>
        </Wrapper>
    );
}
