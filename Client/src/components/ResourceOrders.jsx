import React, { useState, useEffect } from 'react';

function ResourceOrders() {
  const [orders, setOrders] = useState([]);
  const [orderForm, setOrderForm] = useState({
    farmerName: '',
    resourceName: 'Certified Hybrid Wheat Seeds (50kg)',
    quantity: 1,
    totalPrice: 1200
  });

  const availableResources = [
    { name: 'Certified Hybrid Wheat Seeds (50kg)', price: 1200 },
    { name: 'NPK Complex Fertilizer (45kg bag)', price: 1450 },
    { name: 'Organic Neem Pesticide (5L)', price: 850 },
    { name: 'Drip Irrigation Kit (Per Acre)', price: 4500 }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch('http://localhost:8000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.log('Error fetching orders:', err));
  };

  const handleResourceSelect = (e) => {
    const selected = availableResources.find(r => r.name === e.target.value);
    setOrderForm({
      ...orderForm,
      resourceName: selected.name,
      totalPrice: selected.price * orderForm.quantity
    });
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    const currentRes = availableResources.find(r => r.name === orderForm.resourceName);
    setOrderForm({
      ...orderForm,
      quantity: qty,
      totalPrice: currentRes.price * qty
    });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOrders([data.order, ...orders]);
      alert('Resource order placed successfully!');
      setOrderForm({ farmerName: '', resourceName: availableResources[0].name, quantity: 1, totalPrice: availableResources[0].price });
    } catch (err) {
      alert('Error placing order: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      
      {/* Place Order Form */}
      <div className="card-panel">
        <h3 className="section-title">🛒 Purchase Farm Resources</h3>
        <form onSubmit={handleOrderSubmit} className="form-group">
          <input 
            type="text" 
            placeholder="Farmer / Buyer Name" 
            className="input-field" 
            value={orderForm.farmerName} 
            onChange={e => setOrderForm({...orderForm, farmerName: e.target.value})} 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#4b5563' }}>Select Resource:</label>
            <select className="input-field" value={orderForm.resourceName} onChange={handleResourceSelect}>
              {availableResources.map((res, idx) => (
                <option key={idx} value={res.name}>{res.name} — ₹{res.price}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#4b5563' }}>Quantity:</label>
            <input 
              type="number" 
              min="1" 
              className="input-field" 
              value={orderForm.quantity} 
              onChange={handleQuantityChange} 
              required 
            />
          </div>

          <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#1b5e20' }}>Total Amount:</span>
            <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>₹{orderForm.totalPrice}</strong>
          </div>

          <button type="submit" className="btn-primary">Confirm & Place Order</button>
        </form>
      </div>

      {/* Order Tracking Dashboard */}
      <div className="card-panel">
        <h3 className="section-title">📦 Active Order Tracking</h3>
        {orders.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No resource orders placed yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {orders.map((ord, idx) => (
              <div key={ord._id || idx} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '14px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, color: '#1f2937', fontSize: '1.05rem' }}>{ord.resourceName}</h4>
                  <span style={{ 
                    background: ord.status === 'Delivered' ? '#e8f5e9' : '#fff3e0', 
                    color: ord.status === 'Delivered' ? '#2e7d32' : '#e65100', 
                    fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' 
                  }}>
                    {ord.status}
                  </span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#4b5563' }}>Ordered by: <strong>{ord.farmerName}</strong> (Qty: {ord.quantity})</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6b7280' }}>Date: {new Date(ord.orderDate).toLocaleDateString()}</span>
                  <strong style={{ color: '#2e7d32' }}>₹{ord.totalPrice}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ResourceOrders;