# LogiPulse: Supply Chain Shipment Visibility & Bottleneck Tracking Interface
### CA1 Project-Based Assessment | Problem Statement #8
### Group Name: `dattasai`

---

## 👥 Team Information
- **Team Leader**: Datta Sai (Registration No: `12623781`)
- **Team Member 2**: Registration No: `12629667`
- **Team Member 3**: Registration No: `12610145`
- **Assigned Problem Statement**: Businesses moving goods between suppliers, warehouses, and customers need visibility into shipment stages to identify delays and bottlenecks.
- **Project Objective**: Create a shipment-management interface showing the movement of goods across the supply chain.

---

## 🚀 Quick Start (Running Locally)
This project is built with zero build step dependencies (HTML5, Tailwind CSS, Leaflet.js, Chart.js, ES6 JavaScript).

### Option 1: One-Click Windows Launcher
Double-click [`open_dashboard.bat`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/open_dashboard.bat) or [`run_project.bat`](file:///c:/Users/datta/Downloads/intro/run_project.bat).

### Option 2: Direct File Open
Double-click [`index.html`](file:///c:/Users/datta/Downloads/intro/ca1-shipment-management/index.html) in any browser (Google Chrome, Microsoft Edge, Firefox, Brave).

---

## 🌐 2-Minute Deployment to GitHub Pages
To satisfy the CA1 deployment rubric requirement:

1. Create a new repository on your GitHub account (e.g. `ca1-shipment-management`).
2. Inside this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for CA1 Problem Statement #8 - Team dattasai"
   git branch -M main
   git remote add origin https://github.com/dattasai2424-code/ca1-shipment-management.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings** > **Pages**.
4. Under **Branch**, select `main` branch and `/ (root)` folder, then click **Save**.
5. Your project will be live in 60 seconds at:
   `https://dattasai2424-code.github.io/ca1-shipment-management/`

---

## 📦 Core Functional Features
1. **Shipment Creation Modal**: Create new consignments with automated tracking codes (`SHP-2026-XXXX`), origin supplier plants, destination customer sites, transport modes (Air, Road, Rail, Maritime), and SLA delivery dates.
2. **Interactive Geographic Corridor Map (Leaflet.js)**: Displays origin, transit hubs, and destination waypoints with route lines that turn red/dashed upon delay, and live vehicle location pin.
3. **5-Stage Supply Chain Milestone Track**: Visual step progress:
   - `Supplier Dispatched` ➔ `In Transit` ➔ `Regional Warehouse Hub` ➔ `Out for Delivery` ➔ `Delivered`
4. **Automated Bottleneck Detection & Dwell Alerts**: Proactive alert banner and pulsing flags when hub dwell times exceed SLA (18 hours) or upon operational disruptions.
5. **Interactive Status Timeline**: Chronological checkpoint logs with an interactive "Add Checkpoint Note" form for live viva demonstrations.
6. **Supply Chain Analytics (Chart.js)**: Average dwell time latency vs SLA threshold bar chart, and delay root cause distribution doughnut chart.
7. **Master Shipment History & CSV Export**: Complete historical ledger with one-click `.csv` export.
8. **Printable Shipping Manifest / Bill of Lading**: Enterprise-grade printable waybill for consignment proof.

---

## 📁 Repository Structure
```
ca1-shipment-management/
├── index.html                   # Main Responsive Dashboard Application
├── style.css                    # Custom CSS, animations, and Leaflet overrides
├── app.js                       # Core Controller, State, Routing & Analytics Logic
├── data.js                      # Pre-seeded Supply Chain Datasets & Hub Presets
├── CA1_Submission_DattaSai.xlsx # Official Excel Submission Template (Page 3 format)
├── PROJECT_REPORT.md            # Academic Project Report for CA1 Assessment
├── VIVA_PREPARATION_GUIDE.md    # 10-Mark Viva Questions, Answers & Code Walkthrough
├── VIDEO_PRESENTATION_SCRIPT.md # 5-Mark Video Presentation Script (All 3 Members)
├── README.md                    # Setup and Deployment Guide
└── open_dashboard.bat           # 1-Click Windows Launcher Batch File
```

---

## 🎯 Evaluation Rubrics Coverage (30 Marks)
- **Functionality & User Interface (15 Marks)**: Fully implemented 6 core requirements, modern responsive dark/light UI, error handling, audio feedback, and local storage persistence.
- **Viva (10 Marks)**: Comprehensive guide with answers, architecture diagrams, and prepared live code modifications in `VIVA_PREPARATION_GUIDE.md`.
- **Video Presentation (5 Marks)**: Complete script for all 3 members with exact timings and demonstration cues in `VIDEO_PRESENTATION_SCRIPT.md`.
- **Mandatory Submission**: `CA1_Submission_DattaSai.xlsx` prepared in exact format requested by the instructions.
