import React, { useState } from "react";

function LandingPage({ onNavigate }) {
  const [landSize, setLandSize] = useState(2);
  const [cropType, setCropType] = useState("wheat");

  // Simple calculation logic for public preview simulation
  const yieldsMap = { wheat: 18, rice: 22, soybean: 15, corn: 25 };
  const estimatedYield = landSize * (yieldsMap[cropType] || 20);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80") center/cover',
          color: "#fff",
          borderRadius: "12px",
          padding: "70px 40px",
          marginBottom: "40px",
        }}
      >
        <div className="hero-content">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>
            Digital Intelligence for Modern Agriculture
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              maxWidth: "650px",
              marginBottom: "25px",
              lineHeight: "1.6",
            }}
          >
            Empowering farmers and agricultural merchants with data-driven
            insights, live meteorological tracking, and secure direct-to-market
            trading.
          </p>
          <div
            className="hero-buttons"
            style={{ display: "flex", gap: "15px" }}
          >
            <button
              className="btn-hero-primary"
              onClick={() => onNavigate("userLogin")}
              style={{
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Get Started Now
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => onNavigate("features")}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "1px solid #fff",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* About Us / Mission & Vision Cards */}
      <div style={{ marginBottom: "50px" }}>
        <h2
          style={{ textAlign: "center", color: "#2e7d32", marginBottom: "8px" }}
        >
          ABOUT US
        </h2>
        <h3
          style={{
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "30px",
          }}
        >
          Welcome to AgriTech Platform
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f9fbe7",
              padding: "20px",
              borderRadius: "8px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <h4 style={{ color: "#2e7d32", marginTop: 0 }}>🌱 Our Mission</h4>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", margin: 0 }}>
              To enhance agricultural productivity and sustainability through
              cutting-edge technology and data-driven solutions.
            </p>
          </div>
          <div
            style={{
              background: "#f9fbe7",
              padding: "20px",
              borderRadius: "8px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <h4 style={{ color: "#2e7d32", marginTop: 0 }}>🔭 Our Vision</h4>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", margin: 0 }}>
              To be a global leader in providing innovative digital farming
              ecosystems that empower growers to thrive.
            </p>
          </div>
          <div
            style={{
              background: "#f9fbe7",
              padding: "20px",
              borderRadius: "8px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <h4 style={{ color: "#2e7d32", marginTop: 0 }}>💡 Our Values</h4>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", margin: 0 }}>
              Committed to innovation, transparency, and building sustainable
              solutions for farmers, consumers, and the environment.
            </p>
          </div>
          <div
            style={{
              background: "#f9fbe7",
              padding: "20px",
              borderRadius: "8px",
              borderLeft: "4px solid #2e7d32",
            }}
          >
            <h4 style={{ color: "#2e7d32", marginTop: 0 }}>📈 Our Impact</h4>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", margin: 0 }}>
              Optimizing crop yields, reducing chemical resource usage, and
              streamlining fair market pricing for local trade.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "15px",
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ color: "#2e7d32", margin: "0 0 4px" }}>10K+</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>
              Farmers Empowered
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ color: "#2e7d32", margin: "0 0 4px" }}>30%</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>
              Yield Improvement
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ color: "#2e7d32", margin: "0 0 4px" }}>50%</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>
              Water Savings
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              borderRadius: "8px",
            }}
          >
            <h2 style={{ color: "#2e7d32", margin: "0 0 4px" }}>100+</h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "0.85rem" }}>
              Innovations
            </p>
          </div>
        </div>
      </div>

      {/* UNIQUE INTERACTIVE PUBLIC PREVIEW SECTION (Replaces Weather & Marketplace) */}
      <div
        className="grid-2col"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
          marginBottom: "40px",
        }}
      >
        {/* Card 1: Interactive Crop Yield Estimator Simulator */}
        <div
          className="card-panel"
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            className="section-title"
            style={{
              color: "#2e7d32",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🧮 Interactive Yield Estimator
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            Test out our smart prediction model. Select your land size and crop
            type to calculate projected seasonal output instantly!
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: "5px",
                }}
              >
                Land Size (Acres): {landSize}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={landSize}
                onChange={(e) => setLandSize(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#2e7d32",
                  cursor: "pointer",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "#374151",
                  marginBottom: "5px",
                }}
              >
                Select Crop Variety:
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                }}
              >
                <option value="wheat">Organic Wheat</option>
                <option value="rice">Basmati Rice</option>
                <option value="soybean">Soybean</option>
                <option value="corn">Sweet Corn</option>
              </select>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                marginTop: "5px",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#166534",
                  display: "block",
                }}
              >
                Estimated Seasonal Harvest Output
              </span>
              <strong style={{ fontSize: "1.5rem", color: "#15803d" }}>
                ~{estimatedYield} Quintals
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Platform Capability Quick Tour */}
        <div
          className="card-panel"
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            className="section-title"
            style={{
              color: "#2e7d32",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🚀 Why Choose AgriTech?
          </h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            Designed for modern farmers, agricultural cooperatives, and
            administrators. Here is a snapshot of our core modules:
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #f3f4f6",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🌤️</span>
              <div>
                <h4
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.95rem",
                    color: "#1f2937",
                  }}
                >
                  Real-Time Meteorology
                </h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                  Track live hyper-local weather alerts, humidity, and rainfall
                  indices.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #f3f4f6",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🛡️</span>
              <div>
                <h4
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.95rem",
                    color: "#1f2937",
                  }}
                >
                  Soil & Pest Diagnosis
                </h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                  Identify nutrient deficiencies and treat crop infections
                  quickly.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #f3f4f6",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🔒</span>
              <div>
                <h4
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.95rem",
                    color: "#1f2937",
                  }}
                >
                  Secure Role Authentication
                </h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                  Dedicated token-encrypted portals for farmers and system
                  administrators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ marginTop: "50px", marginBottom: "40px" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "25px",
          }}
        >
          What Our Clients Say
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: "#4b5563",
                margin: "0 0 10px",
              }}
            >
              "AgriTech's solutions have transformed our farming operations.
              We're seeing higher yields and better efficiency."
            </p>
            <strong>— John Doe</strong>
          </div>
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: "#4b5563",
                margin: "0 0 10px",
              }}
            >
              "The precision farming tools provided by AgriTech are top-notch.
              We can now manage our fields more effectively."
            </p>
            <strong>— Jane Smith</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
