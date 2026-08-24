export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading"
      style={{
        background: "#0D0D0D",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2.5px solid rgba(249,115,22,0.18)",
            borderTopColor: "#F97316",
            animation: "hubss-spin 700ms linear infinite",
          }}
        />
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#868C98",
            margin: 0,
          }}
        >
          Loading
        </p>
      </div>
      <style>{`@keyframes hubss-spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
