export default function Loading() {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            color: "#cf3201",
            zIndex: 9999,
        }}>
            <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "4px solid #ffe0d6",
                borderTopColor: "#cf3201",
                animation: "spin 0.9s linear infinite",
            }} />
            <p style={{ marginTop: 16, fontWeight: 600 }}>Chargement…</p>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
