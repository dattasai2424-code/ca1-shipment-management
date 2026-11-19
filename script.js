/* ==========================================================================
   LogiPulse - Supply Chain Shipment Management Interface
   Student Developer: Datta Sai (Registration No: 12623781)
   Course: INT219 / Front-End Web Development | Problem Statement #8
   ========================================================================== */

// 1. Initial Default Sample Data (Hydrated if LocalStorage is empty)
const DEFAULT_SHIPMENTS = [
  {
    id: "SHP-2026-8810",
    title: "High-Precision Industrial Microcontrollers",
    category: "Electronics",
    priority: "Urgent",
    status: "Delayed", // "On Schedule", "Delayed", "In Transit", "Delivered"
    carrier: "BlueDart Express",
    transportMode: "Road Express",
    weight: "450 kg",
    packages: 35,
    value: "₹ 18,50,000",
    estimatedDelivery: "2026-10-21",
    currentStageIndex: 2, // 0: Supplier Dispatched, 1: In Transit Hub, 2: Regional Warehouse, 3: Out for Delivery, 4: Delivered
    origin: "Foxconn Plant (Pune, Maharashtra)",
    destination: "Tata Electronics (Hosur, Tamil Nadu)",
    nodes: [
      { name: "Foxconn Factory", city: "Pune", type: "Origin Supplier", role: "origin" },
      { name: "Navi Mumbai Gateway", city: "Navi Mumbai", type: "Transit Hub", role: "hub", dwell: 14, sla: 12 },
      { name: "Nagpur Consolidation Hub", city: "Nagpur", type: "Regional Warehouse", role: "bottleneck", dwell: 42, sla: 18 },
      { name: "Tata Assembly Plant", city: "Hosur", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: {
      active: true,
      facility: "Nagpur Central Consolidation Warehouse",
      cause: "Automated conveyor sorting breakdown at bay #4",
      hours: 24,
      impact: "Arrival pushed back by 1.5 days. Rerouting via South corridor recommended."
    },
    timeline: [
      { stage: "Order Created & Cargo Verified", location: "Pune Factory Bay 3", time: "Oct 14, 09:30 AM", note: "Cargo weighed (450 kg) and verified." },
      { stage: "Dispatched from Supplier", location: "Pune Gateway Toll", time: "Oct 14, 02:45 PM", note: "Handed over to BlueDart fleet truck MH-12-Q-4491." },
      { stage: "Reached Transit Hub", location: "Navi Mumbai Gateway", time: "Oct 15, 08:20 AM", note: "Cross-dock inspection passed and barcoded." },
      { stage: "Arrived at Regional Warehouse", location: "Nagpur Consolidation Hub", time: "Oct 16, 11:30 AM", note: "⚠️ BOTTLENECK ALERT: Sorter line malfunction. Dwell time: 42h (SLA: 18h)." }
    ]
  },
  {
    id: "SHP-2026-9042",
    title: "Temperature-Controlled Cardiac Vaccines",
    category: "Pharmaceuticals",
    priority: "Urgent",
    status: "On Schedule",
    carrier: "DHL Global ColdChain",
    transportMode: "Air Freight",
    weight: "120 kg",
    packages: 8,
    value: "₹ 42,00,000",
    estimatedDelivery: "2026-10-21",
    currentStageIndex: 1,
    origin: "Bharat Biotech Bio-Park (Hyderabad)",
    destination: "AIIMS Apex Medical Center (New Delhi)",
    nodes: [
      { name: "Bharat Biotech Plant", city: "Hyderabad", type: "Origin Supplier", role: "origin" },
      { name: "Hyderabad Air Cargo Hub", city: "Shamshabad", type: "Transit Hub", role: "hub", dwell: 6, sla: 8 },
      { name: "Delhi Cold Chain Bay", city: "New Delhi", type: "Regional Hub", role: "hub", dwell: 5, sla: 8 },
      { name: "AIIMS Apex Center", city: "New Delhi", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: { active: false, facility: "", cause: "", hours: 0, impact: "" },
    timeline: [
      { stage: "Cold Storage Validation", location: "Genome Valley, Hyderabad", time: "Oct 18, 07:00 AM", note: "Temperature logged at -20°C with tamper seals." },
      { stage: "Dispatched from Supplier", location: "Hyderabad Facility", time: "Oct 18, 10:15 AM", note: "Loaded into dedicated Reefer van DL-1C-5092." },
      { stage: "Air Transit Transfer", location: "RGIA Air Cargo Bay", time: "Oct 19, 01:40 PM", note: "Boarding express flight to New Delhi terminal." }
    ]
  },
  {
    id: "SHP-2026-7231",
    title: "Electric Vehicle Lithium Battery Packs",
    category: "Automotive",
    priority: "Express",
    status: "Delayed",
    carrier: "Delhivery Freight",
    transportMode: "Road Express",
    weight: "2,800 kg",
    packages: 12,
    value: "₹ 34,20,000",
    estimatedDelivery: "2026-10-19",
    currentStageIndex: 1,
    origin: "Exide Gigafactory (Bengaluru)",
    destination: "Mahindra EV Plant (Chakan, Pune)",
    nodes: [
      { name: "Exide Yard", city: "Bengaluru", type: "Origin Supplier", role: "origin" },
      { name: "Belagavi Transshipment Hub", city: "Belagavi", type: "Transit Hub", role: "bottleneck", dwell: 38, sla: 16 },
      { name: "Mahindra EV Plant", city: "Chakan, Pune", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: {
      active: true,
      facility: "Belagavi Highway Transshipment Hub",
      cause: "Severe NH-48 monsoon landslide and highway lane closures",
      hours: 32,
      impact: "Production line at Chakan plant alerted for 36-hour schedule buffer."
    },
    timeline: [
      { stage: "HAZMAT Clearance", location: "Exide Bengaluru Yard", time: "Oct 12, 11:00 AM", note: "Class 9 hazardous battery compliance certified." },
      { stage: "Dispatched from Supplier", location: "Hosur Road Checkpost", time: "Oct 13, 04:00 PM", note: "Multi-axle flatbed trailer KA-01-E-9021 departed." },
      { stage: "In Transit Bottleneck", location: "Belagavi Hub", time: "Oct 15, 08:00 AM", note: "⚠️ HIGHWAY ALERT: Landslide near border. Dwell: 38h." }
    ]
  },
  {
    id: "SHP-2026-5520",
    title: "Organic Cotton Apparel Consignment",
    category: "Textiles",
    priority: "Standard",
    status: "Delivered",
    carrier: "TCI Freight",
    transportMode: "Road Express",
    weight: "1,400 kg",
    packages: 85,
    value: "₹ 9,50,000",
    estimatedDelivery: "2026-10-15",
    currentStageIndex: 4,
    origin: "Textile Mills (Coimbatore)",
    destination: "Zara Distribution Hub (Chennai)",
    nodes: [
      { name: "Coimbatore Mills", city: "Coimbatore", type: "Origin Supplier", role: "origin" },
      { name: "Salem Transit Hub", city: "Salem", type: "Transit Hub", role: "hub", dwell: 10, sla: 14 },
      { name: "Chennai Fulfillment Depot", city: "Chennai", type: "Regional Warehouse", role: "hub", dwell: 12, sla: 16 },
      { name: "Zara Retail Hub", city: "Chennai", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: { active: false, facility: "", cause: "", hours: 0, impact: "" },
    timeline: [
      { stage: "Packed & Sealed", location: "Coimbatore Mills", time: "Oct 08, 08:30 AM", note: "Palletized with RFID tracking tags." },
      { stage: "Dispatched from Supplier", location: "Coimbatore Toll", time: "Oct 09, 11:00 AM", note: "Vehicle TN-37-AA-3841 departed." },
      { stage: "Transit Cross-dock", location: "Salem Hub", time: "Oct 10, 03:30 PM", note: "Passed inspection without delay." },
      { stage: "Regional Warehouse Sorting", location: "Chennai Depot", time: "Oct 12, 09:15 AM", note: "Sorted to urban last-mile delivery fleet." },
      { stage: "Delivered to Customer", location: "Zara Retail Hub", time: "Oct 14, 04:30 PM", note: "Proof of Delivery signed by store manager." }
    ]
  },
  {
    id: "SHP-2026-6194",
    title: "5G Telecom Network Tower Modules",
    category: "Telecom",
    priority: "Express",
    status: "On Schedule",
    carrier: "Gati-KWE Logistics",
    transportMode: "Heavy Rail",
    weight: "5,400 kg",
    packages: 28,
    value: "₹ 62,00,000",
    estimatedDelivery: "2026-10-22",
    currentStageIndex: 2,
    origin: "Sterlite Telecom Plant (Aurangabad)",
    destination: "Jio Data Center (Jaipur)",
    nodes: [
      { name: "Aurangabad Factory", city: "Aurangabad", type: "Origin Supplier", role: "origin" },
      { name: "Surat Logistics Park", city: "Surat", type: "Transit Hub", role: "hub", dwell: 11, sla: 14 },
      { name: "Ahmedabad Western Terminal", city: "Ahmedabad", type: "Regional Warehouse", role: "hub", dwell: 19, sla: 22 },
      { name: "Jio Data Center", city: "Jaipur", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: { active: false, facility: "", cause: "", hours: 0, impact: "" },
    timeline: [
      { stage: "Cargo Verification", location: "Aurangabad Yard", time: "Oct 15, 10:00 AM", note: "Heavy frames secured on rail wagons." },
      { stage: "Dispatched from Supplier", location: "Aurangabad Station", time: "Oct 16, 02:00 PM", note: "Container GJ-05-BX-1120 departed." },
      { stage: "Regional Warehouse Sorting", location: "Ahmedabad Terminal", time: "Oct 19, 09:00 AM", note: "Dwell time 19h (within 22h SLA limit)." }
    ]
  },
  {
    id: "SHP-2026-4402",
    title: "Aerospace Titanium Hydraulic Valves",
    category: "Electronics",
    priority: "Urgent",
    status: "On Schedule",
    carrier: "FedEx Critical",
    transportMode: "Air Freight",
    weight: "85 kg",
    packages: 4,
    value: "₹ 55,00,000",
    estimatedDelivery: "2026-10-21",
    currentStageIndex: 3,
    origin: "HAL Aerospace Division (Bengaluru)",
    destination: "Boeing Hyderabad MRO Center",
    nodes: [
      { name: "HAL Aerospace Plant", city: "Bengaluru", type: "Origin Supplier", role: "origin" },
      { name: "Kempegowda Air Cargo", city: "Bengaluru", type: "Transit Hub", role: "hub", dwell: 4, sla: 6 },
      { name: "Rajiv Gandhi Air Logistics", city: "Hyderabad", type: "Regional Hub", role: "hub", dwell: 3, sla: 6 },
      { name: "Boeing MRO Facility", city: "Hyderabad", type: "Destination Customer", role: "destination" }
    ],
    delayAlert: { active: false, facility: "", cause: "", hours: 0, impact: "" },
    timeline: [
      { stage: "Security Clearance", location: "HAL Tech Bay", time: "Oct 19, 06:00 AM", note: "Aircraft-on-ground critical tag assigned." },
      { stage: "Supplier Dispatch", location: "Bengaluru City", time: "Oct 19, 08:30 AM", note: "Escorted transport to airport." },
      { stage: "Air Cargo Flight", location: "BLR to HYD", time: "Oct 19, 02:00 PM", note: "Flight landed at Rajiv Gandhi International." },
      { stage: "Out for Final Delivery", location: "Gachibowli Corridor", time: "Oct 20, 09:30 AM", note: "In FedEx Priority Van TS-09-UB-8822." }
    ]
  }
];

// 5 Standardized Supply Chain Stages
const STAGES = [
  "Supplier Dispatched",
  "In Transit Hub",
  "Regional Warehouse",
  "Out for Delivery",
  "Delivered to Customer"
];

// 2. Global State Variables
let shipments = [];
let currentShipmentId = null;
let currentFilter = "All";

// 3. Application Initialization
window.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateKPIs();
  renderShipments();
  if (shipments.length > 0) {
    selectShipment(shipments[0].id);
  }
  renderHistoryTable();

  // Set default delivery date in modal to 4 days ahead
  const d = new Date();
  d.setDate(d.getDate() + 4);
  document.getElementById("newDeliveryDate").value = d.toISOString().split("T")[0];
});

// 4. Persistence: Load and Save using LocalStorage
function loadData() {
  const saved = localStorage.getItem("logipulse_shipments");
  if (saved) {
    try {
      shipments = JSON.parse(saved);
    } catch (e) {
      shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    }
  } else {
    shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    saveData();
  }
}

function saveData() {
  localStorage.setItem("logipulse_shipments", JSON.stringify(shipments));
  updateKPIs();
}

function resetDefaultData() {
  if (confirm("Reset to default demonstration shipments?")) {
    shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    saveData();
    renderShipments();
    if (shipments.length > 0) selectShipment(shipments[0].id);
    renderHistoryTable();
    alert("Data reset to default successfully!");
  }
}

// 5. Navigation Tab Switcher
function switchTab(tabName) {
  // Hide all tab views
  const tabs = document.querySelectorAll(".tab-view");
  tabs.forEach(t => t.classList.remove("active"));

  // Deactivate all nav buttons
  const btns = document.querySelectorAll(".nav-btn");
  btns.forEach(b => b.classList.remove("active"));

  if (tabName === "dashboard") {
    document.getElementById("tabDashboard").classList.add("active");
    btns[0].classList.add("active");
  } else if (tabName === "analytics") {
    document.getElementById("tabAnalytics").classList.add("active");
    btns[1].classList.add("active");
  } else if (tabName === "history") {
    document.getElementById("tabHistory").classList.add("active");
    btns[2].classList.add("active");
    renderHistoryTable();
  } else if (tabName === "details") {
    document.getElementById("tabDetails").classList.add("active");
    btns[3].classList.add("active");
  }
}

// 6. Calculate & Update KPI Metrics
function updateKPIs() {
  const total = shipments.length;
  const inTransit = shipments.filter(s => s.currentStageIndex > 0 && s.currentStageIndex < 4).length;
  const delayed = shipments.filter(s => s.status === "Delayed" || (s.delayAlert && s.delayAlert.active)).length;
  const delivered = shipments.filter(s => s.status === "Delivered" || s.currentStageIndex === 4).length;

  document.getElementById("kpiTotal").innerText = total;
  document.getElementById("kpiInTransit").innerText = inTransit;
  document.getElementById("kpiDelayed").innerText = delayed;

  const rate = total > 0 ? (((total - delayed) / total) * 100).toFixed(1) : "100.0";
  document.getElementById("kpiDeliveredRate").innerText = rate + "%";

  document.getElementById("countAll").innerText = total;
  document.getElementById("countActive").innerText = inTransit;
  document.getElementById("countDelayed").innerText = delayed;
  document.getElementById("countDelivered").innerText = delivered;

  // Manage Delay Alert Banner visibility
  const banner = document.getElementById("delayBanner");
  const delayedItems = shipments.filter(s => s.delayAlert && s.delayAlert.active);
  if (delayedItems.length > 0) {
    banner.style.display = "flex";
    const item = delayedItems[0];
    document.getElementById("delayBannerText").innerText = 
      `${item.delayAlert.facility} has a backlog (+${item.delayAlert.hours}h dwell). ${delayedItems.length} shipment(s) delayed.`;
  } else {
    banner.style.display = "none";
  }
}

function closeDelayBanner() {
  document.getElementById("delayBanner").style.display = "none";
}

function filterDelayedOnly() {
  setFilter("Delayed", document.querySelectorAll(".pill-danger")[0]);
  switchTab("dashboard");
}

// 7. Search & Filter
function setFilter(filterType, element) {
  currentFilter = filterType;
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  if (element) element.classList.add("active");
  handleSearch();
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const cat = document.getElementById("categorySelect").value;
  const prio = document.getElementById("prioritySelect").value;

  const filtered = shipments.filter(s => {
    // Status Filter
    if (currentFilter === "Active" && (s.currentStageIndex === 0 || s.currentStageIndex === 4)) return false;
    if (currentFilter === "Delayed" && s.status !== "Delayed" && !(s.delayAlert && s.delayAlert.active)) return false;
    if (currentFilter === "Delivered" && s.status !== "Delivered" && s.currentStageIndex !== 4) return false;

    // Dropdown Filters
    if (cat && s.category !== cat) return false;
    if (prio && s.priority !== prio) return false;

    // Search Query
    if (query) {
      const matchId = s.id.toLowerCase().includes(query);
      const matchTitle = s.title.toLowerCase().includes(query);
      const matchOrigin = s.origin.toLowerCase().includes(query);
      const matchDest = s.destination.toLowerCase().includes(query);
      const matchCarrier = s.carrier.toLowerCase().includes(query);
      if (!matchId && !matchTitle && !matchOrigin && !matchDest && !matchCarrier) return false;
    }

    return true;
  });

  renderShipments(filtered);
}

// 8. Render Left Panel Shipment Cards
function renderShipments(list = shipments) {
  const container = document.getElementById("shipmentList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: #94a3b8;">No matching shipments found.</div>`;
    return;
  }

  list.forEach(s => {
    const isSelected = s.id === currentShipmentId;
    const isDelayed = s.status === "Delayed" || (s.delayAlert && s.delayAlert.active);
    const stageName = STAGES[s.currentStageIndex] || STAGES[0];

    let badgeClass = "badge-success";
    if (s.status === "Delayed") badgeClass = "badge-danger";
    else if (s.status === "In Transit") badgeClass = "badge-info";

    const card = document.createElement("div");
    card.className = `shipment-card ${isSelected ? 'selected' : ''} ${isDelayed ? 'is-delayed' : ''}`;
    card.onclick = () => selectShipment(s.id);

    card.innerHTML = `
      <div class="card-top">
        <span class="card-id">${s.id}</span>
        <span class="badge ${badgeClass}">${s.status}</span>
        <span style="font-size: 11px; color: #fbbf24;">${s.priority}</span>
      </div>
      <div class="card-title">${s.title}</div>
      <div class="card-route">${s.origin.split('(')[0]} &rarr; ${s.destination.split('(')[0]}</div>
      <div class="card-bottom">
        <span class="card-stage">${stageName}</span>
        <span style="color: #94a3b8;">${s.weight}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// 9. Select & Display Shipment Details in Right Panel
function selectShipment(id) {
  currentShipmentId = id;
  const s = shipments.find(item => item.id === id);
  if (!s) return;

  // Highlight card in list
  renderShipments();

  // Populate Header
  document.getElementById("detailId").innerText = s.id;
  document.getElementById("detailTitle").innerText = s.title;

  const statusBadge = document.getElementById("detailStatusBadge");
  statusBadge.innerText = s.status;
  if (s.status === "Delayed") statusBadge.className = "badge badge-danger";
  else if (s.status === "Delivered") statusBadge.className = "badge badge-success";
  else statusBadge.className = "badge badge-info";

  document.getElementById("detailPriorityBadge").innerText = `${s.priority} Priority`;

  // Specs
  document.getElementById("detailOrigin").innerText = s.origin;
  document.getElementById("detailDestination").innerText = s.destination;
  document.getElementById("detailCarrier").innerText = `${s.carrier} (${s.transportMode})`;
  document.getElementById("detailDeliveryDate").innerText = s.estimatedDelivery;

  // Milestone Progress
  renderMilestoneTrack(s.currentStageIndex, s.status === "Delayed");

  // Bottleneck Callout Box
  const callout = document.getElementById("bottleneckCallout");
  if (s.delayAlert && s.delayAlert.active) {
    callout.classList.remove("hidden");
    document.getElementById("bottleneckFacility").innerText = `Active Bottleneck: ${s.delayAlert.facility}`;
    document.getElementById("bottleneckReason").innerText = `Cause: ${s.delayAlert.cause} (+${s.delayAlert.hours}h dwell).`;
    document.getElementById("bottleneckImpact").innerText = `Impact: ${s.delayAlert.impact}`;
  } else {
    callout.classList.add("hidden");
  }

  // Visual Route Corridor
  renderVisualCorridor(s);

  // Status Timeline
  renderTimeline(s.timeline);
}

// 10. Render 5-Stage Milestone Track
function renderMilestoneTrack(currentIndex, isDelayed) {
  const container = document.getElementById("milestoneTrack");
  container.innerHTML = "";

  const percent = Math.round((currentIndex / 4) * 100);
  document.getElementById("detailProgressText").innerText = `${percent}% Completed`;

  STAGES.forEach((stageName, i) => {
    const item = document.createElement("div");
    item.className = "step-item";

    if (i < currentIndex) {
      item.classList.add("completed");
    } else if (i === currentIndex) {
      if (isDelayed) item.classList.add("delayed");
      else item.classList.add("active");
    }

    const circleContent = (i < currentIndex) ? "&#10003;" : (i + 1);

    item.innerHTML = `
      <div class="step-circle">${circleContent}</div>
      <span class="step-name">${stageName}</span>
    `;

    container.appendChild(item);
  });
}

// 11. Render Visual Route & Corridor Diagram
function renderVisualCorridor(s) {
  const container = document.getElementById("visualCorridor");
  container.innerHTML = "";

  const isDelayed = s.status === "Delayed" || (s.delayAlert && s.delayAlert.active);
  const nodes = s.nodes || [
    { name: s.origin.split('(')[0], city: "Origin", role: "origin", type: "Supplier Factory" },
    { name: "Central Gateway Hub", city: "Transit Node", role: "hub", type: "Transit Gateway" },
    { name: s.destination.split('(')[0], city: "Destination", role: "destination", type: "Customer Plant" }
  ];

  nodes.forEach((node, i) => {
    // Add Node
    const nodeEl = document.createElement("div");
    nodeEl.className = "corridor-node";

    let pinClass = "pin-hub";
    if (node.role === "origin") pinClass = "pin-origin";
    else if (node.role === "destination") pinClass = "pin-destination";
    else if (node.role === "bottleneck" && isDelayed) pinClass = "pin-bottleneck";

    nodeEl.innerHTML = `
      <div class="node-pin ${pinClass}">${i + 1}</div>
      <span class="node-name">${node.name}</span>
      <span class="node-role">${node.type}</span>
    `;
    container.appendChild(nodeEl);

    // Add connector line between nodes
    if (i < nodes.length - 1) {
      const conn = document.createElement("div");
      const isDelayedSection = isDelayed && (node.role === "bottleneck" || nodes[i+1].role === "bottleneck");
      conn.className = `corridor-connector ${isDelayedSection ? 'is-delayed' : ''}`;
      
      // If current vehicle is here
      if (i === Math.min(s.currentStageIndex, nodes.length - 2)) {
        conn.innerHTML = `<span class="vehicle-indicator">&#128666; En Route</span>`;
      }
      container.appendChild(conn);
    }
  });
}

// 12. Render Status Timeline
function renderTimeline(timeline = []) {
  const container = document.getElementById("timelineList");
  container.innerHTML = "";

  timeline.forEach(item => {
    const isBottleneck = item.note.includes("⚠️") || item.stage.includes("Bottleneck");
    const div = document.createElement("div");
    div.className = `timeline-item ${isBottleneck ? 'bottleneck' : ''}`;

    div.innerHTML = `
      <div class="timeline-item-header">
        <span class="timeline-stage">${item.stage}</span>
        <span class="timeline-time">${item.time}</span>
      </div>
      <div class="timeline-location">&#128205; ${item.location}</div>
      <p class="timeline-note">${item.note}</p>
    `;

    container.appendChild(div);
  });
}

// 13. Actions: Advance Stage & Revert Stage
function advanceStage() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  if (s.currentStageIndex >= 4) {
    alert("This shipment is already Delivered to the customer.");
    return;
  }

  s.currentStageIndex++;
  const newStage = STAGES[s.currentStageIndex];

  if (s.currentStageIndex === 4) {
    s.status = "Delivered";
    if (s.delayAlert) s.delayAlert.active = false;
  } else if (s.status === "Delivered") {
    s.status = "On Schedule";
  }

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  s.timeline.push({
    stage: newStage,
    location: s.currentStageIndex === 4 ? s.destination : "Regional Transit Hub",
    time: timeStr,
    note: `Moved forward to ${newStage}. Verified by operator.`
  });

  saveData();
  selectShipment(s.id);
}

function revertStage() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  if (s.currentStageIndex <= 0) {
    alert("Shipment is already at origin creation stage.");
    return;
  }

  s.currentStageIndex--;
  if (s.status === "Delivered") s.status = "On Schedule";

  saveData();
  selectShipment(s.id);
}

// 14. Add Manual Checkpoint Log Note
function addTimelineLog() {
  const input = document.getElementById("logInput");
  const note = input.value.trim();
  if (!note) return;

  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  s.timeline.push({
    stage: `Live Checkpoint Update`,
    location: s.origin.split('(')[0],
    time: timeStr,
    note: note
  });

  input.value = "";
  saveData();
  selectShipment(s.id);
}

// 15. Report & Resolve Delay
function handleDelaySubmit(e) {
  e.preventDefault();
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const facility = document.getElementById("delayFacilityInput").value.trim();
  const cause = document.getElementById("delayCauseCategory").value;
  const hours = parseInt(document.getElementById("delayHoursInput").value) || 24;
  const impact = document.getElementById("delayImpactInput").value.trim();

  s.status = "Delayed";
  s.delayAlert = {
    active: true,
    facility: facility,
    cause: cause,
    hours: hours,
    impact: impact
  };

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  s.timeline.push({
    stage: "⚠️ Bottleneck / Delay Flagged",
    location: facility,
    time: timeStr,
    note: `Disruption logged: ${cause} (+${hours}h dwell). ${impact}`
  });

  saveData();
  closeModal("delayModal");
  selectShipment(s.id);
}

function resolveDelay() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  s.status = "On Schedule";
  if (s.delayAlert) s.delayAlert.active = false;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  s.timeline.push({
    stage: "Bottleneck Resolved",
    location: "Dispatch Tower",
    time: timeStr,
    note: "Alternative route assigned. Shipment cleared and moving on schedule."
  });

  saveData();
  selectShipment(s.id);
}

// 16. Create New Shipment
function handleCreateSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("newTitle").value.trim();
  const category = document.getElementById("newCategory").value;
  const carrier = document.getElementById("newCarrier").value;
  const transportMode = document.getElementById("newTransportMode").value;
  const priority = document.getElementById("newPriority").value;
  const origin = document.getElementById("newOrigin").value.trim();
  const destination = document.getElementById("newDestination").value.trim();
  const weight = document.getElementById("newWeight").value.trim();
  const value = document.getElementById("newValue").value.trim();
  const deliveryDate = document.getElementById("newDeliveryDate").value;

  // Generate Unique ID: SHP-2026-XXXX
  const rand = Math.floor(1000 + Math.random() * 9000);
  const newId = `SHP-2026-${rand}`;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newShipment = {
    id: newId,
    title: title,
    category: category,
    priority: priority,
    status: "On Schedule",
    carrier: carrier,
    transportMode: transportMode,
    weight: weight,
    packages: 20,
    value: value,
    estimatedDelivery: deliveryDate,
    currentStageIndex: 0,
    origin: origin,
    destination: destination,
    nodes: [
      { name: origin.split(',')[0], city: origin, type: "Origin Supplier", role: "origin" },
      { name: "Central Gateway Hub", city: "Nagpur", type: "Transit Hub", role: "hub", dwell: 10, sla: 18 },
      { name: destination.split(',')[0], city: destination, type: "Destination Customer", role: "destination" }
    ],
    delayAlert: { active: false, facility: "", cause: "", hours: 0, impact: "" },
    timeline: [
      { stage: "Order Created & Cargo Verified", location: origin, time: timeStr, note: `Registered in LogiPulse. Carrier ${carrier} assigned.` }
    ]
  };

  shipments.unshift(newShipment);
  saveData();
  closeModal("createModal");
  selectShipment(newId);
  renderHistoryTable();
  alert(`Shipment ${newId} created successfully!`);
}

// 17. Master Shipment History Table
function renderHistoryTable() {
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  shipments.forEach(s => {
    const stage = STAGES[s.currentStageIndex];
    let badgeClass = "badge-success";
    if (s.status === "Delayed") badgeClass = "badge-danger";
    else if (s.status === "In Transit") badgeClass = "badge-info";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: bold; color: #60a5fa;">${s.id}</td>
      <td><strong>${s.title}</strong></td>
      <td>${s.category}</td>
      <td>${s.carrier}</td>
      <td>${s.origin.split('(')[0]}</td>
      <td>${s.destination.split('(')[0]}</td>
      <td>${stage}</td>
      <td><span class="badge ${badgeClass}">${s.status}</span></td>
      <td>
        <button class="btn btn-primary" style="padding: 3px 8px; font-size: 11px;" onclick="selectShipment('${s.id}'); switchTab('dashboard');">Track</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 18. Export to CSV
function exportToCSV() {
  let csv = "Tracking ID,Cargo Title,Category,Priority,Carrier,Transport Mode,Weight,Declared Value,Origin,Destination,Current Stage,Status,Estimated Delivery\n";

  shipments.forEach(s => {
    const stage = STAGES[s.currentStageIndex];
    const row = [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      s.category,
      s.priority,
      s.carrier,
      s.transportMode,
      s.weight,
      `"${s.value}"`,
      `"${s.origin}"`,
      `"${s.destination}"`,
      `"${stage}"`,
      s.status,
      s.estimatedDelivery
    ].join(",");
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LogiPulse_Shipments_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 19. Modals Control & Waybill Generator
function openModal(modalId) {
  if (modalId === "manifestModal") {
    generateManifest();
  }
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function generateManifest() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const container = document.getElementById("manifestContent");
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px;">
      <div>
        <h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase;">LogiPulse Supply Chain Logistics</h2>
        <p style="color: #64748b; font-size: 11px;">Standard Multimodal Bill of Lading & Waybill</p>
      </div>
      <div style="text-align: right;">
        <h3 style="font-size: 16px; font-family: monospace; font-weight: bold;">${s.id}</h3>
        <p style="font-size: 11px; color: #64748b;">Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 14px; margin-bottom: 14px;">
      <div>
        <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">SHIPPER / ORIGIN</span>
        <h4 style="font-size: 13px; margin: 4px 0;">${s.origin}</h4>
      </div>
      <div>
        <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">CONSIGNEE / DESTINATION</span>
        <h4 style="font-size: 13px; margin: 4px 0;">${s.destination}</h4>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 11px; border-bottom: 1px solid #cbd5e1; padding-bottom: 12px; margin-bottom: 14px;">
      <div><strong>Carrier:</strong> ${s.carrier}</div>
      <div><strong>Mode:</strong> ${s.transportMode}</div>
      <div><strong>Priority:</strong> ${s.priority}</div>
    </div>

    <div style="margin-bottom: 16px;">
      <h4 style="font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 6px;">Consignment Details</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1;">
        <thead style="background-color: #f1f5f9;">
          <tr>
            <th style="padding: 6px; border: 1px solid #cbd5e1; text-align: left;">Item Title</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Category</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Weight</th>
            <th style="padding: 6px; border: 1px solid #cbd5e1;">Declared Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">${s.title}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${s.category}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${s.weight}</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${s.value}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; font-size: 11px;">
      <div>
        <div style="border-bottom: 1px solid #000; height: 30px; margin-bottom: 4px;"></div>
        <p style="text-align: center; color: #64748b;">Authorized Shipper Signature</p>
      </div>
      <div>
        <div style="border-bottom: 1px solid #000; height: 30px; margin-bottom: 4px;"></div>
        <p style="text-align: center; color: #64748b;">Carrier Driver Signature</p>
      </div>
    </div>
  `;
}
