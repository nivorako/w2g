"use client";

import styled from "styled-components";
import Image from "next/image";

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
    text-align: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Placeholder = styled.div`
    background: #ead8c7;
    height: 120px;
    border-radius: 10px;
`;

export type GalleryItem = {
    id: string;
    src?: string; // optional path under public/
    alt?: string;
};

export default function Gallery({ items = [] as GalleryItem[] }) {
    const data = items.length ? items : [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

    return (
        <Wrapper>
            <SectionTitle>Galerie</SectionTitle>
            <Grid>
                {data.map((it) =>
                    it.src ? (
                        <div key={it.id} style={{ position: "relative", height: 120 }}>
                            <Image
                                src={it.src}
                                alt={it.alt ?? ""}
                                fill
                                style={{ objectFit: "cover", borderRadius: 10 }}
                            />
                        </div>
                    ) : (
                        <Placeholder key={it.id} />
                    ),
                )}
            </Grid>
        </Wrapper>
    );
}
