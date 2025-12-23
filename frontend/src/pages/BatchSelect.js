import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BatchSelect() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Get professor info from state or localStorage
  const [professor, setProfessor] = useState({
    prof_id: location.state?.prof_id || localStorage.getItem("prof_id") || "",
    name: location.state?.name || localStorage.getItem("prof_name") || "",
  });

  const [batches, setBatches] = useState([]);

  // 🔒 Protect route and initialize batches
  useEffect(() => {
    if (!professor.prof_id) {
      navigate("/professor");
      return;
    }

    localStorage.setItem("prof_id", professor.prof_id);
    localStorage.setItem("prof_name", professor.name);

    // Example batches, can fetch from backend if needed
    setBatches([22, 23, 24, 25]);
  }, [professor, navigate]);

  const handleBatchClick = (batch_id) => {
    navigate("/course", { state: { prof_id: professor.prof_id, batch_id } });
  };

  const handleLogout = () => {
    localStorage.removeItem("prof_id");
    localStorage.removeItem("prof_name");
    navigate("/professor");
  };

  const handleHome = () => {
    navigate("/"); // Home page route
  };

  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "80px",
          minHeight: "100vh",
          backgroundColor: "#1a237e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          gap: "30px",
        }}
      >
        {/* Home Button */}
        <div
          onClick={handleHome}
          style={{
            color: "white",
            fontSize: "32px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          title="Home"
        >
          🏠
          <span style={{ fontSize: "12px", marginTop: "4px" }}>Home</span>
        </div>

        {/* Logout Button */}
        <div
          onClick={handleLogout}
          style={{
            color: "white",
            fontSize: "32px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          title="Logout"
        >
          ⎋
          <span style={{ fontSize: "12px", marginTop: "4px" }}>Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, textAlign: "center", marginTop: "50px", padding: "0 20px" }}>
        {/* Professor Info */}
        <div style={{ marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "52px",
              margin: "0 0 10px 0",
              fontWeight: "700",
              color: "#1a237e",
            }}
          >
            {professor.name}
          </h1>
          <h3
            style={{
              fontSize: "30px",
              margin: "0",
              fontWeight: "500",
              color: "#3f51b5",
            }}
          >
            Professor ID: {professor.prof_id}
          </h3>
        </div>

        <h2 style={{ fontSize: "38px", marginBottom: "40px", color: "#333" }}>
          Select Batch
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {batches.map((batch) => (
            <button
              key={batch}
              style={batchButtonStyle}
              onClick={() => handleBatchClick(batch)}
            >
              Batch {batch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Batch Button Style ----------
const batchButtonStyle = {
  padding: "20px 70px",
  fontSize: "22px",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
  transition: "all 0.2s ease",
};
