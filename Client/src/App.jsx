import React, { useState, useEffect } from "react";
import WeatherForecast from "./components/WeatherForecast";
import Auth from "./components/Auth";
import SoilAndPest from "./components/SoilAndPest";
import ResourceOrders from "./components/ResourceOrders";
import ExpertAndForum from "./components/ExpertAndForum";
import LandingPage from "./components/LandingPage";
import Products from "./components/Products";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [crops, setCrops] = useState(() => {
    const savedDeletedIds = JSON.parse(
      localStorage.getItem("deleted_product_ids") || "[]",
    );
    const savedCrops = localStorage.getItem("local_crops");

    const defaultCrops = [
      {
        _id: "1",
        id: "1",
        cropName: "Organic Wheat",
        category: "Vegetables",
        price: "40/kg",
        description: "Grown healthily and organically.",
        imageURL:
          "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
      },
      {
        _id: "2",
        id: "2",
        cropName: "Rice",
        category: "Vegetables",
        price: "20/kg",
        description: "Grown healthily and organically.",
        imageURL:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      },
      {
        _id: "3",
        id: "3",
        cropName: "Soya Been",
        category: "Vegetables",
        price: "80/kg",
        description: "Grown healthily and organically.",
        imageURL:
          "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
      },
    ];

    let initialList = savedCrops ? JSON.parse(savedCrops) : defaultCrops;

    defaultCrops.forEach((def) => {
      if (
        !initialList.some(
          (item) => String(item._id || item.id) === String(def._id),
        )
      ) {
        initialList.unshift(def);
      }
    });

    return initialList.filter(
      (item) => !savedDeletedIds.includes(String(item._id || item.id)),
    );
  });

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("local_bookings");
    return savedBookings ? JSON.parse(savedBookings) : [];
  });

  const [user, setUser] = useState(null);

  const [systemUsers, setSystemUsers] = useState(() => {
    const savedUsers = localStorage.getItem("local_system_users");
    let usersList = savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            id: 1,
            name: "Prashant Vishwakarma",
            email: "prashantvishwakarma3211@gmail.com",
            role: "admin",
          },
          {
            id: 2,
            name: "Ramesh Patel",
            email: "ramesh.farmer@agritech.com",
            role: "user",
          },
          {
            id: 3,
            name: "Suresh Mukati",
            email: "suresh.farmer@agritech.com",
            role: "user",
          },
        ];

    const uniqueMap = new Map();
    usersList.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
    return Array.from(uniqueMap.values());
  });

  const [adminProfileForm, setAdminProfileForm] = useState({
    name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState({
    cropName: "",
    category: "",
    price: "",
    description: "",
    imageURL: "",
  });

  useEffect(() => {
    localStorage.setItem("local_crops", JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem("local_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("local_system_users", JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    if (activeTab === "adminUsers") {
      const savedUsers = localStorage.getItem("local_system_users");
      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);
          const uniqueMap = new Map();
          parsed.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
          setSystemUsers(Array.from(uniqueMap.values()));
        } catch (e) {
          console.error("Failed syncing users", e);
        }
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === "admin") {
        setActiveTab("adminDashboard");
        setAdminProfileForm({
          name: parsedUser.name || "Prashant Vishwakarma",
          email: parsedUser.email || "prashantvishwakarma3211@gmail.com",
        });
        setSystemUsers((prev) => {
          const nonAdmins = prev.filter((u) => u.role !== "admin");
          const updated = [
            {
              id: 1,
              name: parsedUser.name || "Prashant Vishwakarma",
              email: parsedUser.email || "prashantvishwakarma3211@gmail.com",
              role: "admin",
            },
            ...nonAdmins,
          ];
          const uniqueMap = new Map();
          updated.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
          return Array.from(uniqueMap.values());
        });
      } else {
        setActiveTab("home");
      }
    } else {
      setActiveTab("home");
    }

    fetch("http://localhost:8000/api/crops")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const savedDeletedIds = JSON.parse(
            localStorage.getItem("deleted_product_ids") || "[]",
          );
          const existingLocal = JSON.parse(
            localStorage.getItem("local_crops") || "[]",
          );
          const merged = [...data];

          existingLocal.forEach((localItem) => {
            const exists = merged.some(
              (m) =>
                String(m._id || m.id) === String(localItem._id || localItem.id),
            );
            if (!exists) {
              merged.push(localItem);
            }
          });

          const filteredMerged = merged.filter(
            (item) => !savedDeletedIds.includes(String(item._id || item.id)),
          );
          setCrops(filteredMerged);
        }
      })
      .catch(() =>
        console.log("Backend offline, using local storage product list."),
      );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setActiveTab("home");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: adminProfileForm.name,
      email: adminProfileForm.email,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const existingCreds = JSON.parse(
      localStorage.getItem("adminCredentials") || "{}",
    );
    localStorage.setItem(
      "adminCredentials",
      JSON.stringify({
        ...existingCreds,
        email: adminProfileForm.email,
        name: adminProfileForm.name,
      }),
    );

    setSystemUsers((prev) => {
      const nonAdmins = prev.filter((u) => u.role !== "admin");
      const updated = [
        {
          id: 1,
          name: adminProfileForm.name,
          email: adminProfileForm.email,
          role: "admin",
        },
        ...nonAdmins,
      ];
      const uniqueMap = new Map();
      updated.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
      return Array.from(uniqueMap.values());
    });

    alert("Admin profile updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    const existingCreds = JSON.parse(
      localStorage.getItem("adminCredentials") || "{}",
    );
    localStorage.setItem(
      "adminCredentials",
      JSON.stringify({ ...existingCreds, password: passwordForm.newPassword }),
    );
    alert("Password updated successfully!");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uniqueId = "prod_" + Date.now();
    const newProduct = {
      _id: uniqueId,
      id: uniqueId,
      cropName: formData.cropName,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      imageURL:
        formData.imageURL ||
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
    };

    try {
      const response = await fetch("http://localhost:8000/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.crop) {
        if (data.crop._id) newProduct._id = data.crop._id;
      }
    } catch (error) {
      console.log("Backend POST bypassed, product stored locally.");
    }

    const updatedCrops = [...crops, newProduct];
    setCrops(updatedCrops);
    localStorage.setItem("local_crops", JSON.stringify(updatedCrops));

    setFormData({
      cropName: "",
      category: "",
      price: "",
      description: "",
      imageURL: "",
    });
    alert("Product added successfully!");
    setActiveTab("products");
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await fetch(`http://localhost:8000/api/crops/${productId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("Backend DELETE bypassed, removing product locally.");
    }

    const deletedIds = JSON.parse(
      localStorage.getItem("deleted_product_ids") || "[]",
    );
    if (!deletedIds.includes(String(productId))) {
      deletedIds.push(String(productId));
      localStorage.setItem("deleted_product_ids", JSON.stringify(deletedIds));
    }

    const updatedCrops = crops.filter(
      (c) => String(c._id || c.id) !== String(productId),
    );

    setCrops(updatedCrops);
    localStorage.setItem("local_crops", JSON.stringify(updatedCrops));
    alert("Product deleted successfully!");
  };

  const handleBookProduct = (newBooking) => {
    const userBooking = {
      ...newBooking,
      userEmail: user?.email || newBooking.userEmail,
    };
    setBookings([userBooking, ...bookings]);
  };

  const farmerUsersList = systemUsers.filter((u) => u.role !== "admin");
  const adminUsersList = systemUsers.filter((u) => u.role === "admin");

  return (
    <div className="app-wrapper">
      <nav className="top-navbar">
        <div
          className="nav-logo"
          onClick={() => setActiveTab("home")}
          style={{ cursor: "pointer" }}
        >
          <span className="nav-logo-icon">🌱</span>
          <span>AgriTech</span>
        </div>

        <div className="nav-tabs">
          {!user && (
            <>
              <button
                className={`nav-tab-btn ${activeTab === "home" ? "active" : ""}`}
                onClick={() => setActiveTab("home")}
              >
                Home
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "features" ? "active" : ""}`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "weather" ? "active" : ""}`}
                onClick={() => setActiveTab("weather")}
              >
                Weather Forecast
              </button>
            </>
          )}

          {user && user.role !== "admin" && (
            <>
              <button
                className={`nav-tab-btn ${activeTab === "home" ? "active" : ""}`}
                onClick={() => setActiveTab("home")}
              >
                Home
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "features" ? "active" : ""}`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "myBookings" ? "active" : ""}`}
                onClick={() => setActiveTab("myBookings")}
              >
                My Bookings (
                {bookings.filter((b) => b.userEmail === user?.email).length})
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "weather" ? "active" : ""}`}
                onClick={() => setActiveTab("weather")}
              >
                Weather Forecast
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "soilPest" ? "active" : ""}`}
                onClick={() => setActiveTab("soilPest")}
              >
                Soil & Pest
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <button
                className={`nav-tab-btn ${activeTab === "adminDashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("adminDashboard")}
              >
                Dashboard
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "adminUsers" ? "active" : ""}`}
                onClick={() => setActiveTab("adminUsers")}
              >
                Users Management
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "adminBookings" ? "active" : ""}`}
                onClick={() => setActiveTab("adminBookings")}
              >
                Bookings ({bookings.length})
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "adminProfile" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("adminProfile");
                  setAdminProfileForm({
                    name: user.name || "",
                    email: user.email || "",
                  });
                }}
              >
                Admin Profile
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
              <button
                className={`nav-tab-btn ${activeTab === "addProduct" ? "active" : ""}`}
                onClick={() => setActiveTab("addProduct")}
              >
                Add Product
              </button>
            </>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <div
              className="user-pill"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {user.name || user.email}
              </span>
              <span className={`role-tag ${user.role}`}>{user.role}</span>
              <button
                onClick={handleLogout}
                className="btn-logout-sm"
                style={{ cursor: "pointer" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setActiveTab("userLogin")}
                className={`nav-tab-btn ${activeTab === "userLogin" ? "active" : ""}`}
                style={{
                  background: "#2e7d32",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                User Login
              </button>
              <button
                onClick={() => setActiveTab("adminLogin")}
                className={`nav-tab-btn ${activeTab === "adminLogin" ? "active" : ""}`}
                style={{
                  background: "#1b4d2e",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Admin Login
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="main-container">
        {activeTab === "home" && (
          <LandingPage onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === "features" && (
          <div className="card-panel">
            <h2
              style={{
                color: "#2e7d32",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Our Platform Features
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
                <h3 style={{ color: "#2e7d32", marginTop: 0 }}>
                  🌾 Crop Management
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Real-time monitoring of crop health to detect diseases and
                  pests early.
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
                <h3 style={{ color: "#2e7d32", marginTop: 0 }}>
                  🚜 Farm Management
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Complete farm land profiling where users can manage crop
                  schedules.
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
                <h3 style={{ color: "#2e7d32", marginTop: 0 }}>
                  🌤️ Weather Monitoring
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Live meteorological station updates and forecasts.
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
                <h3 style={{ color: "#2e7d32", marginTop: 0 }}>
                  🛒 Marketplace & Orders
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
                  Seamless purchasing of seeds, fertilizers, and pesticides.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "weather" && (
          <div
            className="card-panel"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <h3 className="section-title">
              ⛅ AgriTech Meteorological Forecast Station
            </h3>
            <WeatherForecast />
          </div>
        )}

        {activeTab === "userLogin" && (
          <Auth
            defaultRole="user"
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setSystemUsers((prev) => {
                const exists = prev.some(
                  (u) =>
                    u.email.toLowerCase() === loggedInUser.email.toLowerCase(),
                );
                let updated = [...prev];
                if (!exists) {
                  updated.push({
                    id: Date.now(),
                    name: loggedInUser.name || loggedInUser.email.split("@")[0],
                    email: loggedInUser.email,
                    role: loggedInUser.role || "user",
                  });
                }
                const uniqueMap = new Map();
                updated.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
                const finalUniqueList = Array.from(uniqueMap.values());

                localStorage.setItem(
                  "local_system_users",
                  JSON.stringify(finalUniqueList),
                );
                return finalUniqueList;
              });

              alert("Login successful!");
              setActiveTab("products");
            }}
          />
        )}

        {activeTab === "adminLogin" && (
          <Auth
            defaultRole="admin"
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setSystemUsers((prev) => {
                const nonAdmins = prev.filter((u) => u.role !== "admin");
                const updated = [
                  {
                    id: Date.now(),
                    name: loggedInUser.name || "Administrator",
                    email: loggedInUser.email,
                    role: "admin",
                  },
                  ...nonAdmins,
                ];
                const uniqueMap = new Map();
                updated.forEach((u) => uniqueMap.set(u.email.toLowerCase(), u));
                return Array.from(uniqueMap.values());
              });
              setAdminProfileForm({
                name: loggedInUser.name || "Prashant Vishwakarma",
                email:
                  loggedInUser.email || "prashantvishwakarma3211@gmail.com",
              });
              alert("Admin login successful!");
              setActiveTab("adminDashboard");
            }}
          />
        )}

        {activeTab === "products" && (
          <Products
            products={crops}
            onBookProduct={handleBookProduct}
            onDeleteProduct={handleDeleteProduct}
            userRole={user?.role}
          />
        )}

        {user && activeTab === "myBookings" && (
          <div className="card-panel">
            <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>
              My Bookings
            </h2>
            {(() => {
              const userBookings = bookings.filter(
                (b) => b.userEmail === user.email,
              );

              if (userBookings.length === 0) {
                return (
                  <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                    No bookings made yet. Go to Products and click 'Buy Now'.
                  </p>
                );
              }

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {userBookings.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        padding: "14px",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: "0 0 4px", color: "#1f2937" }}>
                          {b.productName}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "#6b7280",
                          }}
                        >
                          Quantity: {b.quantity} | Date: {b.date}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong
                          style={{
                            color: "#2e7d32",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          ₹{b.amount}
                        </strong>
                        <span
                          style={{
                            background: "#e8f5e9",
                            color: "#2e7d32",
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {user && activeTab === "soilPest" && <SoilAndPest />}

        {user?.role === "admin" && activeTab === "adminDashboard" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "25px" }}
          >
            <div
              className="card-panel"
              style={{ borderLeft: "6px solid #2e7d32", padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h2
                    className="section-title"
                    style={{ color: "#2e7d32", margin: 0 }}
                  >
                    🛡️ Admin Dashboard Analytics
                  </h2>
                  <p
                    style={{
                      color: "#6b7280",
                      margin: "4px 0 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Logged in as <strong>{user.name || user.email}</strong>
                  </p>
                </div>
                <span
                  style={{
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#2e7d32",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  ></span>{" "}
                  System Online
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "16px",
                  marginTop: "15px",
                }}
              >
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "18px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    borderTop: "3px solid #2e7d32",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 6px",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                    }}
                  >
                    🧑‍🌾 Farmer Users
                  </h4>
                  <h2
                    style={{ margin: 0, color: "#2e7d32", fontSize: "1.8rem" }}
                  >
                    {farmerUsersList.length}
                  </h2>
                </div>
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "18px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    borderTop: "3px solid #1b4d2e",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 6px",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                    }}
                  >
                    🛡️ Administrators
                  </h4>
                  <h2
                    style={{ margin: 0, color: "#1b4d2e", fontSize: "1.8rem" }}
                  >
                    {adminUsersList.length}
                  </h2>
                </div>
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "18px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    borderTop: "3px solid #2563eb",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 6px",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                    }}
                  >
                    🛒 Total Products
                  </h4>
                  <h2
                    style={{ margin: 0, color: "#1f2937", fontSize: "1.8rem" }}
                  >
                    {crops.length}
                  </h2>
                </div>
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "18px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    borderTop: "3px solid #d97706",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 6px",
                      color: "#6b7280",
                      fontSize: "0.85rem",
                    }}
                  >
                    📦 Active Bookings
                  </h4>
                  <h2
                    style={{ margin: 0, color: "#1f2937", fontSize: "1.8rem" }}
                  >
                    {bookings.length}
                  </h2>
                </div>
              </div>
            </div>

            <div
              className="card-panel"
              style={{
                padding: "16px 24px",
                background: "linear-gradient(135deg, #1b4d2e, #2e7d32)",
                color: "#fff",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ fontSize: "1.8rem" }}>🌾</span>
                <div>
                  <h4
                    style={{ margin: 0, fontSize: "0.95rem", color: "#e8f5e9" }}
                  >
                    Live Mandi Commodity Ticker (MP Region)
                  </h4>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "0.8rem",
                      color: "#a5d6a7",
                    }}
                  >
                    Wheat: ₹2,450/qtl (↑ 1.2%) | Soybean: ₹4,820/qtl (↑ 0.8%) |
                    Gram: ₹5,300/qtl (→)
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  borderLeft: "1px solid rgba(255,255,255,0.2)",
                  paddingLeft: "20px",
                }}
              >
                <div>
                  <h4
                    style={{ margin: 0, fontSize: "0.95rem", color: "#e8f5e9" }}
                  >
                    🌡️ Indore Hub Weather
                  </h4>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "0.8rem",
                      color: "#a5d6a7",
                    }}
                  >
                    28°C • Partly Cloudy • Humidity 62%
                  </p>
                </div>
                <span
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                  }}
                >
                  LIVE FEED
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "20px",
              }}
            >
              <div className="card-panel" style={{ padding: "20px" }}>
                <h3
                  style={{
                    color: "#1f2937",
                    marginTop: 0,
                    fontSize: "1.05rem",
                  }}
                >
                  📊 Monthly Platform Revenue
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    height: "180px",
                    padding: "20px 10px 10px",
                    borderBottom: "2px solid #e5e7eb",
                    gap: "12px",
                  }}
                >
                  {[
                    { month: "May", height: "30%", val: "₹1,200" },
                    { month: "Jun", height: "45%", val: "₹2,400" },
                    { month: "Jul", height: "60%", val: "₹3,800" },
                    { month: "Aug", height: "40%", val: "₹2,100" },
                    { month: "Sep", height: "75%", val: "₹5,200" },
                    { month: "Oct", height: "90%", val: "₹7,650" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flex: 1,
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "#2e7d32",
                          fontWeight: "bold",
                          marginBottom: "4px",
                        }}
                      >
                        {item.val}
                      </span>
                      <div
                        style={{
                          width: "80%",
                          height: item.height,
                          background:
                            index === 5
                              ? "linear-gradient(180deg, #2e7d32, #1b4d2e)"
                              : "#c8e6c9",
                          borderRadius: "6px 6px 0 0",
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#4b5563",
                          marginTop: "8px",
                          fontWeight: "500",
                        }}
                      >
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-panel" style={{ padding: "20px" }}>
                <h3
                  style={{
                    color: "#1f2937",
                    marginTop: 0,
                    fontSize: "1.05rem",
                  }}
                >
                  🌾 Product Category Distribution
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Vegetables & Crops</span>
                      <strong>50%</strong>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#e5e7eb",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          height: "100%",
                          background: "#2e7d32",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Fresh Fruits</span>
                      <strong>25%</strong>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#e5e7eb",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "25%",
                          height: "100%",
                          background: "#16a34a",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Grains & Pulses</span>
                      <strong>15%</strong>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        background: "#e5e7eb",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "15%",
                          height: "100%",
                          background: "#d97706",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 DEDICATED ADMIN BOOKINGS TAB VIEW */}
        {user?.role === "admin" && activeTab === "adminBookings" && (
          <div className="card-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2
                className="section-title"
                style={{ color: "#2e7d32", margin: 0 }}
              >
                📦 All Platform Bookings & Orders
              </h2>
              <span
                style={{
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                Total Orders: {bookings.length}
              </span>
            </div>

            {bookings.length === 0 ? (
              <p
                style={{
                  color: "#6b7280",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No bookings have been placed on the platform yet.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f9fafb",
                        borderBottom: "2px solid #e5e7eb",
                        color: "#374151",
                      }}
                    >
                      <th style={{ padding: "12px" }}>Farmer / User Email</th>
                      <th style={{ padding: "12px" }}>Product Name</th>
                      <th style={{ padding: "12px" }}>Quantity</th>
                      <th style={{ padding: "12px" }}>Total Amount</th>
                      <th style={{ padding: "12px" }}>Booking Date</th>
                      <th style={{ padding: "12px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #e5e7eb" }}
                      >
                        <td
                          style={{
                            padding: "14px 12px",
                            color: "#1f2937",
                            fontWeight: "500",
                          }}
                        >
                          {b.userEmail || "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "14px 12px",
                            color: "#2e7d32",
                            fontWeight: "bold",
                          }}
                        >
                          {b.productName}
                        </td>
                        <td style={{ padding: "14px 12px", color: "#4b5563" }}>
                          {b.quantity} unit(s)
                        </td>
                        <td
                          style={{
                            padding: "14px 12px",
                            color: "#1f2937",
                            fontWeight: "bold",
                          }}
                        >
                          ₹{b.amount}
                        </td>
                        <td style={{ padding: "14px 12px", color: "#6b7280" }}>
                          {b.date}
                        </td>
                        <td style={{ padding: "14px 12px" }}>
                          <span
                            style={{
                              background: "#e8f5e9",
                              color: "#2e7d32",
                              padding: "4px 10px",
                              borderRadius: "10px",
                              fontSize: "0.78rem",
                              fontWeight: "bold",
                            }}
                          >
                            {b.status || "Confirmed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {user?.role === "admin" && activeTab === "adminUsers" && (
          <div className="card-panel">
            <h2
              className="section-title"
              style={{ color: "#2e7d32", marginBottom: "20px" }}
            >
              👥 System Accounts & Role Management
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
              }}
            >
              <div
                style={{
                  background: "#f9fafb",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ color: "#2e7d32", marginTop: 0 }}>
                  🧑‍🌾 Farmer / User Accounts ({farmerUsersList.length})
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  {farmerUsersList.map((fUser, idx) => (
                    <div
                      key={fUser.id || idx}
                      style={{
                        background: "#fff",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1f2937", display: "block" }}>
                          {fUser.name}
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          {fUser.email}
                        </span>
                      </div>
                      <span
                        style={{
                          background: "#e8f5e9",
                          color: "#2e7d32",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.78rem",
                          fontWeight: "bold",
                        }}
                      >
                        Farmer
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  padding: "20px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ color: "#1b4d2e", marginTop: 0 }}>
                  🛡️ Administrator Accounts ({adminUsersList.length})
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  {adminUsersList.map((aUser, idx) => (
                    <div
                      key={aUser.id || idx}
                      style={{
                        background: "#fff",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1f2937", display: "block" }}>
                          {aUser.name}
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          {aUser.email}
                        </span>
                      </div>
                      <span
                        style={{
                          background: "#1b4d2e",
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "0.78rem",
                          fontWeight: "bold",
                        }}
                      >
                        Admin
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === "admin" && activeTab === "adminProfile" && (
          <div
            className="card-panel"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            <h2
              className="section-title"
              style={{ color: "#1b4d2e", marginBottom: "20px" }}
            >
              ⚙️ Admin Profile & Security Settings
            </h2>

            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{ color: "#1f2937", marginTop: 0, marginBottom: "15px" }}
              >
                Personal Details
              </h3>
              <form
                onSubmit={handleUpdateProfile}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={adminProfileForm.name}
                    onChange={(e) =>
                      setAdminProfileForm({
                        ...adminProfileForm,
                        name: e.target.value,
                      })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={adminProfileForm.email}
                    onChange={(e) =>
                      setAdminProfileForm({
                        ...adminProfileForm,
                        email: e.target.value,
                      })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#1b4d2e",
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "5px",
                    width: "fit-content",
                  }}
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{ color: "#1f2937", marginTop: 0, marginBottom: "15px" }}
              >
                Change Password
              </h3>
              <form
                onSubmit={handlePasswordChange}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
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
                    Old Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
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
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 chars)"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
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
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#d32f2f",
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "5px",
                    width: "fit-content",
                  }}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}

        {user?.role === "admin" && activeTab === "addProduct" && (
          <div
            className="card-panel"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <h2
              className="section-title"
              style={{ color: "#2e7d32", marginBottom: "20px" }}
            >
              Add New Product
            </h2>
            <form
              onSubmit={handleSubmit}
              className="form-group"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
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
                  Product Name
                </label>
                <input
                  type="text"
                  name="cropName"
                  className="input-field"
                  placeholder="e.g. Organic Wheat"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
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
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  className="input-field"
                  placeholder="e.g. Vegetables / Grains"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
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
                  Price (₹)
                </label>
                <input
                  type="text"
                  name="price"
                  className="input-field"
                  placeholder="e.g. 40/kg"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
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
                  Description
                </label>
                <textarea
                  name="description"
                  className="input-field"
                  placeholder="e.g. Grown healthily and organically."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
                    resize: "vertical",
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
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageURL"
                  className="input-field"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageURL}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  marginTop: "10px",
                  background: "#2e7d32",
                  color: "#fff",
                  padding: "12px",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Add Product
              </button>
            </form>
          </div>
        )}
      </main>

      <footer
        style={{
          width: "100%",
          background: "#1b4d2e",
          borderTop: "3px solid #2e7d32",
          color: "#ffffff",
          marginTop: "60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            fontSize: "0.9rem",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontWeight: 500, color: "#e8f5e9" }}>
            © 2026 AgriTech. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "35px" }}>
            <span
              style={{ cursor: "pointer", color: "#a5d6a7" }}
              onClick={() =>
                alert(
                  "Privacy Policy: All user data is encrypted and securely processed.",
                )
              }
            >
              Privacy Policy
            </span>
            <span
              style={{ cursor: "pointer", color: "#a5d6a7" }}
              onClick={() =>
                alert(
                  "Terms of Service: Use of this platform implies adherence to agricultural trade standards.",
                )
              }
            >
              Terms of Service
            </span>
            <span
              style={{ cursor: "pointer", color: "#a5d6a7" }}
              onClick={() =>
                alert("Contact Support: support@agritech-platform.com")
              }
            >
              Contact Us
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
