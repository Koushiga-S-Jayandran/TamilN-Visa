# TAMIZN VISA
> “From Heritage to Hidden Horizons.”  
> “Beyond the Famous. Into the Forgotten.”

**Creator:** Koushiga S Jayandran  
**Institution:** Sri Ramakrishna Engineering College  
**Location:** Vattamalaipalayam, Coimbatore, Tamil Nadu, India  

---

## 🌟 Overview
TamizN Visa is an intelligent, scalable Tamil Nadu tourism decision engine and day-wise travel planner. It bridges the critical gap in South Indian tourism by offering:
- **Full Coverage of All 38 Tamil Nadu Districts**
- **Evidence-Based Crowd Intelligence (Hierarchical 3-Level Model)**
- **Realistic 06:00 AM – 09:00 PM Itinerary Day Windows** with natural meal breaks and travel buffers
- **Verified Hidden Gems** to de-congest mainstream tourist hubs
- **Smart Alternatives** (e.g. suggesting freshwater cascades when asking for beaches in Coimbatore)
- **Authentic Regional Food Discovery** (Kongu, Pandya, Chola, Chettinad, and Thondai culinary heritage)
- **Persistent Offline Access & Printable Trip Dossiers**

---

## 🏛️ Architecture & Folder Structure

```
├── /src
│   ├── /config
│   │   └── appConfig.ts          # Central branding, creator metadata, categories, 38 districts
│   ├── /types
│   │   └── index.ts              # TypeScript schemas for Destinations, Crowd, Itineraries, Food
│   ├── /data
│   │   ├── districts.ts          # All 38 districts with regional profiles
│   │   ├── destinations.ts       # Verified destination database with exact coordinates & TTDC/ASI sources
│   │   ├── foodPlaces.ts         # Authentic regional food spots
│   │   └── alerts.ts             # Destination safety, dress codes, curfews & ticketing rules
│   ├── /services
│   │   ├── crowdEngine.ts        # 3-Level evidence-backed crowd scoring engine
│   │   ├── itineraryEngine.ts    # 06:00 AM - 09:00 PM day optimizer with travel buffers
│   │   ├── smartSearch.ts        # Natural language intent parser & smart alternatives
│   │   └── storageService.ts     # Offline persistence and JSON export manager
│   ├── /components
│   │   ├── Navbar.tsx            # Responsive navigation & Plan CTA
│   │   ├── Footer.tsx            # Institutional attribution and truth policy
│   │   ├── HeroSection.tsx       # Cinematic hero with natural language search
│   │   ├── InteractiveMap.tsx    # Leaflet map with coordinates, custom pins & filters
│   │   ├── DestinationCard.tsx   # Card with crowd indicators and entry cost
│   │   ├── DestinationDetailModal.tsx # Full destination dossier & factor explainability
│   │   ├── MultiStepPlanner.tsx  # 9-Step guided itinerary generator with meaningful progress
│   │   ├── ItineraryDashboard.tsx # Time-buffered day view with budget tracker
│   │   ├── HiddenGemsView.tsx    # Dedicated hidden treasures view
│   │   ├── CrowdInsightsView.tsx # Crowd evaluator simulator
│   │   ├── FoodDiscoveryView.tsx # Authentic food discovery hub
│   │   ├── SavedTripsView.tsx    # Offline trips management
│   │   ├── OfflineTripSummaryModal.tsx # Printable offline dossier & emergency helplines
│   │   ├── SearchResultSection.tsx # Search intent & smart alternatives
│   │   ├── AlertsBanner.tsx      # Real-time travel notices banner
│   │   └── AboutModal.tsx        # Project innovation & competition dossier
│   ├── App.tsx                   # Master application controller
│   ├── index.css                 # Tailwind CSS v4 styling & print media styles
│   └── main.tsx                  # Application entry point
├── metadata.json
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/tamizn-visa.git
cd tamizn-visa

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔒 Truth & Zero-Fabrication Policy
TamizN Visa explicitly rejects randomly generated data and fake precision percentages (such as 73.42%). All information is validated against official sources:
- **TTDC (Tamil Nadu Tourism Development Corporation)**
- **ASI (Archaeological Survey of India) Chennai Circle**
- **HR&CE (Hindu Religious & Charitable Endowments) Department**
- **Tamil Nadu Forest Department**
- **District Administrations & Police Advisories**

---

© 2026 TamizN Visa. Designed and Developed by **Koushiga S Jayandran**, Sri Ramakrishna Engineering College, Vattamalaipalayam, Coimbatore.
