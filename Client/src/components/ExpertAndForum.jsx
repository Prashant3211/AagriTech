import React, { useState, useEffect } from "react";

function ExpertAndForum() {
  const [activeSubTab, setActiveSubTab] = useState("expert");
  const [consultations, setConsultations] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);

  const [consultForm, setConsultForm] = useState({
    farmerName: "",
    topic: "",
    question: "",
  });
  const [postForm, setPostForm] = useState({
    author: "",
    title: "",
    content: "",
  });
  const [replyTextMap, setReplyTextMap] = useState({});
  const [replierNameMap, setReplierNameMap] = useState({});

  useEffect(() => {
    fetchConsultations();
    fetchForumPosts();
  }, []);

  const fetchConsultations = () => {
    fetch("http://localhost:8000/api/consultations")
      .then((res) => res.json())
      .then((data) => setConsultations(Array.isArray(data) ? data : []))
      .catch((err) => console.log("Error fetching consultations:", err));
  };

  const fetchForumPosts = () => {
    fetch("http://localhost:8000/api/forum")
      .then((res) => res.json())
      .then((data) => setForumPosts(Array.isArray(data) ? data : []))
      .catch((err) => console.log("Error fetching forum posts:", err));
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setConsultations([data.consultation, ...consultations]);
      setConsultForm({ farmerName: "", topic: "", question: "" });
      alert("Question submitted to agricultural experts successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setForumPosts([data.post, ...forumPosts]);
      setPostForm({ author: "", title: "", content: "" });
      alert("Discussion posted to community forum!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReplySubmit = async (postId) => {
    const text = replyTextMap[postId];
    const name = replierNameMap[postId] || "Anonymous Farmer";
    if (!text) return alert("Please enter a reply.");

    try {
      const res = await fetch(
        `http://localhost:8000/api/forum/${postId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replierName: name, replyText: text }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setForumPosts(forumPosts.map((p) => (p._id === postId ? data.post : p)));
      setReplyTextMap({ ...replyTextMap, [postId]: "" });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      {/* Sub-navigation switcher */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <button
          onClick={() => setActiveSubTab("expert")}
          style={{
            padding: "10px 24px",
            borderRadius: "20px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: activeSubTab === "expert" ? "#2e7d32" : "#e5e7eb",
            color: activeSubTab === "expert" ? "#fff" : "#4b5563",
          }}
        >
          👨‍🌾 Ask Agri Expert
        </button>
        <button
          onClick={() => setActiveSubTab("forum")}
          style={{
            padding: "10px 24px",
            borderRadius: "20px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            background: activeSubTab === "forum" ? "#2e7d32" : "#e5e7eb",
            color: activeSubTab === "forum" ? "#fff" : "#4b5563",
          }}
        >
          💬 Community Discussion Forum
        </button>
      </div>

      {/* EXPERT CONSULTATION TAB */}
      {activeSubTab === "expert" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "24px",
          }}
        >
          <div className="card-panel">
            <h3 className="section-title">🌾 Ask an Agricultural Expert</h3>
            <form onSubmit={handleConsultSubmit} className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                className="input-field"
                value={consultForm.farmerName}
                onChange={(e) =>
                  setConsultForm({ ...consultForm, farmerName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Topic (e.g., Crop Disease, Irrigation, Soil pH)"
                className="input-field"
                value={consultForm.topic}
                onChange={(e) =>
                  setConsultForm({ ...consultForm, topic: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Describe your farming issue in detail..."
                className="input-field"
                rows="4"
                value={consultForm.question}
                onChange={(e) =>
                  setConsultForm({ ...consultForm, question: e.target.value })
                }
                required
                style={{ resize: "vertical" }}
              />
              <button type="submit" className="btn-primary">
                Submit to Expert Panel
              </button>
            </form>
          </div>

          <div className="card-panel">
            <h3 className="section-title">📋 Consultation History & Answers</h3>
            {consultations.length === 0 ? (
              <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
                No consultation questions submitted yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  maxHeight: "420px",
                  overflowY: "auto",
                }}
              >
                {consultations.map((c, idx) => (
                  <div
                    key={c._id || idx}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong style={{ color: "#2e7d32" }}>{c.topic}</strong>
                      <span
                        style={{
                          background:
                            c.status === "Resolved" ? "#e8f5e9" : "#fff3e0",
                          color:
                            c.status === "Resolved" ? "#2e7d32" : "#e65100",
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "6px 0 4px",
                        fontSize: "0.9rem",
                        color: "#1f2937",
                      }}
                    >
                      "{c.question}"
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.82rem",
                        color: "#6b7280",
                      }}
                    >
                      Asked by: {c.farmerName}
                    </p>
                    <div
                      style={{
                        marginTop: "8px",
                        background: "#e8f5e9",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        color: "#1b5e20",
                      }}
                    >
                      <strong>Expert Advice:</strong> {c.expertResponse}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMMUNITY FORUM TAB */}
      {activeSubTab === "forum" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "24px",
          }}
        >
          <div className="card-panel">
            <h3 className="section-title">✍️ Start a Discussion</h3>
            <form onSubmit={handlePostSubmit} className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                className="input-field"
                value={postForm.author}
                onChange={(e) =>
                  setPostForm({ ...postForm, author: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Discussion Title"
                className="input-field"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm({ ...postForm, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Share your thoughts, experiences, or questions with the community..."
                className="input-field"
                rows="4"
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({ ...postForm, content: e.target.value })
                }
                required
                style={{ resize: "vertical" }}
              />
              <button type="submit" className="btn-primary">
                Post to Community
              </button>
            </form>
          </div>

          <div className="card-panel">
            <h3 className="section-title">📢 Community Discussions</h3>
            {forumPosts.length === 0 ? (
              <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
                No discussions yet. Be the first to post!
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                {forumPosts.map((post) => (
                  <div
                    key={post._id}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 4px", color: "#1f2937" }}>
                      {post.title}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "0.9rem",
                        color: "#4b5563",
                      }}
                    >
                      {post.content}
                    </p>
                    <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                      Posted by {post.author} on{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>

                    {/* Replies section */}
                    <div
                      style={{
                        marginTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "8px",
                      }}
                    >
                      <h5
                        style={{
                          margin: "0 0 6px",
                          fontSize: "0.85rem",
                          color: "#2e7d32",
                        }}
                      >
                        Replies ({post.replies?.length || 0})
                      </h5>
                      {post.replies?.map((rep, rIdx) => (
                        <div
                          key={rIdx}
                          style={{
                            background: "#ffffff",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            marginBottom: "6px",
                            border: "1px solid #f3f4f6",
                            fontSize: "0.85rem",
                          }}
                        >
                          <strong>{rep.replierName}:</strong> {rep.replyText}
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          marginTop: "8px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Your Name"
                          style={{
                            width: "110px",
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "0.8rem",
                          }}
                          value={replierNameMap[post._id] || ""}
                          onChange={(e) =>
                            setReplierNameMap({
                              ...replierNameMap,
                              [post._id]: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          style={{
                            flex: 1,
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "0.8rem",
                          }}
                          value={replyTextMap[post._id] || ""}
                          onChange={(e) =>
                            setReplyTextMap({
                              ...replyTextMap,
                              [post._id]: e.target.value,
                            })
                          }
                        />
                        <button
                          onClick={() => handleReplySubmit(post._id)}
                          style={{
                            background: "#2e7d32",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                          }}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpertAndForum;
