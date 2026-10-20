# CA1 Viva Preparation Guide (10 Marks)
## Team Name: dattasai | Project: LogiPulse (Problem #8)
### Team Leader: Datta Sai (Reg. No: 12623781)
### Team Members: 12629667, 12610145

---

## 1. Quick Project Elevator Pitch (30 Seconds)
> "Good morning, Professor. Our project is **LogiPulse**, developed for CA1 Problem Statement #8: Supply Chain Shipment Visibility & Bottleneck Tracking. In modern supply chains, businesses moving goods between suppliers, intermediate hubs, and customers often suffer from blind spots and delayed notifications when items get stuck. 
> 
> Our system provides real-time geospatial tracking across 5 supply chain milestones, automated bottleneck detection when hub dwell times exceed SLA thresholds, an interactive audit timeline, dynamic dwell analytics using Chart.js, and offline persistence via LocalStorage. It is 100% responsive and deployed on GitHub Pages."

---

## 2. Top Viva Questions & Model Answers

### Q1: What is the core problem you are solving, and why is bottleneck detection important?
**Answer**:
"In supply chain logistics, delays don't typically happen when vehicles are in smooth motion; they occur at **stagnation points**—such as sorting conveyor breakdowns at regional warehouses or landslides on transit corridors. Our system proactively monitors dwell times at each node against a set SLA (e.g., 18 hours max at a warehouse). The moment a shipment exceeds that threshold or encounters a disruption, LogiPulse flags a red pulsing delay alert, allowing dispatchers to reroute shipments before the delivery SLA is broken."

---

### Q2: Why did you choose client-side Vanilla JavaScript and LocalStorage instead of a heavy backend like Node/Express + MongoDB?
**Answer**:
"We made this deliberate architectural decision for three key reasons:
1. **Zero-Latency & Deployment Reliability**: It can be deployed directly to **GitHub Pages** without server cold-starts, database credential issues, or hosting downtime during evaluation.
2. **Offline-First Resilience**: All changes (creating shipments, updating stages, flagging disruptions) immediately persist in the browser's `localStorage` via JSON serialization.
3. **Clean Code & Modularity**: The entire architecture follows a clean Model-View-Controller (MVC) pattern where `data.js` acts as the initial model, `index.html` as the view, and `app.js` as the controller managing DOM updates and state."

---

### Q3: Can you explain the data structure used to represent a shipment?
**Answer (Datta Sai)**:
"Each shipment is a comprehensive JavaScript object containing:
- `id`: Unique alphanumeric tracking code (e.g., `SHP-2026-8810`).
- `title`, `category`, `priority`, `status`: Core metadata and operational flags.
- `currentStageIndex`: An integer from 0 to 4 mapping to `SUPPLY_CHAIN_STAGES`.
- `origin`, `intermediateHubs[]`, `destination`: Geospatial coordinates (`lat`, `lng`), facility names, and dwell/SLA hours.
- `delayAlert`: An object containing `active` (boolean), `facilityName`, `delayHours`, `cause`, and `impact`.
- `timeline[]`: Array of timestamped checkpoint logs detailing every milestone reached."

---

### Q4: How does the map visualization work?
**Answer (Member 2 - 12629667)**:
"We utilized **Leaflet.js** with OpenStreetMap tiles. In `updateMapForShipment(s)`:
1. We clear any prior markers and route lines using `mapInstance.removeLayer()`.
2. We iterate through the origin, intermediate hubs, and destination coordinates, placing custom colored circle markers (blue for origin, amber/red for hubs, green for destination).
3. We draw an interactive `L.polyline` connecting the nodes. If the shipment is delayed, the polyline turns red with a dashed pattern (`dashArray: '6, 8'`).
4. We calculate the vehicle's current transit position based on `s.currentStageIndex` and place a vehicle marker that pans dynamically into view using `mapInstance.fitBounds()`."

---

### Q5: How does the Bottleneck Analytics section compute dwell time?
**Answer (Member 3 - 12610145)**:
"In the Bottleneck Analytics view, we use **Chart.js**:
1. We compute the average dwell hours spent across the 4 major stages: Supplier Dispatch (6.4h), Inter-state Corridors (18.2h), Regional Warehouses (28.5h), and Last-Mile Delivery (5.1h).
2. We overlay a target SLA line (set at 18h for warehouses). Any bar exceeding this line visually identifies a supply chain bottleneck.
3. We also plot a doughnut chart showing root-cause percentages (42% Warehouse sorting breakdown, 28% Monsoon weather/landslides, etc.) and maintain a Facility Bottleneck Registry table with recommended mitigation plans (e.g. bypass routing)."

---

## 3. Potential Live Code Modifications during Viva
*Examiners often ask students to modify code on the spot to test if they wrote it.*

### Test Case A: "Can you change the delay status threshold or default delay hours from 24h to 48h?"
- **Where to change**: Open [`app.js`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/app.js#L427).
- In function `openDelayModal()`, change `document.getElementById("delayHoursInput").value = 24;` to `48;`.

### Test Case B: "Can you add a new Category (e.g., 'Perishables / Food') to the filter and creation form?"
- **Where to change**: Open [`index.html`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/index.html#L182) and [`index.html`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/index.html#L428).
- Simply add `<option value="Perishables">Perishables / Food</option>` into the `<select>` tags!

### Test Case C: "Can you change the polyline color when a shipment is on schedule?"
- **Where to change**: In [`app.js`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/app.js#L354), locate `mapPolyline = L.polyline(latlngs, { color: isDelayed ? "#ef4444" : "#2563eb" ... })` and change `#2563eb` to `#10b981` (emerald green) or any requested color!

---

## 4. Individual Speaking Roles for Viva

### 1. Datta Sai (Team Leader - 12623781)
- Introduces the team, problem statement, and executive motivation.
- Explains the core architecture: Model (`data.js`), Controller (`app.js`), and LocalStorage sync.
- Demonstrates **Shipment Creation** and **Stage Progression** (Advancing and Reverting).

### 2. Team Member 2 (12629667)
- Explains the UI layout, responsiveness, and Tailwind styling.
- Demonstrates the **Interactive Leaflet Route Map** and **Milestone Track**.
- Explains the **Printable Shipping Manifest / Bill of Lading** generator.

### 3. Team Member 3 (12610145)
- Explains the **Bottleneck Detection Engine** and dwell time calculation.
- Demonstrates the **Bottleneck Alert Banner**, **Chart.js Analytics**, and **History Table**.
- Demonstrates the **CSV / Excel Export** feature.
