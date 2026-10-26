import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaWind, FaTint, FaTachometerAlt } from 'react-icons/fa';

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Replace with your OpenWeatherMap API key (obtained from openweathermap.org)
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  // 1. Automatic Location Detection on component mount[cite: 13]
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherByCoords(lat, lon);
        },
        (err) => {
          setError('Geolocation permission denied. Please search manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  // Fetch weather using coordinates[cite: 13]
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data.');
      setLoading(false);
    }
  };

  // 2. Manual Location Search (by city name)[cite: 12, 13]
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError('');
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      setError('City not found. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', background: '#e8f5e9', borderRadius: '10px', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#2e7d32', textAlign: 'center' }}>🌾 AgriTech Weather Forecast</h3>

      {/* Search Input for Manual Location */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
          <FaSearch /> Search
        </button>
      </form>

      {loading && <p style={{ textAlign: 'center' }}>Loading weather data...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Display Weather Metrics */}
      {weather && !loading && (
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h4><FaMapMarkerAlt /> {weather.name}, {weather.sys.country}</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: '#333' }}>{Math.round(weather.main.temp)}°C</h2>
            <p style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{weather.weather[0].description}</p>
          </div>
          <hr />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
            <p><FaTint color="#0288d1" /> <strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p><FaWind color="#616161" /> <strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
            <p><FaTachometerAlt color="#f57c00" /> <strong>Pressure:</strong> {weather.main.pressure} hPa</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;