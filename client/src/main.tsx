import { createRoot } from "react-dom/client";

// Create simple element without any imports or dependencies
const SimpleApp = () => {
  return (
    <div style={{ 
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#333" }}>Minimal Test Page</h1>
      <p>If you can see this, React is rendering correctly!</p>
    </div>
  );
};

// Render directly without importing App
createRoot(document.getElementById("root")!).render(
  <SimpleApp />
);
