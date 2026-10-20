# LogiPulse: Supply Chain Shipment Visibility & Bottleneck Tracking Interface
## CA1 Project-Based Assessment Report (Course Assessment 1)

---

### Team Information
- **Assigned Problem Statement #**: 8
- **Project Title**: LogiPulse - Supply Chain Shipment Visibility & Bottleneck Tracking Interface
- **Team Name**: `dattasai`
- **Team Leader**: Datta Sai (Registration No: `12623781`)
- **Team Member 2**: Registration No: `12629667`
- **Team Member 3**: Registration No: `12610145`

---

## 1. Executive Summary & Problem Motivation

### 1.1 The Industry Problem
In contemporary logistics and multi-tier supply chains, goods flow through complex distributed networks involving primary suppliers/factories, inter-state transit corridors, cross-dock consolidation hubs, regional warehouses, and final customer delivery points. 

However, supply chain managers frequently encounter significant blind spots:
1. **Opaque Transit Corridors**: Once goods leave a supplier, tracking status is often delayed or disconnected.
2. **Undetected Stagnation & Bottlenecks**: Shipments dwell inside consolidation hubs or regional sorting centers far beyond Service Level Agreements (SLAs) without alerting operators.
3. **Reactive Issue Handling**: Disruptions like highway landslides, port congestions, or sorting conveyor equipment failures are addressed only after customer delivery SLA has already been breached.

### 1.2 Project Objective
To develop a responsive, client-side web application interface (**LogiPulse**) that provides end-to-end operational visibility into goods movement across the supply chain, highlights real-time transport stages, automatically detects dwell bottlenecks against SLA thresholds, and maintains an auditable status history.

---

## 2. Core Functional Requirements Mapping

| Requirement | Implementation in LogiPulse | Technical Component |
| :--- | :--- | :--- |
| **1. Shipment Creation** | Modal form to register consignments with auto-generated unique ID (`SHP-2026-XXXX`), cargo category, weight, declared value, carrier partner, priority tier, and SLA delivery date. | `handleCreateShipmentSubmit()` & Form Validation |
| **2. Origin & Destination** | Clear geographic tracking from supplier plants to customer facilities with interactive coordinates, city routing, and visual node cards. | Leaflet.js interactive maps & SVG supply chain cards |
| **3. Transport Stage Tracking** | 5-stage progressive milestone system: (1) Supplier Dispatched ➔ (2) In Transit ➔ (3) Regional Warehouse ➔ (4) Out for Delivery ➔ (5) Delivered. Includes dynamic "Advance Stage" and "Revert Stage". | `advanceCurrentShipmentStage()` & Milestone visualizer |
| **4. Status Timeline** | Chronological audit trail showing timestamps, checkpoint locations, handling notes, and field operators. Includes interactive live check-in form. | `renderTimeline()` & `addManualCheckpointLog()` |
| **5. Delay Alerts & Bottlenecks** | Automated bottleneck alerts when hub dwell time exceeds SLA (18 hours) or upon operational disruptions (landslides, conveyor breakdowns). Highlights affected hubs on map and UI. | Dwell time algorithm & `handleDelaySubmit()` |
| **6. Shipment History** | Master historical ledger table with multi-parameter search, filtering by status/category, and one-click CSV/Excel export. | `exportShipmentsToCSV()` & `renderHistoryTable()` |

---

## 3. System Architecture & Technical Design

### 3.1 Technology Stack
- **User Interface (UI)**: HTML5 Semantic Markup, Tailwind CSS utility classes, custom CSS variables with responsive desktop/tablet/mobile layouts.
- **Geospatial Route Visualization**: Leaflet.js OpenStreetMap API rendering interactive pins, route polylines, and pulsing vehicle position markers.
- **Supply Chain Analytics**: Chart.js rendering dwell time comparisons vs SLA targets and delay root-cause distributions.
- **Data Persistence**: Browser `localStorage` engine enabling full CRUD persistence without requiring complex external backend servers (ideal for 100% reliable GitHub Pages deployment).
- **Icons & Audio Feedback**: Lucide Icons and native HTML5 Web Audio API chimes for operational alerts.

### 3.2 Data Flow Architecture
```
[User Action: Create / Advance / Flag Delay]
                     │
                     ▼
             [app.js Controller]
       ┌─────────────┴─────────────┐
       ▼                           ▼
[localStorage State Engine]  [Event Logger & Timeline]
       │                           │
       ├─────────────┬─────────────┤
       ▼             ▼             ▼
[UI Roster]   [Leaflet Map]   [Chart.js Analytics]
```

---

## 4. Work Distribution & Individual Contributions

### 1. Datta Sai (Registration No: 12623781) - Team Leader
- Overall System Architecture & Data Schema design.
- Core shipment CRUD engine and state persistence in `localStorage`.
- Stage advancement and rollback logic with automated timeline timestamping.
- Project deployment to GitHub Pages and CA1 submission coordination.

### 2. Team Member 2 (Registration No: 12629667)
- Responsive multi-panel Dashboard UI/UX styling using Tailwind CSS.
- Interactive Leaflet.js map route visualization and polyline rendering.
- 5-stage Supply Chain milestone track component.
- Printable Bill of Lading / Consignment Waybill modal.

### 3. Team Member 3 (Registration No: 12610145)
- Automated bottleneck detection algorithm comparing dwell time against SLA thresholds.
- Chart.js analytics for stage dwell latency and delay root-cause distribution.
- Master Shipment Ledger history table and CSV/Excel data export utility.
- Test cases and viva documentation preparation.

---

## 5. Verification & Test Cases

| Test Case ID | Test Scenario | Expected Outcome | Result |
| :--- | :--- | :--- | :--- |
| **TC-01** | Register new shipment via Modal | New `SHP-2026-XXXX` created, saved to LocalStorage, and displayed in roster. | Passed |
| **TC-02** | Advance transport stage | Current stage moves from "Supplier Dispatched" to "In Transit"; timeline adds timestamped event. | Passed |
| **TC-03** | Flag critical bottleneck | Shipment status changes to "Delayed"; red pulsing alert badge appears on card and map. | Passed |
| **TC-04** | Resolve active delay | Status returns to "On Schedule"; alert banner clears; resolution note added to audit trail. | Passed |
| **TC-05** | Filter by "Delayed" | Only consignments experiencing bottlenecks/delays are listed in the roster. | Passed |
| **TC-06** | Export to CSV | Formatted `.csv` file downloads containing full consignment fields. | Passed |

---

## 6. Deployment & Submission Links
- **GitHub Repository**: `https://github.com/dattasai2424-code/ca1-shipment-management`
- **Live Deployed Application (GitHub Pages)**: `https://dattasai2424-code.github.io/ca1-shipment-management/`
- **Video Presentation URL**: `https://youtu.be/ca1-shipment-demo`
