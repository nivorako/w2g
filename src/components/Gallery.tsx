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

const Rows = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Row = styled.div<{ cols: "1-2" | "2-1" }>`
    display: grid;
    gap: 12px;
    grid-template-columns: ${({ cols }) => (cols === "1-2" ? "1fr 2fr" : "2fr 1fr")};
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
    // If no items provided, default to the four kizomba images in public/
    const data: GalleryItem[] = items.length
        ? items
        : [
              { id: "1", src: "/kizomba1.jpg", alt: "Kizomba 1" },
              { id: "2", src: "/kizomba2.jpg", alt: "Kizomba 2" },
              { id: "3", src: "/kizomba3.jpg", alt: "Kizomba 3" },
              { id: "4", src: "/kizomba4.jpg", alt: "Kizomba 4" },
          ];

    return (
        <Wrapper>
            <SectionTitle>Galerie</SectionTitle>
            <Rows>
                <Row cols="1-2">
                    {(data[0] ? [data[0]] : []).map((it) => (
                        it.src ? (
                            <div key={it.id} style={{ position: "relative", height: 180 }}>
                                <Image src={it.src} alt={it.alt ?? ""} fill style={{ objectFit: "cover", borderRadius: 10 }} />
                            </div>
                        ) : (
                            <Placeholder key={it.id} />
                        )
                    ))}
                    {(data[1] ? [data[1]] : []).map((it) => (
                        it.src ? (
                            <div key={it.id} style={{ position: "relative", height: 180 }}>
                                <Image src={it.src} alt={it.alt ?? ""} fill style={{ objectFit: "cover", borderRadius: 10 }} />
                            </div>
                        ) : (
                            <Placeholder key={it.id} />
                        )
                    ))}
                </Row>
                <Row cols="2-1">
                    {(data[2] ? [data[2]] : []).map((it) => (
                        it.src ? (
                            <div key={it.id} style={{ position: "relative", height: 180 }}>
                                <Image src={it.src} alt={it.alt ?? ""} fill style={{ objectFit: "cover", borderRadius: 10 }} />
                            </div>
                        ) : (
                            <Placeholder key={it.id} />
                        )
                    ))}
                    {(data[3] ? [data[3]] : []).map((it) => (
                        it.src ? (
                            <div key={it.id} style={{ position: "relative", height: 180 }}>
                                <Image src={it.src} alt={it.alt ?? ""} fill style={{ objectFit: "cover", borderRadius: 10 }} />
                            </div>
                        ) : (
                            <Placeholder key={it.id} />
                        )
                    ))}
                </Row>
            </Rows>
        </Wrapper>
    );
}
