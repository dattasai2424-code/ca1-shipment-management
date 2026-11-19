/* =========================================================
   LogiPulse - Supply Chain Shipment Management Interface
   Student Developer: Datta Sai (Registration No: 12623781)
   Course: INT219 Front-End Web Development | Problem #8
   ========================================================= */

// 1. Five Standard Transport Stages (Supplier to Customer)
var STAGES = [
  "Supplier Dispatched",
  "In Transit Hub",
  "Regional Warehouse",
  "Out for Delivery",
  "Delivered"
];

// 2. Initial Sample Shipment Data
var DEFAULT_SHIPMENTS = [
  {
    id: "SHP-101",
    cargo: "Microcontrollers & Sensors",
    origin: "Foxconn Plant (Pune)",
    destination: "Tata Motors (Hosur)",
    carrier: "BlueDart Express",
    stageIndex: 2, // Stage 3: Regional Warehouse
    status: "Delayed",
    delayReason: "Conveyor breakdown at bay #4 in Nagpur Regional Warehouse (+24h delay)."
  },
  {
    id: "SHP-102",
    cargo: "Cardiac Vaccines & Cold Meds",
    origin: "Bharat Biotech (Hyderabad)",
    destination: "AIIMS Apex Center (New Delhi)",
    carrier: "DHL Supply Chain",
    stageIndex: 1, // Stage 2: In Transit Hub
    status: "In Transit",
    delayReason: ""
  },
  {
    id: "SHP-103",
    cargo: "Automotive Transmission Gears",
    origin: "Bosch Manufacturing (Nashik)",
    destination: "Mahindra Auto Plant (Chennai)",
    carrier: "Gati KWE Logistics",
    stageIndex: 4, // Stage 5: Delivered
    status: "Delivered",
    delayReason: ""
  },
  {
    id: "SHP-104",
    cargo: "Solar Inverter Modules",
    origin: "Adani Solar Hub (Mundra)",
    destination: "Renew Power (Bengaluru)",
    carrier: "Delhivery Freight",
    stageIndex: 0, // Stage 1: Supplier Dispatched
    status: "In Transit",
    delayReason: ""
  }
];

// Global Working Array and Active Selected ID
var shipments = [];
var selectedId = "SHP-101";

// 3. Initialize Application on Window Load
window.onload = function() {
  resetData();
};

// 4. Reset Data to Defaults
function resetData() {
  shipments = [];
  for (var i = 0; i < DEFAULT_SHIPMENTS.length; i++) {
    // Create copy of each object
    var item = DEFAULT_SHIPMENTS[i];
    shipments.push({
      id: item.id,
      cargo: item.cargo,
      origin: item.origin,
      destination: item.destination,
      carrier: item.carrier,
      stageIndex: item.stageIndex,
      status: item.status,
      delayReason: item.delayReason
    });
  }
  selectedId = "SHP-101";
  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();
}

// 5. Calculate and Display KPI Summary Counters
function updateKPIs() {
  var total = shipments.length;
  var inTransit = 0;
  var delayed = 0;
  var delivered = 0;

  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].status === "Delivered") {
      delivered++;
    } else if (shipments[i].status === "Delayed") {
      delayed++;
    } else {
      inTransit++;
    }
  }

  document.getElementById("kpiTotal").innerText = total;
  document.getElementById("kpiInTransit").innerText = inTransit;
  document.getElementById("kpiDelayed").innerText = delayed;
  document.getElementById("kpiDelivered").innerText = delivered;
}

// 6. Render Shipment Table
function renderTable(list) {
  var tbody = document.getElementById("shipmentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan='8' style='text-align:center; padding: 20px; color: #94a3b8;'>No shipments match your criteria.</td></tr>";
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    var tr = document.createElement("tr");

    // Status badge class
    var badgeClass = "badge-primary";
    if (s.status === "Delivered") {
      badgeClass = "badge-success";
    } else if (s.status === "Delayed") {
      badgeClass = "badge-warning";
    }

    var stageText = "Stage " + (s.stageIndex + 1) + ": " + STAGES[s.stageIndex];

    tr.innerHTML = 
      "<td><strong>" + s.id + "</strong></td>" +
      "<td>" + s.cargo + "</td>" +
      "<td>" + s.origin + "</td>" +
      "<td>" + s.destination + "</td>" +
      "<td>" + s.carrier + "</td>" +
      "<td>" + stageText + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + s.status + "</span></td>" +
      "<td><button class='btn btn-primary' onclick='selectShipment(\"" + s.id + "\")'>Track</button></td>";

    tbody.appendChild(tr);
  }
}

// 7. Select a Shipment to View in Tracker
function selectShipment(id) {
  selectedId = id;
  displaySelectedShipment();
}

// 8. Find Shipment Object by ID (Simple for-loop helper)
function getShipmentById(id) {
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].id === id) {
      return shipments[i];
    }
  }
  return null;
}

// 9. Display Selected Shipment in 5-Stage Tracker & Detail Box
function displaySelectedShipment() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  // Update text fields
  document.getElementById("detailId").innerText = s.id;
  document.getElementById("detailCargo").innerText = s.cargo;
  document.getElementById("detailOrigin").innerText = s.origin;
  document.getElementById("detailDest").innerText = s.destination;
  document.getElementById("detailCarrier").innerText = s.carrier;
  document.getElementById("detailStage").innerText = "Stage " + (s.stageIndex + 1) + ": " + STAGES[s.stageIndex];

  // Update Status Badge
  var badge = document.getElementById("detailBadge");
  badge.innerText = s.status;
  if (s.status === "Delivered") {
    badge.className = "badge badge-success";
  } else if (s.status === "Delayed") {
    badge.className = "badge badge-warning";
  } else {
    badge.className = "badge badge-primary";
  }

  // Update Bottleneck / Delay Note Box
  var noteBox = document.getElementById("delayNoteBox");
  var reasonText = document.getElementById("delayReasonText");
  if (s.status === "Delayed" && s.delayReason) {
    noteBox.style.display = "block";
    reasonText.innerText = s.delayReason;
  } else {
    noteBox.style.display = "none";
  }

  // Update 5-Stage Visual Progress Tracker
  for (var i = 0; i < 5; i++) {
    var stepEl = document.getElementById("step-" + i);
    var lineEl = document.getElementById("line-" + i);

    if (i < s.stageIndex) {
      stepEl.className = "step done";
    } else if (i === s.stageIndex) {
      stepEl.className = "step active";
    } else {
      stepEl.className = "step";
    }

    if (lineEl) {
      if (i < s.stageIndex) {
        lineEl.className = "step-line done";
      } else {
        lineEl.className = "step-line";
      }
    }
  }
}

// 10. Advance Shipment to Next Stage (e.g. Supplier -> Hub -> Warehouse -> Out -> Delivered)
function advanceStage() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  if (s.stageIndex >= 4) {
    alert("Shipment " + s.id + " has already been Delivered to the customer!");
    return;
  }

  s.stageIndex++;

  // If reached final stage, update status to Delivered
  if (s.stageIndex === 4) {
    s.status = "Delivered";
    s.delayReason = "";
  } else if (s.status === "Delayed") {
    // If advancing from bottleneck, clear delay
    s.status = "In Transit";
    s.delayReason = "";
  }

  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();
  alert("Success: Shipment " + s.id + " moved to " + STAGES[s.stageIndex]);
}

// 11. Report Delay / Bottleneck on Current Shipment
function markDelayed() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  if (s.status === "Delivered") {
    alert("Cannot report delay on an already delivered shipment!");
    return;
  }

  var reason = prompt("Enter bottleneck reason and delayed facility:", "Sorting equipment failure at Regional Warehouse (+24h)");
  if (reason && reason.trim() !== "") {
    s.status = "Delayed";
    s.delayReason = reason.trim();
    updateKPIs();
    renderTable(shipments);
    displaySelectedShipment();

    // Update banner message
    document.getElementById("alertMessage").innerText = "Shipment " + s.id + " is delayed: " + s.delayReason;
    alert("Bottleneck recorded for shipment " + s.id);
  }
}

// 12. Mark Shipment On Schedule
function markOnSchedule() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  if (s.stageIndex === 4) {
    s.status = "Delivered";
  } else {
    s.status = "In Transit";
  }
  s.delayReason = "";

  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();
  alert("Shipment " + s.id + " is now marked On Schedule!");
}

// 13. Jump to Bottleneck Shipment
function highlightBottleneck() {
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].status === "Delayed") {
      selectShipment(shipments[i].id);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }
  }
  alert("No active bottlenecks found!");
}

// 14. Handle Create New Shipment Form Submission
function handleCreateShipment(event) {
  event.preventDefault(); // Stop form from refreshing page

  var id = document.getElementById("shipmentId").value.trim();
  var cargo = document.getElementById("cargoTitle").value.trim();
  var origin = document.getElementById("supplierOrigin").value.trim();
  var dest = document.getElementById("customerDest").value.trim();
  var carrier = document.getElementById("carrierName").value;
  var stage = parseInt(document.getElementById("initialStage").value, 10);

  // Check if ID already exists
  if (getShipmentById(id)) {
    alert("A shipment with ID '" + id + "' already exists! Please use a unique ID.");
    return;
  }

  // Determine initial status
  var status = "In Transit";
  if (stage === 4) {
    status = "Delivered";
  }

  // Create new shipment object
  var newShipment = {
    id: id,
    cargo: cargo,
    origin: origin,
    destination: dest,
    carrier: carrier,
    stageIndex: stage,
    status: status,
    delayReason: ""
  };

  // Add to array
  shipments.push(newShipment);
  selectedId = id;

  // Refresh UI
  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();

  // Reset form
  document.getElementById("createShipmentForm").reset();
  alert("Shipment " + id + " created successfully!");
}

// 15. Search Shipments by ID, Origin, Destination, or Cargo
function searchShipments() {
  var term = document.getElementById("searchInput").value.toLowerCase();
  var filtered = [];

  for (var i = 0; i < shipments.length; i++) {
    var s = shipments[i];
    var idMatch = s.id.toLowerCase().indexOf(term) !== -1;
    var cargoMatch = s.cargo.toLowerCase().indexOf(term) !== -1;
    var originMatch = s.origin.toLowerCase().indexOf(term) !== -1;
    var destMatch = s.destination.toLowerCase().indexOf(term) !== -1;

    if (idMatch || cargoMatch || originMatch || destMatch) {
      filtered.push(s);
    }
  }

  renderTable(filtered);
}

// 16. Filter Shipments by Status Dropdown
function filterShipments() {
  var statusVal = document.getElementById("filterStatus").value;

  if (statusVal === "All") {
    renderTable(shipments);
    return;
  }

  var filtered = [];
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].status === statusVal) {
      filtered.push(shipments[i]);
    }
  }

  renderTable(filtered);
}
