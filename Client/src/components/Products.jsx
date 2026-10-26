import React, { useState, useEffect } from "react";

function Products({ products = [], onBookProduct, onDeleteProduct, userRole }) {
  const [cropList, setCropList] = useState(products);
  // Tracks active quantity selection state per product ID
  const [quantities, setQuantities] = useState({});
  // Tracks which product card currently has the quantity input open
  const [activeBookingId, setActiveBookingId] = useState(null);

  useEffect(() => {
    setCropList(products);
  }, [products]);

  const handleQuantityChange = (productId, val) => {
    setQuantities({ ...quantities, [productId]: val });
  };

  const handleConfirmBooking = (product) => {
    const productId = product._id || product.id;
    const qty = parseInt(quantities[productId] || "1", 10);

    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid quantity greater than 0.");
      return;
    }

    const priceNum =
      parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 50;
    const totalAmount = priceNum * qty;

    const bookingData = {
      productName: product.cropName || product.name,
      quantity: qty,
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
      status: "Confirmed",
      // Associate booking with currently logged-in user
      userEmail:
        userRole?.email || localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).email
          : "",
    };

    if (onBookProduct) {
      onBookProduct(bookingData);
      alert(
        `Booking successful for ${qty} unit(s) of ${product.cropName || product.name}! Total: ₹${totalAmount}`,
      );
      setActiveBookingId(null);
    }
  };
  return (
    <div className="card-panel">
      <h2
        className="section-title"
        style={{ color: "#2e7d32", marginBottom: "20px" }}
      >
        🛒 AgriTech Marketplace Catalog ({cropList.length})
      </h2>

      {cropList.length === 0 ? (
        <p
          style={{
            color: "#6b7280",
            fontStyle: "italic",
            textAlign: "center",
            padding: "20px",
          }}
        >
          No products currently available in the marketplace.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {cropList.map((item, index) => {
            const productId = item._id || item.id || index;
            const title = item.cropName || item.name || "Agricultural Produce";
            const category = item.category || "General";
            const price = item.price || "Contact for price";
            const description =
              item.description || "Fresh and high-grade quality guaranteed.";
            const image =
              item.imageURL ||
              item.image ||
              "https://images.unsplash.com/photo-1574943320219-553eb213f72d";
            const isBookingOpen = activeBookingId === productId;
            const currentQty = quantities[productId] || "1";

            return (
              <div
                key={productId}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    height: "160px",
                    overflow: "hidden",
                    background: "#f3f4f6",
                  }}
                >
                  <img
                    src={image}
                    alt={title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1574943320219-553eb213f72d";
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: "16px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        color: "#1f2937",
                        fontSize: "1.1rem",
                      }}
                    >
                      {title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Category: {category}
                    </span>
                    <strong
                      style={{
                        color: "#2e7d32",
                        fontSize: "1.05rem",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Price: ₹{price}
                    </strong>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#4b5563",
                        margin: "0 0 16px",
                        lineHeight: "1.4",
                      }}
                    >
                      {description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "auto",
                    }}
                  >
                    {/* Inline Formal Quantity Section replacing browser prompt */}
                    {isBookingOpen ? (
                      <div
                        style={{
                          background: "#f9fafb",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              color: "#374151",
                            }}
                          >
                            Select Quantity:
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={currentQty}
                            onChange={(e) =>
                              handleQuantityChange(productId, e.target.value)
                            }
                            style={{
                              width: "65px",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "1px solid #d1d5db",
                              textAlign: "center",
                              fontSize: "0.9rem",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleConfirmBooking(item)}
                            style={{
                              background: "#2e7d32",
                              color: "#fff",
                              border: "none",
                              padding: "6px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              cursor: "pointer",
                              flex: 1,
                            }}
                          >
                            Confirm Order
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveBookingId(null)}
                            style={{
                              background: "#6b7280",
                              color: "#fff",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveBookingId(productId)}
                        style={{
                          background: "#2e7d32",
                          color: "#ffffff",
                          border: "none",
                          padding: "10px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        Buy Now
                      </button>
                    )}

                    {userRole === "admin" && (
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteProduct && onDeleteProduct(productId)
                        }
                        style={{
                          background: "#dc2626",
                          color: "#ffffff",
                          border: "none",
                          padding: "8px",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        🗑️ Delete Product
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Products;
