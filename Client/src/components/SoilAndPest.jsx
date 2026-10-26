import React, { useState, useEffect } from 'react';

function SoilAndPest() {
  const [soilReports, setSoilReports] = useState([]);
  const [pestAlerts, setPestAlerts] = useState([]);
  const [soilForm, setSoilForm] = useState({
    farmer: '', location: '', phLevel: '', nitrogen: '', phosphorus: '', potassium: '', recommendation: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/soil-reports')
      .then(res => res.json())
      .then(data => setSoilReports(Array.isArray(data) ? data : []))
      .catch(err => console.log('Error fetching soil reports:', err));

    fetch('http://localhost:8000/api/pest-alerts')
      .then(res => res.json())
      .then(data => setPestAlerts(Array.isArray(data) ? data : []))
      .catch(err => console.log('Error fetching pest alerts:', err));
  }, []);

  const handleSoilSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/soil-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(soilForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSoilReports([data.report, ...soilReports]);
      setSoilForm({ farmer: '', location: '', phLevel: '', nitrogen: '', phosphorus: '', potassium: '', recommendation: '' });
      alert('Soil report analyzed and saved successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Soil Health Analysis Section */}
      <div className="card-panel">
        <h3 className="section-title">🧪 Soil Health Analysis</h3>
        <form onSubmit={handleSoilSubmit} className="form-group">
          <input type="text" placeholder="Farmer Name" className="input-field" value={soilForm.farmer} onChange={e => setSoilForm({...soilForm, farmer: e.target.value})} required />
          <input type="text" placeholder="Farm Location" className="input-field" value={soilForm.location} onChange={e => setSoilForm({...soilForm, location: e.target.value})} required />
          <input type="number" step="0.1" placeholder="pH Level (e.g., 6.5)" className="input-field" value={soilForm.phLevel} onChange={e => setSoilForm({...soilForm, phLevel: e.target.value})} required />
          <input type="text" placeholder="Nitrogen Level (Low/Med/High)" className="input-field" value={soilForm.nitrogen} onChange={e => setSoilForm({...soilForm, nitrogen: e.target.value})} required />
          <input type="text" placeholder="Phosphorus Level" className="input-field" value={soilForm.phosphorus} onChange={e => setSoilForm({...soilForm, phosphorus: e.target.value})} required />
          <input type="text" placeholder="Potassium Level" className="input-field" value={soilForm.potassium} onChange={e => setSoilForm({...soilForm, potassium: e.target.value})} required />
          <input type="text" placeholder="Fertilizer Recommendation" className="input-field" value={soilForm.recommendation} onChange={e => setSoilForm({...soilForm, recommendation: e.target.value})} />
          <button type="submit" className="btn-primary">Submit Soil Analysis</button>
        </form>

        <div style={{ marginTop: '20px', maxHeight: '220px', overflowY: 'auto' }}>
          <h4 style={{ color: '#2e7d32' }}>Recent Soil Reports</h4>
          {soilReports.length === 0 ? (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>No soil reports submitted yet.</p>
          ) : (
            soilReports.map((rep, idx) => (
              <div key={idx} style={{ background: '#f9fbe7', padding: '10px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{rep.location}</strong> ({rep.farmer}) — pH: {rep.phLevel} <br />
                <span style={{ color: '#6b7280' }}>Rec: {rep.recommendation || 'Standard NPK Balance'}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pest Alert Notifications Section */}
      <div className="card-panel">
        <h3 className="section-title">🐛 Active Pest Alert Notifications</h3>
        {pestAlerts.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No active pest threats reported in your region.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
            {pestAlerts.map((alert, idx) => (
              <div key={idx} style={{ background: '#ffebee', borderLeft: '4px solid #d32f2f', padding: '12px', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: '0', color: '#c62828' }}>{alert.pestName} ({alert.cropName})</h4>
                  <span style={{ background: '#d32f2f', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{alert.severity}</span>
                </div>
                <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>{alert.description}</p>
                <p style={{ margin: '0', fontSize: '0.85rem', color: '#2e7d32' }}><strong>Recommended Treatment:</strong> {alert.solution}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default SoilAndPest;