🌱 AagriTech – Full-Stack MERN Agricultural Platform
A modern, data-driven, and role-based AgriTech web application designed to empower farmers with real-time weather forecasting, soil & pest guidance, crop market intelligence, and a seamless marketplace for agricultural resources.

🚀 Key Features
Role-Based Access Control (RBAC): Distinct dashboards and security perimeters for regular Users/Farmers and Administrators.

Administrator Console:

Dashboard Analytics: Real-time statistics tracking farmer accounts, admin accounts, total products, and active bookings.

User Management: Live inspection and management of system accounts with built-in deduplication by email.

Dedicated Bookings Inspection Tab: Comprehensive tracking of platform orders showing user emails, product names, quantities, calculated pricing, and order dates.

Admin Profile & Security: Secure credential updates and password management protected by an administrator security key (AGRITECH SECRET 2026).

Interactive Marketplace & Products: Browse, add, and manage crops/products with persistent local and backend state, blacklisting logic for deleted default entries, and instant purchasing capability.

Weather Forecast Station: Integrated meteorological tools using secure environment variables (VITE_WEATHER_API_KEY) for live forecasting.

Soil & Pest Management: Tailored diagnostics and resources to assist farmers with crop health.

Persistent Session Management: Automatic client-side fallback storage using localStorage to ensure seamless data persistence across user refreshes and sessions.

🛠️ Tech Stack
Frontend: React.js, Vite, Modern CSS, Responsive Grid UI

Backend: Node.js, Express.js

Database / Persistence: MongoDB (API-ready) with robust localStorage synchronization layers

Security: Environment configuration (.env with Vite-compliant VITE_ variables), Admin passkeys, and credential segregation

📁 Project Structure
Plaintext
AagriTech/
├── Client/                 # Vite-powered React Frontend
│   ├── src/
│   │   ├── components/     # UI components (Auth, Weather, Products, Soil & Pest, etc.)
│   │   ├── App.jsx         # Main application container & routing logic
│   │   ├── App.css         # Custom styling
│   │   └── main.jsx        # Entry point
│   ├── .env                # Client environment variables (Git-ignored)
│   └── package.json
└── Server/                 # Node.js & Express Backend
    ├── routes/             # API routes (Crops, Users, Admin)
    ├── .env                # Server environment variables (Git-ignored)
    └── package.json
⚙️ Getting Started & Installation
Follow these steps to set up and run the project locally on your machine.

1. Clone the Repository
Bash
git clone https://github.com/Prashant3211/AagriTech.git
cd AagriTech
2. Set Up Environment Variables
Create a .env file inside the Client directory and add your keys:

Code snippet
VITE_WEATHER_API_KEY=your_openweather_api_key_here
3. Run the Client
Navigate to the client directory, install dependencies, and start the Vite development server:

Bash
cd Client
npm install
npm run dev
4. Run the Server (Optional / Backend Sync)
Open a separate terminal window, navigate to the server directory, install dependencies, and start the backend:

Bash
cd Server
npm install
npm run dev
🛡️ Default Access Credentials
Admin Portal Security Key: AGRITECH SECRET 2026

Default Admin Account: Configurable via the Admin Profile settings tab or default setup.

📄 License
This project is developed for academic and commercial agricultural advancement under standard industry protocols.

© 2026 AgriTech. All rights reserved.
