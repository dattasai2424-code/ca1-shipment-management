/**
 * LogiPulse - Supply Chain Shipment Management & Bottleneck Tracking Interface
 * Team: dattasai | Team Leader: Datta Sai (Reg: 12623781)
 * Team Members: 12629667, 12610145
 * 
 * Core Application Controller
 */

// Global State
let shipments = [];
let currentShipmentId = null;
let currentFilterStatus = "All";
let mapInstance = null;
let mapMarkers = [];
let mapPolyline = null;
let dwellChartInstance = null;
let delayCausesChartInstance = null;

// Audio Chime using Web Audio API (Zero external dependencies)
function playTone(type = 'success') {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.setValueAtTime(240, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.setValueAtTime(780, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    }
  } catch (e) {
    // Audio context may be restricted by browser until user gesture
  }
}

// -------------------------------------------------------------
// Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadShipmentsData();
  initPresetDropdowns();
  initLeafletMap();
  updateKPIs();
  renderShipmentsList();
  
  if (shipments.length > 0) {
    selectShipment(shipments[0].id);
  }

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});

// Load state from localStorage or fallback to data.js DEFAULT_SHIPMENTS
function loadShipmentsData() {
  const saved = localStorage.getItem("logipulse_shipments");
  if (saved) {
    try {
      shipments = JSON.parse(saved);
    } catch (e) {
      shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    }
  } else {
    shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    saveShipments();
  }
}

function saveShipments() {
  localStorage.setItem("logipulse_shipments", JSON.stringify(shipments));
  updateKPIs();
}

function resetToDefaultData() {
  if (confirm("Reset shipment tracking data to the original CA1 demonstration scenarios?")) {
    shipments = JSON.parse(JSON.stringify(DEFAULT_SHIPMENTS));
    saveShipments();
    renderShipmentsList();
    if (shipments.length > 0) {
      selectShipment(shipments[0].id);
    }
    refreshAnalytics();
    playTone('success');
  }
}

// -------------------------------------------------------------
// View Navigation
// -------------------------------------------------------------
function switchView(viewName) {
  const views = ["viewTracking", "viewAnalytics", "viewHistory", "viewViva"];
  const navTabs = [
    { id: "navTabTracking", activeClass: "bg-blue-600 text-white" },
    { id: "navTabAnalytics", activeClass: "bg-blue-600 text-white" },
    { id: "navTabHistory", activeClass: "bg-blue-600 text-white" },
    { id: "navTabViva", activeClass: "bg-emerald-600 text-white" }
  ];

  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add("hidden");
  });

  navTabs.forEach(t => {
    const btn = document.getElementById(t.id);
    if (btn) {
      btn.className = "px-4 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center space-x-2 transition";
    }
  });

  if (viewName === "tracking") {
    document.getElementById("viewTracking").classList.remove("hidden");
    document.getElementById("navTabTracking").className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-sm flex items-center space-x-2 transition";
    if (mapInstance) {
      setTimeout(() => mapInstance.invalidateSize(), 150);
    }
  } else if (viewName === "analytics") {
    document.getElementById("viewAnalytics").classList.remove("hidden");
    document.getElementById("navTabAnalytics").className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-sm flex items-center space-x-2 transition";
    refreshAnalytics();
  } else if (viewName === "history") {
    document.getElementById("viewHistory").classList.remove("hidden");
    document.getElementById("navTabHistory").className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-sm flex items-center space-x-2 transition";
    renderHistoryTable();
  } else if (viewName === "viva") {
    document.getElementById("viewViva").classList.remove("hidden");
    document.getElementById("navTabViva").className = "px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white shadow-sm flex items-center space-x-2 transition";
  }

  if (window.lucide) lucide.createIcons();
}

// -------------------------------------------------------------
// KPIs & Bottleneck Alert Banner
// -------------------------------------------------------------
function updateKPIs() {
  const total = shipments.length;
  const inTransit = shipments.filter(s => s.currentStageIndex > 0 && s.currentStageIndex < 4).length;
  const delayed = shipments.filter(s => s.status === "Delayed" || s.status === "At Risk" || (s.delayAlert && s.delayAlert.active)).length;
  const delivered = shipments.filter(s => s.status === "Delivered" || s.currentStageIndex === 4).length;

  document.getElementById("kpiTotalShipments").innerText = total;
  document.getElementById("kpiInTransit").innerText = inTransit;
  document.getElementById("kpiDelayedCount").innerText = delayed;
  
  const deliveryRate = total > 0 ? (((total - delayed) / total) * 100).toFixed(1) : "100.0";
  document.getElementById("kpiDeliveryRate").innerText = `${deliveryRate}%`;

  // Average Hub Dwell Time
  let totalDwell = 0;
  let dwellCount = 0;
  shipments.forEach(s => {
    if (s.intermediateHubs && s.intermediateHubs.length) {
      s.intermediateHubs.forEach(h => {
        if (h.dwellHours) {
          totalDwell += h.dwellHours;
          dwellCount++;
        }
      });
    }
  });
  const avgDwell = dwellCount > 0 ? (totalDwell / dwellCount).toFixed(1) : "14.2";
  document.getElementById("kpiAvgDwell").innerText = `${avgDwell} h`;

  // Bottleneck banner
  const banner = document.getElementById("bottleneckAlertBanner");
  const bannerText = document.getElementById("bottleneckBannerText");
  const delayedShipments = shipments.filter(s => s.delayAlert && s.delayAlert.active);

  if (delayedShipments.length > 0) {
    banner.classList.remove("hidden");
    const first = delayedShipments[0];
    bannerText.innerText = `${first.delayAlert.facilityName || 'Corridor Hub'} experiencing bottleneck (+${first.delayAlert.delayHours || 24}h delay). ${delayedShipments.length} shipment(s) impacted.`;
  } else {
    banner.classList.add("hidden");
  }

  // Update filter pill counts
  document.getElementById("countFilterAll").innerText = total;
  document.getElementById("countFilterActive").innerText = inTransit;
  document.getElementById("countFilterDelayed").innerText = delayed;
  document.getElementById("countFilterDelivered").innerText = delivered;
}

function dismissBottleneckBanner() {
  document.getElementById("bottleneckAlertBanner").classList.add("hidden");
}

function filterByBottlenecksOnly() {
  setFilterStatus("Delayed");
  switchView("tracking");
}

// -------------------------------------------------------------
// Shipment Roster Filtering & Rendering
// -------------------------------------------------------------
function setFilterStatus(status) {
  currentFilterStatus = status;
  document.querySelectorAll(".filter-btn").forEach(btn => {
    if (btn.getAttribute("data-filter") === status) {
      btn.className = "filter-btn px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium";
    } else {
      btn.className = "filter-btn px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 hover:text-white";
    }
  });
  handleSearchFilter();
}

function handleSearchFilter() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const categoryFilter = document.getElementById("filterCategory").value;
  const priorityFilter = document.getElementById("filterPriority").value;

  const filtered = shipments.filter(s => {
    // Status filter
    if (currentFilterStatus === "Active" && (s.currentStageIndex === 0 || s.currentStageIndex === 4)) return false;
    if (currentFilterStatus === "Delayed" && s.status !== "Delayed" && s.status !== "At Risk" && !(s.delayAlert && s.delayAlert.active)) return false;
    if (currentFilterStatus === "Delivered" && s.status !== "Delivered" && s.currentStageIndex !== 4) return false;

    // Category filter
    if (categoryFilter && s.category !== categoryFilter) return false;

    // Priority filter
    if (priorityFilter && s.priority !== priorityFilter) return false;

    // Search query
    if (search) {
      const matchId = s.id.toLowerCase().includes(search);
      const matchTitle = s.title.toLowerCase().includes(search);
      const matchOrigin = s.origin.city.toLowerCase().includes(search) || s.origin.name.toLowerCase().includes(search);
      const matchDest = s.destination.city.toLowerCase().includes(search) || s.destination.name.toLowerCase().includes(search);
      const matchCarrier = s.carrier.toLowerCase().includes(search);
      if (!matchId && !matchTitle && !matchOrigin && !matchDest && !matchCarrier) return false;
    }

    return true;
  });

  renderShipmentsList(filtered);
}

function renderShipmentsList(list = shipments) {
  const container = document.getElementById("shipmentCardsList");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-gray-500 bg-gray-900/40 rounded-xl border border-gray-800">
        <i data-lucide="package-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="text-xs">No shipments found matching current filters.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  list.forEach(s => {
    const isSelected = s.id === currentShipmentId;
    const isDelayed = s.status === "Delayed" || (s.delayAlert && s.delayAlert.active);
    const stageInfo = SUPPLY_CHAIN_STAGES[s.currentStageIndex] || SUPPLY_CHAIN_STAGES[0];

    // Status badge style
    let statusBadgeClass = "bg-emerald-950 text-emerald-300 border-emerald-700";
    if (s.status === "Delayed") statusBadgeClass = "bg-red-950 text-red-300 border-red-700 animate-pulse";
    else if (s.status === "At Risk") statusBadgeClass = "bg-amber-950 text-amber-300 border-amber-700";
    else if (s.status === "Delivered") statusBadgeClass = "bg-blue-950 text-blue-300 border-blue-700";

    const card = document.createElement("div");
    card.className = `shipment-card p-3 rounded-xl bg-[#111827] border border-gray-800 cursor-pointer space-y-2 ${isSelected ? 'active-selected' : ''} ${isDelayed ? 'is-delayed' : ''}`;
    card.onclick = () => selectShipment(s.id);

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-white tracking-wide">${s.id}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusBadgeClass}">${s.status}</span>
        </div>
        <span class="text-[10px] text-gray-400 font-medium">${s.priority}</span>
      </div>

      <div>
        <h4 class="text-xs font-semibold text-gray-100 truncate">${s.title}</h4>
        <div class="flex items-center text-[11px] text-gray-400 mt-1 space-x-1">
          <span class="text-gray-300 truncate max-w-[120px]">${s.origin.city.split(',')[0]}</span>
          <i data-lucide="arrow-right" class="w-3 h-3 text-gray-500 flex-shrink-0"></i>
          <span class="text-gray-300 truncate max-w-[120px]">${s.destination.city.split(',')[0]}</span>
        </div>
      </div>

      <div class="pt-2 border-t border-gray-800 flex items-center justify-between text-[10px]">
        <span class="text-blue-400 flex items-center gap-1 font-medium">
          <i data-lucide="${stageInfo.icon}" class="w-3 h-3"></i>
          <span>${stageInfo.name}</span>
        </span>
        <span class="text-gray-400 font-mono">${s.weight}</span>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

// -------------------------------------------------------------
// Detailed Shipment Inspector
// -------------------------------------------------------------
function selectShipment(id) {
  currentShipmentId = id;
  const s = shipments.find(item => item.id === id);
  if (!s) return;

  // Highlight selected card
  document.querySelectorAll(".shipment-card").forEach(el => el.classList.remove("active-selected"));
  renderShipmentsList();

  // Header details
  document.getElementById("detailTrackingId").innerText = s.id;
  document.getElementById("detailTitle").innerText = s.title;
  
  const statusEl = document.getElementById("detailStatusBadge");
  statusEl.innerText = s.status;
  if (s.status === "Delayed") {
    statusEl.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-red-950 text-red-300 border border-red-700 animate-pulse";
  } else if (s.status === "At Risk") {
    statusEl.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-950 text-amber-300 border border-amber-700";
  } else if (s.status === "Delivered") {
    statusEl.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700";
  } else {
    statusEl.className = "text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-950 text-blue-300 border border-blue-700";
  }

  const priorityEl = document.getElementById("detailPriorityBadge");
  priorityEl.innerText = `${s.priority} Priority`;

  // Progress milestones
  renderMilestones(s.currentStageIndex);

  // Bottleneck Box
  const bottleneckBox = document.getElementById("detailBottleneckBox");
  if (s.delayAlert && s.delayAlert.active) {
    bottleneckBox.classList.remove("hidden");
    document.getElementById("bottleneckFacility").innerText = s.delayAlert.facilityName || "Regional Transit Node";
    document.getElementById("bottleneckCause").innerText = s.delayAlert.cause || "Severe logistics delay detected.";
    document.getElementById("bottleneckImpact").innerText = `Impact: Delay of ~${s.delayAlert.delayHours || 24}h. ${s.delayAlert.impact || ''}`;
  } else {
    bottleneckBox.classList.add("hidden");
  }

  // Logistics Specs
  document.getElementById("detailOriginName").innerText = `${s.origin.name} (${s.origin.city})`;
  document.getElementById("detailDestName").innerText = `${s.destination.name} (${s.destination.city})`;
  document.getElementById("detailCarrier").innerText = `${s.carrier} (${s.transportMode})`;
  
  const estDate = new Date(s.estimatedDelivery);
  document.getElementById("detailEstimatedDate").innerText = estDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Update Route Map
  updateMapForShipment(s);

  // Render Timeline
  renderTimeline(s.timeline, s.currentStageIndex);

  if (window.lucide) lucide.createIcons();
}

// Render Milestone Track
function renderMilestones(currentIndex) {
  const container = document.getElementById("milestoneStepsContainer");
  const pct = Math.min(100, Math.round((currentIndex / 4) * 100));
  document.getElementById("detailProgressPercent").innerText = `${pct}% Completed`;

  container.innerHTML = "";

  SUPPLY_CHAIN_STAGES.forEach((stage, idx) => {
    const isCompleted = idx < currentIndex;
    const isCurrent = idx === currentIndex;
    const isUpcoming = idx > currentIndex;

    let circleBg = "bg-gray-800 text-gray-500 border-gray-700";
    let textClass = "text-gray-500";
    
    if (isCompleted) {
      circleBg = "bg-emerald-600 text-white border-emerald-500";
      textClass = "text-emerald-400";
    } else if (isCurrent) {
      circleBg = "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/50 scale-110";
      textClass = "text-blue-300 font-bold";
    }

    const stepEl = document.createElement("div");
    stepEl.className = "flex flex-col items-center z-10 text-center flex-1";
    stepEl.innerHTML = `
      <div class="w-8 h-8 rounded-full border-2 ${circleBg} flex items-center justify-center transition">
        <i data-lucide="${isCompleted ? 'check' : stage.icon}" class="w-4 h-4"></i>
      </div>
      <span class="text-[10px] mt-1.5 ${textClass} font-medium max-w-[85px] leading-tight">${stage.name}</span>
    `;

    container.appendChild(stepEl);
  });
}

// -------------------------------------------------------------
// Interactive Leaflet Supply Chain Map
// -------------------------------------------------------------
function initLeafletMap() {
  const mapEl = document.getElementById("shipmentMap");
  if (!mapEl) return;

  // Center on India
  mapInstance = L.map("shipmentMap", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([20.5937, 78.9629], 5);

  // Dark/Logistics map tiles
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap contributors & CARTO',
    maxZoom: 18
  }).addTo(mapInstance);
}

function updateMapForShipment(s) {
  if (!mapInstance) return;

  // Clear previous markers & polylines
  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];
  if (mapPolyline) {
    mapInstance.removeLayer(mapPolyline);
    mapPolyline = null;
  }

  const latlngs = [];

  // 1. Origin Node Marker
  const originLatLng = [s.origin.lat, s.origin.lng];
  latlngs.push(originLatLng);
  const originMarker = L.circleMarker(originLatLng, {
    radius: 9,
    fillColor: "#3b82f6",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(mapInstance);
  originMarker.bindPopup(`<b>Origin Supplier:</b><br>${s.origin.name}<br><em>${s.origin.city}</em>`);
  mapMarkers.push(originMarker);

  // 2. Intermediate Hubs Markers
  if (s.intermediateHubs && s.intermediateHubs.length) {
    s.intermediateHubs.forEach((hub, i) => {
      const hubLatLng = [hub.lat, hub.lng];
      latlngs.push(hubLatLng);
      
      const isHubBottleneck = hub.isBottleneck || (hub.dwellHours > hub.slaHours);
      const hubMarker = L.circleMarker(hubLatLng, {
        radius: 8,
        fillColor: isHubBottleneck ? "#ef4444" : "#f59e0b",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(mapInstance);
      
      let hubPopup = `<b>Transit Node #${i+1}:</b><br>${hub.name}<br><em>${hub.city}</em><br>Dwell Time: ${hub.dwellHours || 12}h (SLA: ${hub.slaHours || 14}h)`;
      if (isHubBottleneck) {
        hubPopup += `<br><span style="color:#ef4444;font-weight:bold;">⚠️ BOTTLENECK ALERT</span>`;
      }
      hubMarker.bindPopup(hubPopup);
      mapMarkers.push(hubMarker);
    });
  }

  // 3. Destination Node Marker
  const destLatLng = [s.destination.lat, s.destination.lng];
  latlngs.push(destLatLng);
  const destMarker = L.circleMarker(destLatLng, {
    radius: 9,
    fillColor: "#10b981",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  }).addTo(mapInstance);
  destMarker.bindPopup(`<b>Destination Customer:</b><br>${s.destination.name}<br><em>${s.destination.city}</em>`);
  mapMarkers.push(destMarker);

  // 4. Draw Animated Supply Chain Route Polyline
  const isDelayed = s.status === "Delayed" || (s.delayAlert && s.delayAlert.active);
  mapPolyline = L.polyline(latlngs, {
    color: isDelayed ? "#ef4444" : "#2563eb",
    weight: 4,
    opacity: 0.85,
    dashArray: isDelayed ? "6, 8" : null
  }).addTo(mapInstance);

  // 5. Place current vehicle / transit location marker
  let currentCoord = originLatLng;
  if (s.currentStageIndex === 1 && latlngs.length > 1) {
    currentCoord = latlngs[1];
  } else if (s.currentStageIndex === 2 && latlngs.length > 2) {
    currentCoord = latlngs[latlngs.length - 2];
  } else if (s.currentStageIndex >= 3) {
    currentCoord = destLatLng;
  }

  const vehicleMarker = L.marker(currentCoord, {
    title: "Current Transport Stage Location"
  }).addTo(mapInstance);
  vehicleMarker.bindPopup(`<b>Current Transit Position</b><br>${s.carrier}<br>Stage: ${SUPPLY_CHAIN_STAGES[s.currentStageIndex].name}`);
  mapMarkers.push(vehicleMarker);

  // Zoom bounds to fit all nodes
  mapInstance.fitBounds(mapPolyline.getBounds(), { padding: [40, 40] });
}

// -------------------------------------------------------------
// Status Timeline & Checkpoint Logs
// -------------------------------------------------------------
function renderTimeline(timeline = [], currentStageIndex = 0) {
  const container = document.getElementById("timelineContainer");
  container.innerHTML = `<div class="timeline-stem"></div>`;

  timeline.forEach((item, index) => {
    const isLatest = index === timeline.length - 1;
    const isBottleneck = item.status.includes("Bottleneck") || item.note.includes("⚠️");

    let dotColor = "bg-emerald-500 ring-emerald-950";
    if (isBottleneck) dotColor = "bg-red-500 ring-red-950 animate-pulse";
    else if (isLatest) dotColor = "bg-blue-500 ring-blue-950";

    const el = document.createElement("div");
    el.className = "relative flex items-start space-x-3 text-xs";
    el.innerHTML = `
      <div class="absolute -left-[1.35rem] top-1 w-3 h-3 rounded-full ${dotColor} ring-4 border border-white"></div>
      <div class="bg-gray-900/80 p-3 rounded-lg border ${isBottleneck ? 'border-red-800/80 bg-red-950/20' : 'border-gray-800'} flex-1 space-y-1">
        <div class="flex items-center justify-between">
          <h5 class="font-bold text-gray-100">${item.stage}</h5>
          <span class="text-[10px] text-gray-400 font-mono">${item.timestamp}</span>
        </div>
        <div class="text-[11px] text-blue-400 font-medium">📍 ${item.location}</div>
        <p class="text-gray-300 text-[11px]">${item.note}</p>
      </div>
    `;

    container.appendChild(el);
  });
}

function addManualCheckpointLog() {
  const input = document.getElementById("newCheckpointNote");
  const note = input.value.trim();
  if (!note) return;

  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const currentStageName = SUPPLY_CHAIN_STAGES[s.currentStageIndex].name;
  s.timeline.push({
    stage: `Field Update: ${currentStageName}`,
    location: s.intermediateHubs && s.intermediateHubs.length ? s.intermediateHubs[0].city : s.origin.city,
    timestamp: timeStr,
    status: "Verified",
    note: note
  });

  input.value = "";
  saveShipments();
  selectShipment(s.id);
  playTone('success');
}

// -------------------------------------------------------------
// Stage Progression & Bottleneck Actions
// -------------------------------------------------------------
function advanceCurrentShipmentStage() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  if (s.currentStageIndex >= 4) {
    alert("This shipment is already Delivered to the customer.");
    return;
  }

  s.currentStageIndex++;
  const newStage = SUPPLY_CHAIN_STAGES[s.currentStageIndex];

  if (s.currentStageIndex === 4) {
    s.status = "Delivered";
    if (s.delayAlert) s.delayAlert.active = false;
  } else if (s.status === "Delivered") {
    s.status = "On Schedule";
  }

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  s.timeline.push({
    stage: newStage.name,
    location: s.currentStageIndex === 4 ? s.destination.city : (s.intermediateHubs[0] ? s.intermediateHubs[0].name : "Transit Corridor"),
    timestamp: timeStr,
    status: "Completed",
    note: `Advanced to ${newStage.name}. Transport stage validated.`
  });

  saveShipments();
  selectShipment(s.id);
  playTone('success');
}

function revertCurrentShipmentStage() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  if (s.currentStageIndex <= 0) {
    alert("Shipment is already at origin creation stage.");
    return;
  }

  s.currentStageIndex--;
  if (s.status === "Delivered") {
    s.status = "On Schedule";
  }

  saveShipments();
  selectShipment(s.id);
  playTone('alert');
}

// Flag Bottleneck / Delay Modal
function openDelayModal() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  document.getElementById("delayFacilityInput").value = s.intermediateHubs && s.intermediateHubs.length ? s.intermediateHubs[0].name : `${s.origin.city} Corridor`;
  document.getElementById("delayHoursInput").value = 24;
  document.getElementById("delayImpactInput").value = "Severe sorting backlog at regional terminal. Delivery pushed by +24 hours.";

  document.getElementById("delayModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeDelayModal() {
  document.getElementById("delayModal").classList.add("hidden");
}

function handleDelaySubmit(e) {
  e.preventDefault();
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const facility = document.getElementById("delayFacilityInput").value.trim();
  const category = document.getElementById("delayCauseCategory").value;
  const hours = parseInt(document.getElementById("delayHoursInput").value) || 24;
  const impact = document.getElementById("delayImpactInput").value.trim();

  s.status = "Delayed";
  s.delayAlert = {
    active: true,
    severity: "High",
    bottleneckStage: SUPPLY_CHAIN_STAGES[s.currentStageIndex].name,
    facilityName: facility,
    delayHours: hours,
    cause: category,
    impact: impact,
    flaggedAt: new Date().toISOString()
  };

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  s.timeline.push({
    stage: "⚠️ Bottleneck / Delay Flagged",
    location: facility,
    timestamp: timeStr,
    status: "Bottleneck",
    note: `Disruption logged: ${category}. Dwell impact +${hours}h. ${impact}`
  });

  saveShipments();
  closeDelayModal();
  selectShipment(s.id);
  playTone('alert');
}

function resolveCurrentDelay() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  s.status = "On Schedule";
  if (s.delayAlert) {
    s.delayAlert.active = false;
  }

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  s.timeline.push({
    stage: "Bottleneck Resolved & Expedited",
    location: "Logistics Control Tower",
    timestamp: timeStr,
    status: "Completed",
    note: "Disruption cleared. Alternative routing dispatched to recover schedule."
  });

  saveShipments();
  selectShipment(s.id);
  playTone('success');
}

// -------------------------------------------------------------
// Shipment Creation Modal & Presets
// -------------------------------------------------------------
function initPresetDropdowns() {
  const originSelect = document.getElementById("newOriginPreset");
  const destSelect = document.getElementById("newDestPreset");

  originSelect.innerHTML = `<option value="">Select Predefined Hub...</option>`;
  destSelect.innerHTML = `<option value="">Select Predefined Hub...</option>`;

  PRESET_HUBS.forEach((hub, i) => {
    originSelect.innerHTML += `<option value="${i}">${hub.name} (${hub.city})</option>`;
    destSelect.innerHTML += `<option value="${i}">${hub.name} (${hub.city})</option>`;
  });

  // Default date = 4 days from now
  const defDate = new Date();
  defDate.setDate(defDate.getDate() + 4);
  document.getElementById("newDeliveryDate").value = defDate.toISOString().split("T")[0];
}

function handleOriginChange(val) {
  if (val === "") return;
  const hub = PRESET_HUBS[parseInt(val)];
  if (hub) {
    document.getElementById("newOriginCity").value = hub.city;
  }
}

function handleDestChange(val) {
  if (val === "") return;
  const hub = PRESET_HUBS[parseInt(val)];
  if (hub) {
    document.getElementById("newDestCity").value = hub.city;
  }
}

function openCreateShipmentModal() {
  document.getElementById("createShipmentModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeCreateShipmentModal() {
  document.getElementById("createShipmentModal").classList.add("hidden");
}

function handleCreateShipmentSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("newTitle").value.trim();
  const category = document.getElementById("newCategory").value;
  const carrier = document.getElementById("newCarrier").value;
  const transportMode = document.getElementById("newTransportMode").value;
  const priority = document.getElementById("newPriority").value;
  const weight = document.getElementById("newWeight").value.trim();
  const value = document.getElementById("newValue").value.trim();
  const estDate = document.getElementById("newDeliveryDate").value;

  const originIdx = document.getElementById("newOriginPreset").value;
  const originCity = document.getElementById("newOriginCity").value.trim();
  const destIdx = document.getElementById("newDestPreset").value;
  const destCity = document.getElementById("newDestCity").value.trim();

  let originHub = originIdx !== "" ? PRESET_HUBS[parseInt(originIdx)] : { name: `${originCity} Supplier Hub`, lat: 19.0760, lng: 72.8777 };
  let destHub = destIdx !== "" ? PRESET_HUBS[parseInt(destIdx)] : { name: `${destCity} Distribution Center`, lat: 13.0827, lng: 80.2707 };

  // Generate unique ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `SHP-2026-${randomNum}`;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

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
    createdDate: now.toISOString(),
    estimatedDelivery: new Date(estDate).toISOString(),
    currentStageIndex: 0,
    origin: {
      name: originHub.name,
      city: originCity,
      lat: originHub.lat,
      lng: originHub.lng,
      type: "Supplier Plant"
    },
    intermediateHubs: [
      {
        name: "Central Logistics Gateway",
        city: "Nagpur, Maharashtra",
        lat: 21.1458,
        lng: 79.0882,
        type: "Transit Hub",
        dwellHours: 8,
        slaHours: 14,
        isBottleneck: false
      }
    ],
    destination: {
      name: destHub.name,
      city: destCity,
      lat: destHub.lat,
      lng: destHub.lng,
      type: "Customer Warehouse"
    },
    delayAlert: {
      active: false,
      severity: "None",
      cause: "",
      impact: ""
    },
    timeline: [
      {
        stage: "Order Created & Cargo Verified",
        location: originCity,
        timestamp: timeStr,
        status: "Completed",
        note: `Shipment registered. Carrier ${carrier} assigned.`
      }
    ]
  };

  shipments.unshift(newShipment);
  saveShipments();
  closeCreateShipmentModal();
  selectShipment(newId);
  playTone('success');
  alert(`Shipment ${newId} registered successfully!`);
}

// -------------------------------------------------------------
// Chart.js Bottleneck & Dwell Time Analytics
// -------------------------------------------------------------
function refreshAnalytics() {
  renderDwellTimeChart();
  renderDelayCausesChart();
  renderBottleneckRegistryTable();
}

function renderDwellTimeChart() {
  const ctx = document.getElementById("dwellTimeChart");
  if (!ctx) return;

  if (dwellChartInstance) {
    dwellChartInstance.destroy();
  }

  // Calculate dwell hours across nodes
  dwellChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Supplier Dispatch", "Inter-State Corridor", "Regional Hub / Sorting", "Last-Mile Delivery"],
      datasets: [
        {
          label: "Actual Average Dwell (Hours)",
          data: [6.4, 18.2, 28.5, 5.1],
          backgroundColor: ["#3b82f6", "#06b6d4", "#ef4444", "#10b981"],
          borderRadius: 6
        },
        {
          label: "SLA Threshold Target (Hours)",
          data: [8.0, 14.0, 18.0, 6.0],
          type: "line",
          borderColor: "#f59e0b",
          borderWidth: 2,
          pointBackgroundColor: "#f59e0b",
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#9ca3af" }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#9ca3af" }
        }
      },
      plugins: {
        legend: { labels: { color: "#e5e7eb", font: { size: 11 } } }
      }
    }
  });
}

function renderDelayCausesChart() {
  const ctx = document.getElementById("delayCausesChart");
  if (!ctx) return;

  if (delayCausesChartInstance) {
    delayCausesChartInstance.destroy();
  }

  delayCausesChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Warehouse Sorting Breakdown",
        "Monsoon Flooding / Landslide",
        "Port / Customs Congestion",
        "Vehicle Breakdown",
        "Capacity Overload"
      ],
      datasets: [
        {
          data: [42, 28, 14, 10, 6],
          backgroundColor: ["#ef4444", "#f97316", "#eab308", "#8b5cf6", "#3b82f6"],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { color: "#e5e7eb", font: { size: 10 }, boxWidth: 12 }
        }
      }
    }
  });
}

function renderBottleneckRegistryTable() {
  const tbody = document.getElementById("bottleneckRegistryTable");
  if (!tbody) return;

  const facilities = [
    { name: "Nagpur Central Consolidation Warehouse", type: "Regional Warehouse Hub", dwell: "42.0 h", sla: "18.0 h", status: "Critical Bottleneck", cause: "Conveyor sorter breakdown at bay #4", fix: "Route bypass via South logistics corridor" },
    { name: "Belagavi Highway Transshipment Hub", type: "Corridor Transshipment", dwell: "38.0 h", sla: "16.0 h", status: "Critical Bottleneck", cause: "NH-48 Ghat section heavy landslide", fix: "Divert heavy trailers via coastal NH-66" },
    { name: "Ahmedabad Western Terminal", type: "Regional Warehouse Hub", dwell: "20.0 h", sla: "22.0 h", status: "At Risk (Near SLA)", cause: "Peak festive seasonal cargo volume", fix: "Deploy secondary shift sorting workforce" },
    { name: "Navi Mumbai Central Gateway", type: "Transit Gateway Hub", dwell: "14.0 h", sla: "12.0 h", status: "Minor Delay", cause: "JNPT container clearing backlog", fix: "Pre-clear RFID electronic waybills" }
  ];

  tbody.innerHTML = "";
  facilities.forEach(f => {
    const isCritical = f.status.includes("Critical");
    tbody.innerHTML += `
      <tr class="hover:bg-gray-800/40 transition">
        <td class="p-3 font-semibold text-white">${f.name}</td>
        <td class="p-3 text-gray-400">${f.type}</td>
        <td class="p-3 font-bold ${isCritical ? 'text-red-400' : 'text-amber-400'}">${f.dwell}</td>
        <td class="p-3 text-gray-400 font-mono">${f.sla}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${isCritical ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-amber-950 text-amber-300'}">${f.status}</span></td>
        <td class="p-3 text-gray-300">${f.cause}</td>
        <td class="p-3 text-emerald-400 font-medium">${f.fix}</td>
      </tr>
    `;
  });
}

// -------------------------------------------------------------
// History Table View
// -------------------------------------------------------------
function renderHistoryTable() {
  const tbody = document.getElementById("historyTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  shipments.forEach(s => {
    const stage = SUPPLY_CHAIN_STAGES[s.currentStageIndex].name;
    const isDelayed = s.status === "Delayed";
    
    tbody.innerHTML += `
      <tr class="hover:bg-gray-800/50 transition">
        <td class="p-3 font-mono font-bold text-blue-400">${s.id}</td>
        <td class="p-3 font-medium text-white">${s.title}</td>
        <td class="p-3 text-gray-400">${s.category}</td>
        <td class="p-3 text-gray-300">${s.carrier}</td>
        <td class="p-3 text-gray-400">${s.origin.city.split(',')[0]}</td>
        <td class="p-3 text-gray-400">${s.destination.city.split(',')[0]}</td>
        <td class="p-3 text-gray-200">${stage}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDelayed ? 'bg-red-950 text-red-300 border border-red-700' : (s.status === 'Delivered' ? 'bg-emerald-950 text-emerald-300' : 'bg-blue-950 text-blue-300')}">
            ${s.status}
          </span>
        </td>
        <td class="p-3 text-right space-x-2">
          <button onclick="selectShipment('${s.id}'); switchView('tracking');" class="text-xs text-blue-400 hover:text-blue-300 font-medium">Track</button>
          <button onclick="selectShipment('${s.id}'); openPrintManifestModal();" class="text-xs text-gray-400 hover:text-white font-medium">Manifest</button>
        </td>
      </tr>
    `;
  });
}

// -------------------------------------------------------------
// CSV / Excel Export Generator
// -------------------------------------------------------------
function exportShipmentsToCSV() {
  let csv = "Tracking ID,Title,Category,Priority,Carrier,Transport Mode,Weight,Value,Origin Facility,Origin City,Destination Facility,Destination City,Current Stage,Status,Delay Cause,Estimated Delivery\n";

  shipments.forEach(s => {
    const stage = SUPPLY_CHAIN_STAGES[s.currentStageIndex].name;
    const delayCause = s.delayAlert && s.delayAlert.active ? s.delayAlert.cause.replace(/,/g, ' ') : "None";
    
    const row = [
      s.id,
      `"${s.title.replace(/"/g, '""')}"`,
      s.category,
      s.priority,
      s.carrier,
      s.transportMode,
      s.weight,
      `"${s.value}"`,
      `"${s.origin.name}"`,
      `"${s.origin.city}"`,
      `"${s.destination.name}"`,
      `"${s.destination.city}"`,
      `"${stage}"`,
      s.status,
      `"${delayCause}"`,
      s.estimatedDelivery
    ].join(",");
    csv += row + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `LogiPulse_Shipment_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// -------------------------------------------------------------
// Printable Waybill Manifest Modal
// -------------------------------------------------------------
function openPrintManifestModal() {
  const s = shipments.find(item => item.id === currentShipmentId);
  if (!s) return;

  const content = document.getElementById("manifestDocumentContent");
  content.innerHTML = `
    <!-- Manifest Header -->
    <div class="flex items-center justify-between border-b-2 border-gray-900 pb-4">
      <div>
        <h1 class="text-xl font-black tracking-tight text-gray-900 uppercase">LogiPulse Supply Chain Logistics</h1>
        <p class="text-xs text-gray-600">Standard Multimodal Bill of Lading & Consignment Waybill</p>
      </div>
      <div class="text-right">
        <div class="text-lg font-mono font-bold text-gray-900 tracking-wider">${s.id}</div>
        <p class="text-[10px] text-gray-500">Date Issued: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>

    <!-- Shipper / Consignee Grid -->
    <div class="grid grid-cols-2 gap-6 border-b border-gray-300 pb-4">
      <div>
        <span class="text-[10px] uppercase font-bold text-gray-500 block">Shipper / Origin Supplier</span>
        <h3 class="font-bold text-sm text-gray-900">${s.origin.name}</h3>
        <p class="text-xs text-gray-600">${s.origin.city}</p>
        <p class="text-xs text-gray-500 mt-1">Facility Type: ${s.origin.type}</p>
      </div>
      <div>
        <span class="text-[10px] uppercase font-bold text-gray-500 block">Consignee / Destination Receiver</span>
        <h3 class="font-bold text-sm text-gray-900">${s.destination.name}</h3>
        <p class="text-xs text-gray-600">${s.destination.city}</p>
        <p class="text-xs text-gray-500 mt-1">Facility Type: ${s.destination.type}</p>
      </div>
    </div>

    <!-- Carrier & Transport Details -->
    <div class="grid grid-cols-3 gap-4 border-b border-gray-300 pb-4 text-xs">
      <div>
        <span class="text-gray-500 font-semibold block">Primary Carrier</span>
        <span class="font-bold text-gray-900">${s.carrier}</span>
      </div>
      <div>
        <span class="text-gray-500 font-semibold block">Transport Mode</span>
        <span class="font-bold text-gray-900">${s.transportMode}</span>
      </div>
      <div>
        <span class="text-gray-500 font-semibold block">Priority Tier</span>
        <span class="font-bold text-gray-900">${s.priority} Priority</span>
      </div>
    </div>

    <!-- Cargo Table -->
    <div>
      <h4 class="font-bold text-xs uppercase text-gray-700 mb-2">Consignment Description & Specifications</h4>
      <table class="w-full text-left text-xs border border-gray-300">
        <thead class="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
          <tr>
            <th class="p-2 border-r">Item Description</th>
            <th class="p-2 border-r">Commodity Category</th>
            <th class="p-2 border-r">Gross Weight</th>
            <th class="p-2 border-r">Packages</th>
            <th class="p-2">Declared Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border-r font-medium">${s.title}</td>
            <td class="p-2 border-r">${s.category}</td>
            <td class="p-2 border-r">${s.weight}</td>
            <td class="p-2 border-r">${s.packages || 12} Pallets</td>
            <td class="p-2 font-mono font-bold">${s.value}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Supply Chain Transit Status -->
    <div class="bg-gray-50 p-3 rounded border border-gray-300 space-y-1">
      <div class="flex justify-between font-bold text-gray-800">
        <span>Current Transport Stage: ${SUPPLY_CHAIN_STAGES[s.currentStageIndex].name}</span>
        <span>Shipment Status: ${s.status}</span>
      </div>
      <p class="text-[11px] text-gray-600">Expected Arrival SLA: ${new Date(s.estimatedDelivery).toLocaleDateString()}</p>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-3 gap-6 pt-6 border-t border-gray-300 text-[11px]">
      <div>
        <div class="border-b border-gray-400 h-10 mb-1"></div>
        <p class="font-semibold text-gray-700">Authorized Shipper Signature</p>
      </div>
      <div>
        <div class="border-b border-gray-400 h-10 mb-1"></div>
        <p class="font-semibold text-gray-700">Carrier Driver / Pilot Signature</p>
      </div>
      <div>
        <div class="border-b border-gray-400 h-10 mb-1"></div>
        <p class="font-semibold text-gray-700">Receiving Consignee Signature</p>
      </div>
    </div>
  `;

  document.getElementById("printManifestModal").classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closePrintManifestModal() {
  document.getElementById("printManifestModal").classList.add("hidden");
}
