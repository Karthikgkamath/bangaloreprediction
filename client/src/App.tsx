// Super simple app component with no dependencies
function App() {
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
}

export default App;
