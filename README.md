# LogiPulse: Supply Chain Shipment Visibility & Bottleneck Tracking Interface
### CA1 Project-Based Assessment | Problem Statement #8

---

## Student Information
- **Student Developer**: Datta Sai
- **Registration Number**: 12623781
- **Course**: INT219 Front-End Web Development
- **Assigned Problem Statement**: Businesses moving goods between suppliers, warehouses, and customers need visibility into shipment stages to identify delays and bottlenecks.
- **Reporting Period**: November 2026 (Q4 Supply Chain Cycle)

---

## Project Overview
LogiPulse is a clean, native front-end web interface developed to provide complete stage visibility for multimodal supply chains moving goods between suppliers, transit hubs, regional warehouses, and customers.

### Key Capabilities
1. **Shipment Creation**: Form to log new consignments with ID, cargo description, origin supplier, destination customer, and carrier.
2. **Origin to Destination Visibility**: Real-time status for suppliers (e.g., Pune), transit hubs (Navi Mumbai), regional warehouses (Nagpur), and customer delivery points (Hosur).
3. **5-Stage Transport Milestone Tracking**:
   - Stage 1: Supplier Dispatched
   - Stage 2: In Transit Hub
   - Stage 3: Regional Warehouse
   - Stage 4: Out for Delivery
   - Stage 5: Delivered
4. **Visual Milestone Tracker**: Step progress circles that dynamically transition to completed or active states.
5. **Bottleneck & Delay Alerts**: High-visibility warning alert for facilities experiencing equipment failure or dwell backlog.
6. **Shipment History & Filters**: Searchable, filterable data table for immediate consignment tracking.

---

## File Structure
- `index.html`: Semantic HTML5 structure with native SVG icons and accessibility.
- `style.css`: Clean, standard CSS styling, aligned grid cards, and zero glowing effects.
- `app.js`: Pure JavaScript implementing 5-stage tracking, search, filtering, and bottleneck management.
- `open_dashboard.bat`: 1-click Windows launcher to open the interface.

---

## Quick Start (Running Locally)
Double-click `open_dashboard.bat` or open `index.html` in any modern web browser.
