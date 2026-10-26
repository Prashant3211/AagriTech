import React, { useState, useEffect } from "react";

function Auth({ defaultRole = "user", onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminKey: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setRole(defaultRole);
    if (defaultRole === "admin") {
      setIsLogin(true);
      const savedCreds = JSON.parse(
        localStorage.getItem("adminCredentials") || "{}",
      );
      setFormData((prev) => ({
        ...prev,
        email: savedCreds.email || "prashantvishwakarma3211@gmail.com",
        password: "",
      }));
    }
    setError("");
    setMessage("");
  }, [defaultRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (role === "admin" && !isLogin) {
      if (formData.adminKey !== "AGRITECH SECRET 2026") {
        setError("Invalid Admin Security Key.");
        return;
      }
    }

    if (role === "admin") {
      const savedCreds = JSON.parse(
        localStorage.getItem("adminCredentials") ||
          '{"name": "Prashant Vishwakarma", "email": "prashantvishwakarma3211@gmail.com"}',
      );
      const adminUser = {
        name: savedCreds.name || "Prashant Vishwakarma",
        email: formData.email.trim() || savedCreds.email,
        role: "admin",
      };
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem(
        "adminCredentials",
        JSON.stringify({
          email: adminUser.email,
          password: formData.password,
          name: adminUser.name,
        }),
      );

      updateSystemUsersList(adminUser);
      onLoginSuccess(adminUser);
      return;
    }

    // 🛑 DUP REGISTRATION CHECK: Check if email already exists during sign up
    if (!isLogin && role === "user") {
      const existingUsers = JSON.parse(
        localStorage.getItem("local_system_users") || "[]",
      );
      const userExists = existingUsers.some(
        (u) =>
          u.email.trim().toLowerCase() === formData.email.trim().toLowerCase(),
      );

      if (userExists) {
        setError("User already exists");
        return;
      }
    }

    // Regular User Flow (Login / Register)
    try {
      const endpoint = isLogin
        ? "http://localhost:8000/api/users/login"
        : "http://localhost:8000/api/users/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          role: role,
          name: formData.name,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isLogin ? "Authentication failed" : "User already exists"),
        );
      }

      if (isLogin) {
        localStorage.setItem("token", data.token || "mock-token");
        const userObj = data.user || {
          name: formData.email.split("@")[0],
          email: formData.email.trim(),
          role: role,
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        updateSystemUsersList(userObj);
        onLoginSuccess(userObj);
      } else {
        const newUserObj = {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email.trim(),
          role: "user",
        };
        updateSystemUsersList(newUserObj);

        setMessage("Account created successfully! Please sign in.");
        setIsLogin(true);
      }
    } catch (err) {
      // If error is explicit user existence error, display it and stop
      if (err.message.toLowerCase().includes("already exist")) {
        setError("User already exists");
        return;
      }

      // Offline Fallback Login/Registration
      if (!isLogin) {
        // Double check local storage during offline mode fallback
        const existingUsers = JSON.parse(
          localStorage.getItem("local_system_users") || "[]",
        );
        if (
          existingUsers.some(
            (u) =>
              u.email.trim().toLowerCase() ===
              formData.email.trim().toLowerCase(),
          )
        ) {
          setError("User already exists");
          return;
        }

        const newUserObj = {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email.trim(),
          role: "user",
        };
        updateSystemUsersList(newUserObj);
        setMessage("Account created successfully! Please sign in.");
        setIsLogin(true);
      } else {
        const userObj = {
          name: formData.name || formData.email.split("@")[0],
          email: formData.email.trim(),
          role: "user",
        };
        localStorage.setItem("token", "mock-token");
        localStorage.setItem("user", JSON.stringify(userObj));

        updateSystemUsersList(userObj);
        onLoginSuccess(userObj);
      }
    }
  };

  const updateSystemUsersList = (newUser) => {
    try {
      const existingUsers = JSON.parse(
        localStorage.getItem("local_system_users") ||
          '[{"id":1,"name":"Prashant Vishwakarma","email":"prashantvishwakarma3211@gmail.com","role":"admin"},{"id":2,"name":"Ramesh Patel","email":"ramesh.farmer@agritech.com","role":"user"},{"id":3,"name":"Suresh Mukati","email":"suresh.farmer@agritech.com","role":"user"}]',
      );

      const exists = existingUsers.some(
        (u) =>
          u.email.trim().toLowerCase() === newUser.email.trim().toLowerCase(),
      );
      if (!exists) {
        const entry = {
          id: Date.now(),
          name: newUser.name || newUser.email.split("@")[0],
          email: newUser.email.trim(),
          role: newUser.role || "user",
        };
        existingUsers.push(entry);
        localStorage.setItem(
          "local_system_users",
          JSON.stringify(existingUsers),
        );
      }
    } catch (e) {
      console.error("Failed updating system users list", e);
    }
  };

  return (
    <div
      className="card-panel"
      style={{
        maxWidth: "440px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => {
            setRole("user");
            setIsLogin(true);
            setError("");
            setMessage("");
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: role === "user" ? "#2e7d32" : "#f3f4f6",
            color: role === "user" ? "#fff" : "#374151",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          User Portal
        </button>
        <button
          type="button"
          onClick={() => {
            setRole("admin");
            setIsLogin(true);
            setError("");
            setMessage("");
            const savedCreds = JSON.parse(
              localStorage.getItem("adminCredentials") || "{}",
            );
            setFormData((prev) => ({
              ...prev,
              email: savedCreds.email || "prashantvishwakarma3211@gmail.com",
              password: "",
            }));
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: role === "admin" ? "#1b4d2e" : "#f3f4f6",
            color: role === "admin" ? "#fff" : "#374151",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Admin Portal
        </button>
      </div>

      <h3
        style={{
          color: role === "admin" ? "#1b4d2e" : "#2e7d32",
          margin: "0 0 20px",
          textAlign: "center",
        }}
      >
        {role === "admin"
          ? "Administrator Secure Login"
          : isLogin
            ? "User Sign In"
            : "Register New User Account"}
      </h3>

      {role === "user" && (
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #e0e0e0",
            marginBottom: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              background: "none",
              border: "none",
              borderBottom: isLogin ? "3px solid #2e7d32" : "none",
              fontWeight: "bold",
              color: isLogin ? "#2e7d32" : "#78909c",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              background: "none",
              border: "none",
              borderBottom: !isLogin ? "3px solid #2e7d32" : "none",
              fontWeight: "bold",
              color: !isLogin ? "#2e7d32" : "#78909c",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Sign Up
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "0.88rem",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}
      {message && (
        <div
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "0.88rem",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-group">
        {!isLogin && role === "user" && (
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          className="input-field"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="input-field"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {role === "admin" && !isLogin && (
          <input
            type="password"
            name="adminKey"
            className="input-field"
            placeholder="Admin Security Passcode"
            value={formData.adminKey}
            onChange={handleChange}
            required
          />
        )}

        <button
          type="submit"
          className="btn-primary"
          style={{
            marginTop: "12px",
            background: role === "admin" ? "#1b4d2e" : "#2e7d32",
            fontWeight: "bold",
          }}
        >
          {role === "admin"
            ? "Sign In to Admin Console"
            : isLogin
              ? "Sign In to Dashboard"
              : "Register Account"}
        </button>
      </form>
    </div>
  );
}

export default Auth;
