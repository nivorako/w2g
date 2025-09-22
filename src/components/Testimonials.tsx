"use client";

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

export default function Testimonials() {
    return (
        <Wrapper>
            <SectionTitle>Témoignages</SectionTitle>
            <TwoCol>
                <ItemCard>
                    <strong>Julie</strong>
                    <Muted>On urol woi... Le bièn bien et travaillnsa</Muted>
                </ItemCard>
                <ItemCard>
                    <strong>David</strong>
                    <Muted>Je resonne strsiac! Salsa</Muted>
                </ItemCard>
                <ItemCard>
                    <strong>Sasia</strong>
                    <Muted>—</Muted>
                </ItemCard>
                <ItemCard>
                    <strong>Sophie</strong>
                    <Muted>Me refereus une vendne — Dance</Muted>
                </ItemCard>
            </TwoCol>
        </Wrapper>
    );
}
