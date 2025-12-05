import React from "react";

const Dashboard = ({ prof, onLogout }) => {
  const batches = ["Batch 21", "Batch 23", "Batch 24", "Batch 25"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* Logout Icon at Top-Right */}
      <button
        onClick={onLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "18px",
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "none",
          color: "#007bff",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
        title="Logout"
      >
        ⎋
      </button>

      {/* Professor Name and ID */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h2 style={{ fontSize: "26px", margin: "5px 0", color: "#222" }}>
          {prof.name}
        </h2>
        <p style={{ fontSize: "16px", margin: "0", color: "#555" }}>
          ID: {prof.id}
        </p>
      </div>

      {/* Batch Buttons Centered */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {batches.map((batch) => (
          <button
            key={batch}
            style={{
              padding: "12px 40px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
            onClick={() => alert(`You clicked ${batch}`)}
          >
            {batch}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
