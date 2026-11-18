# LogiPulse: Supply Chain Shipment Visibility & Bottleneck Tracking Interface
## CA1 Comprehensive Project-Based Assessment Report
### Course Assessment 1 | Problem Statement #8

---

### Student & Project Identification
- **Student Developer**: Datta Sai
- **Registration Number**: `12623781`
- **Course Code**: `INT219` / Front-End Web Development
- **Assigned Problem Statement #**: 8
- **Project Title**: **LogiPulse – Supply Chain Shipment Visibility & Bottleneck Tracking System**
- **GitHub Repository**: [https://github.com/dattasai2424-code/ca1-shipment-management](https://github.com/dattasai2424-code/ca1-shipment-management)
- **Live Deployed Application**: [https://dattasai2424-code.github.io/ca1-shipment-management/](https://dattasai2424-code.github.io/ca1-shipment-management/)

---

## 1. Abstract & Executive Summary

In contemporary global and domestic commerce, businesses transport high-value goods across interconnected multi-tier supply networks consisting of primary manufacturing factories, inter-state transit corridors, cross-dock consolidation hubs, regional warehouses, and final customer receiving facilities. A persistent industry challenge is the lack of end-to-end operational visibility: logistics coordinators frequently encounter informational blind spots where cargo dwells in transit or regional sorting centers far beyond Service Level Agreements (SLAs) without triggering proactive alerts.

**LogiPulse** is an enterprise-grade, client-side web application developed to resolve this opacity. Built using semantic HTML5, modern Tailwind CSS, Leaflet.js geospatial mapping, Chart.js analytics, and an offline-first browser LocalStorage persistence engine, LogiPulse delivers continuous visibility into consignment journeys across 5 standardized supply chain milestones. The platform incorporates an automated bottleneck detection engine that flags dwell-time SLA violations (threshold: $\le 18$ hours) and operational disruptions (landslides, automated sorting conveyor malfunctions), rendering pulsating geospatial risk indicators and actionable rerouting recommendations. This report presents the comprehensive design, technical architecture, mathematical/algorithmic formulation, implementation details, test suite verification, and viva defense guide for the project.

---

## 2. Problem Definition & Real-World Motivation

### 2.1 The Industry Bottleneck Problem
In supply chain management, operational delays rarely occur during uninterrupted highway or air transit; rather, they accumulate at **stagnation nodes**—intermediate transit hubs and regional sorting warehouses. Key failure modes include:
1. **Opaque Transit Corridors**: Once cargo departs a supplier factory, dispatchers rely on fragmented, delayed phone calls or disconnected carrier portals.
2. **Undetected Facility Stagnation**: Consignments linger in cross-dock sorting queues exceeding allowed dwell windows without alerting management.
3. **Reactive Disruption Response**: Disruptions like monsoon landslides, highway closures, or warehouse equipment breakdowns are only discovered after customer delivery SLAs have already been breached.

### 2.2 Objective & Scope
The primary objective of LogiPulse is to provide an interactive, real-time command dashboard that enables dispatchers and supply chain managers to:
- Register new multimodal shipments with comprehensive cargo, carrier, and SLA parameters.
- Visualize shipment movement along geographic routes connecting suppliers, hubs, and customer facilities.
- Progress shipments through a 5-stage milestone lifecycle with forward advancement and rollback capabilities.
- Automatically detect and highlight facility dwell bottlenecks before customer delivery failure occurs.
- Maintain an auditable, timestamped chronological log of all handling events and checkpoint notes.
- Analyze aggregated dwell times and disruption root-cause distributions through interactive graphical analytics.
- Generate printable multimodal Bills of Lading / Waybills and export master ledger records to CSV/Excel.

---

## 3. Core Functional Requirements Mapping

LogiPulse satisfies 100% of the core requirements stipulated in CA1 Problem Statement #8:

| Core Requirement | Problem Statement Specification | Implementation in LogiPulse | Verification Status |
| :--- | :--- | :--- | :--- |
| **1. Shipment Creation** | Register cargo with origin, destination, carrier, and SLA parameters | Interactive modal form with auto-generated alphanumeric tracking code (`SHP-2026-XXXX`), cargo categorization, weight, declared valuation, carrier partner, and priority tier. | **100% Functional** |
| **2. Origin & Destination** | Show source supplier, intermediate nodes, and destination receiver | Leaflet.js geospatial map plotting color-coded circle markers for supplier plants (blue), intermediate transit/sorting hubs (amber/red), and customer facilities (green) connected by animated path polylines. | **100% Functional** |
| **3. Transport Stage Tracking** | Display active phase in supply chain movement | 5-stage standardized milestone pipeline: `Supplier Dispatched` $\rightarrow$ `In Transit / Gateway Hub` $\rightarrow$ `Regional Warehouse Hub` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered to Customer`. Includes dynamic "Advance Stage" and "Revert Stage" controls. | **100% Functional** |
| **4. Status Timeline** | Chronological audit trail of handling events | Vertical checkpoint timeline rendering timestamps, facility names, transit notes, and an interactive field update form for live audit note injection. | **100% Functional** |
| **5. Delay Alerts & Bottlenecks** | Identify dwell bottlenecks and delays across supply chain | Automated detection when hub dwell hours exceed SLA threshold ($18.0$ hours). Features a prominent top alert banner, red pulsating badges, disruption category tagging, and delay resolution workflows. | **100% Functional** |
| **6. Shipment History** | Master archive of past and current consignments | Master Ledger table with multi-parameter search, status filter pills (All, In Transit, Delayed, Delivered), category dropdowns, printable waybill generator, and 1-click CSV/Excel export. | **100% Functional** |

---

## 4. System Architecture & Engineering Design

### 4.1 Architectural Pattern: Client-Side MVC
LogiPulse employs a modular **Model-View-Controller (MVC)** architectural pattern optimized for zero-latency client-side execution and 100% reliable deployment on static hosting platforms (such as GitHub Pages):

```
+-------------------------------------------------------------------------+
|                               VIEW LAYER                                |
|  - Semantic HTML5 Dashboard Layout (index.html)                         |
|  - Tailwind CSS + Custom CSS Design System (style.css)                   |
|  - Leaflet.js Geospatial OpenStreetMap Viewport                         |
|  - Chart.js Analytical Canvas (Dwell Latency & Root-Cause Doughnut)     |
|  - Multimodal Bill of Lading Printable Modal                            |
+------------------------------------+------------------------------------+
                                     | Event Triggers & DOM Binding
                                     v
+-------------------------------------------------------------------------+
|                            CONTROLLER LAYER                             |
|  - Application Engine (app.js)                                          |
|  - State Manager: selectShipment(), advanceStage(), handleDelay()       |
|  - Map Controller: updateMapForShipment(), fitBounds()                  |
|  - Analytics Controller: renderDwellChart(), renderCausesChart()        |
|  - CSV/Excel Export & Print Manifest Engine                             |
+------------------------------------+------------------------------------+
                                     | Bidirectional Data Binding
                                     v
+-------------------------------------------------------------------------+
|                               MODEL LAYER                               |
|  - In-Memory Data Store (shipments[], SUPPLY_CHAIN_STAGES, PRESET_HUBS) |
|  - Seed Dataset (data.js)                                               |
|  - Browser LocalStorage Engine ("logipulse_shipments")                   |
|  - Offline-First Serialization & Deserialization                        |
+-------------------------------------------------------------------------+
```

### 4.2 State Persistence & Offline-First Design
To ensure resilience across page refreshes and browser sessions, all CRUD operations trigger synchronous serialization to browser `localStorage` under the key `logipulse_shipments`. If local storage is empty, the engine automatically hydrates from `DEFAULT_SHIPMENTS` defined in `data.js`. A "Reset Data" control enables one-click restoration to the pristine evaluation state.

### 4.3 Algorithmic Dwell-Time Bottleneck Detection
The bottleneck detection algorithm evaluates each consignment's intermediate hubs against defined Service Level Agreements:

$$\text{IsBottleneck}(H) = (DwellHours(H) > SLAHours(H)) \lor (DelayAlert.active == \text{True})$$

When an active bottleneck is confirmed:
1. Status is updated to `Delayed`.
2. A pulsing red CSS animation (`delay-pulse-badge`) is attached to the consignment card and map pin.
3. The polyline connector transitions from solid primary blue (`#2563eb`) to dashed danger red (`#ef4444`, `dashArray: '6, 8'`).
4. The global emergency warning banner is populated with facility details and dwell latency.

---

## 5. User Interface & Interactive Experience

### 5.1 Color Palette & Visual Hierarchy
LogiPulse uses an ergonomic dark-theme palette engineered for industrial command centers:
- **Base Background**: `#0b0f19` (High-contrast deep obsidian)
- **Surface Cards**: `#111827` (Card dark with `#1f2937` borders)
- **Primary Brand**: `#3b82f6` (Electric Blue for active corridors and positive milestones)
- **Warning / At Risk**: `#f59e0b` (Amber for SLA proximity warnings)
- **Bottleneck / Danger**: `#ef4444` (Crimson with radial pulsing CSS animation for delays)
- **Delivered / Success**: `#10b981` (Emerald for verified customer delivery)

### 5.2 Key Dashboard Views
1. **Live Tracking & Maps View**: Multi-column command center featuring the KPI bar, search and category filters, shipment roster list, milestone visualizer, Leaflet interactive map, logistics specs grid, and chronological checkpoint timeline.
2. **Bottleneck Analytics View**: Chart.js data visualizations displaying average dwell hours vs SLA targets across supply chain nodes and disruption root-cause distributions.
3. **Shipment History View**: Master ledger archiving all consignments with direct tracking links, waybill generator, and CSV export.
4. **Project Details & Viva View**: Project overview, problem statement alignment, and comprehensive technical viva notes.

---

## 6. Verification Suite & Test Cases

The application has been validated against 10 comprehensive test scenarios:

| Test ID | Test Scenario | Inputs / User Action | Expected Output | Actual Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Initial Data Hydration | Page load with empty localStorage | Default sample shipments hydrate; KPI counters display accurate initial metrics. | **PASSED** |
| **TC-02** | Consignment Creation | Submit "New Shipment" modal with valid specifications | New tracking ID (`SHP-2026-XXXX`) generated; saved to LocalStorage; prepended to roster list. | **PASSED** |
| **TC-03** | Stage Progression | Click "Advance Stage" | Milestone index increments; milestone track advances; timestamped event appended to timeline. | **PASSED** |
| **TC-04** | Stage Rollback | Click "Revert Stage" | Milestone index decrements; previous location restored; status updated. | **PASSED** |
| **TC-05** | Delivery Completion | Advance shipment to Stage 4 | Status updates to `Delivered`; milestone icon renders green checkmark; delivery rate KPI recalculates. | **PASSED** |
| **TC-06** | Bottleneck Flagging | Submit "Bottleneck Action" modal with 24h delay | Status transitions to `Delayed`; emergency banner displays; map polyline renders dashed red. | **PASSED** |
| **TC-07** | Delay Resolution | Click "Resolve Delay" button | Status restored to `On Schedule`; emergency banner clears; resolution note logged in audit trail. | **PASSED** |
| **TC-08** | Multi-Parameter Search | Type city name (e.g., "Hosur") into search input | Roster filters dynamically to show matching origins, destinations, and consignment titles. | **PASSED** |
| **TC-09** | CSV / Excel Export | Click "Export to CSV" | Browser initiates download of `LogiPulse_Shipment_Ledger_YYYY-MM-DD.csv` containing full records. | **PASSED** |
| **TC-10** | Printable Waybill | Click "Print Manifest" icon | Multimodal Bill of Lading modal opens with formatted carrier, shipper, consignee, and sign-off sections. | **PASSED** |

---

## 7. Viva Defense & Technical Q&A Guide (10 Marks)

### Q1: What makes LogiPulse different from a basic courier tracker?
**Answer**: Basic courier trackers only notify users of simple status strings ("in transit" or "delivered"). LogiPulse is an operational **supply chain visibility and bottleneck intelligence system**. It models multimodal transport routes, calculates node-specific dwell times against contractual SLAs (18h threshold), highlights geographic bottlenecks on interactive maps, supports real-time stage progression/reversal, and performs aggregate dwell analytics using Chart.js.

### Q2: Why was client-side Vanilla ES6 JavaScript chosen instead of a framework like React or Angular?
**Answer**: For this assessment, Vanilla ES6 JavaScript with modular separation (`data.js`, `app.js`, `style.css`) ensures zero build overhead, instant compilation, minimal bundle footprint (<60 KB), and 100% reliable deployment on GitHub Pages without server cold-starts or backend database downtime during faculty evaluation.

### Q3: How does the Leaflet.js route polyline dynamically reflect delay status?
**Answer**: In `app.js`, `updateMapForShipment(s)` checks whether `s.status === "Delayed"` or `s.delayAlert.active === true`. If delayed, the polyline style is dynamically set to `color: "#ef4444"` with `dashArray: "6, 8"`, visually signaling a bottlenecked corridor. When on schedule, it renders as a solid blue corridor (`color: "#2563eb"`).

### Q4: How is data persisted when creating or modifying consignments?
**Answer**: The application uses browser `localStorage` with JSON serialization. Whenever an action occurs (creating a shipment, advancing a milestone, logging a bottleneck, or adding a checkpoint), `saveShipments()` writes the updated JavaScript array to `localStorage.setItem("logipulse_shipments", JSON.stringify(shipments))`, persisting changes across page reloads.

### Q5: How would you demonstrate live code modification during the viva?
**Answer**: 
- *To modify the dwell SLA threshold*: In `app.js`, adjust the `slaHours` comparison in `updateKPIs()` or update the default hours in `openDelayModal()`.
- *To add a new cargo category*: In `index.html`, add `<option value="Perishables">Perishables / Cold Chain</option>` in both the filter dropdown and the creation modal dropdown.

---

## 8. Deployment & Repository Information

- **Live Deployed Application**: [https://dattasai2424-code.github.io/ca1-shipment-management/](https://dattasai2424-code.github.io/ca1-shipment-management/)
- **GitHub Repository**: [https://github.com/dattasai2424-code/ca1-shipment-management](https://github.com/dattasai2424-code/ca1-shipment-management)
- **Branch**: `main`
- **Hosting Engine**: GitHub Pages (Continuous deployment from root)
- **Local Launch Script**: Double-click `run_project.bat` or open `index.html` in any modern web browser.
