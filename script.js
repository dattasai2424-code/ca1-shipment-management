var STAGES = [
  "Supplier Dispatched",
  "In Transit Hub",
  "Regional Warehouse",
  "Out for Delivery",
  "Delivered"
];

var DEFAULT_SHIPMENTS = [
  {
    id: "SHP-101",
    cargo: "Microcontrollers & Sensors",
    origin: "Foxconn Plant (Pune)",
    destination: "Tata Motors (Hosur)",
    carrier: "BlueDart Express",
    date: "Nov 16, 2026",
    eta: "Nov 21, 2026",
    stageIndex: 2,
    status: "Delayed",
    delayReason: "Conveyor breakdown at bay #4 in Nagpur Regional Warehouse (+24h delay)."
  },
  {
    id: "SHP-102",
    cargo: "Cardiac Vaccines & Cold Meds",
    origin: "Bharat Biotech (Hyderabad)",
    destination: "AIIMS Apex Center (New Delhi)",
    carrier: "DHL Supply Chain",
    date: "Nov 17, 2026",
    eta: "Nov 20, 2026",
    stageIndex: 1,
    status: "In Transit",
    delayReason: ""
  },
  {
    id: "SHP-103",
    cargo: "Automotive Transmission Gears",
    origin: "Bosch Manufacturing (Nashik)",
    destination: "Mahindra Auto Plant (Chennai)",
    carrier: "Gati KWE Logistics",
    date: "Nov 14, 2026",
    eta: "Nov 18, 2026",
    stageIndex: 4,
    status: "Delivered",
    delayReason: ""
  },
  {
    id: "SHP-104",
    cargo: "Solar Inverter Modules",
    origin: "Adani Solar Hub (Mundra)",
    destination: "Renew Power (Bengaluru)",
    carrier: "Delhivery Freight",
    date: "Nov 18, 2026",
    eta: "Nov 23, 2026",
    stageIndex: 0,
    status: "In Transit",
    delayReason: ""
  }
];

var shipments = [];
var selectedId = "SHP-101";

window.onload = function() {
  resetData();
};

function resetData() {
  shipments = [];
  for (var i = 0; i < DEFAULT_SHIPMENTS.length; i++) {
    var item = DEFAULT_SHIPMENTS[i];
    shipments.push({
      id: item.id,
      cargo: item.cargo,
      origin: item.origin,
      destination: item.destination,
      carrier: item.carrier,
      date: item.date,
      eta: item.eta,
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

function renderTable(list) {
  var tbody = document.getElementById("shipmentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    tbody.innerHTML = "<tr><td colspan='9' style='text-align:center; padding: 20px; color: #94a3b8;'>No shipments match your criteria.</td></tr>";
    return;
  }

  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    var tr = document.createElement("tr");

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
      "<td>" + s.date + "</td>" +
      "<td>" + stageText + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + s.status + "</span></td>" +
      "<td><button class='btn btn-secondary' onclick='selectShipment(\"" + s.id + "\")'>Track</button></td>";

    tbody.appendChild(tr);
  }
}

function selectShipment(id) {
  selectedId = id;
  displaySelectedShipment();
}

function getShipmentById(id) {
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].id === id) {
      return shipments[i];
    }
  }
  return null;
}

function displaySelectedShipment() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  document.getElementById("detailId").innerText = s.id;
  document.getElementById("detailCargo").innerText = s.cargo;
  document.getElementById("detailOrigin").innerText = s.origin;
  document.getElementById("detailDest").innerText = s.destination;
  document.getElementById("detailCarrier").innerText = s.carrier;
  document.getElementById("detailDate").innerText = s.date;
  document.getElementById("detailEta").innerText = s.eta;
  document.getElementById("detailStage").innerText = "Stage " + (s.stageIndex + 1) + ": " + STAGES[s.stageIndex];

  var badge = document.getElementById("detailBadge");
  badge.innerText = s.status;
  if (s.status === "Delivered") {
    badge.className = "badge badge-success";
  } else if (s.status === "Delayed") {
    badge.className = "badge badge-warning";
  } else {
    badge.className = "badge badge-primary";
  }

  var noteBox = document.getElementById("delayNoteBox");
  var reasonText = document.getElementById("delayReasonText");
  if (s.status === "Delayed" && s.delayReason) {
    noteBox.style.display = "block";
    reasonText.innerText = s.delayReason;
  } else {
    noteBox.style.display = "none";
  }

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

function advanceStage() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  if (s.stageIndex >= 4) {
    alert("Shipment " + s.id + " has already been Delivered to the customer.");
    return;
  }

  s.stageIndex++;

  if (s.stageIndex === 4) {
    s.status = "Delivered";
    s.delayReason = "";
  } else if (s.status === "Delayed") {
    s.status = "In Transit";
    s.delayReason = "";
  }

  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();
  alert("Shipment " + s.id + " moved to " + STAGES[s.stageIndex]);
}

function markDelayed() {
  var s = getShipmentById(selectedId);
  if (!s) return;

  if (s.status === "Delivered") {
    alert("Cannot report delay on an already delivered shipment.");
    return;
  }

  var reason = prompt("Enter bottleneck reason and delayed facility:", "Sorting equipment failure at Regional Warehouse (+24h)");
  if (reason && reason.trim() !== "") {
    s.status = "Delayed";
    s.delayReason = reason.trim();
    updateKPIs();
    renderTable(shipments);
    displaySelectedShipment();

    document.getElementById("alertMessage").innerText = "Shipment " + s.id + " is delayed: " + s.delayReason;
    alert("Bottleneck recorded for shipment " + s.id);
  }
}

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
  alert("Shipment " + s.id + " is marked On Schedule.");
}

function highlightBottleneck() {
  for (var i = 0; i < shipments.length; i++) {
    if (shipments[i].status === "Delayed") {
      selectShipment(shipments[i].id);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }
  }
  alert("No active bottlenecks found.");
}

function handleCreateShipment(event) {
  event.preventDefault();

  var id = document.getElementById("shipmentId").value.trim();
  var cargo = document.getElementById("cargoTitle").value.trim();
  var origin = document.getElementById("supplierOrigin").value.trim();
  var dest = document.getElementById("customerDest").value.trim();
  var carrier = document.getElementById("carrierName").value;
  var stage = parseInt(document.getElementById("initialStage").value, 10);

  if (getShipmentById(id)) {
    alert("A shipment with ID '" + id + "' already exists. Please use a unique ID.");
    return;
  }

  var status = "In Transit";
  if (stage === 4) {
    status = "Delivered";
  }

  var newShipment = {
    id: id,
    cargo: cargo,
    origin: origin,
    destination: dest,
    carrier: carrier,
    date: "Nov 19, 2026",
    eta: "Nov 24, 2026",
    stageIndex: stage,
    status: status,
    delayReason: ""
  };

  shipments.push(newShipment);
  selectedId = id;

  updateKPIs();
  renderTable(shipments);
  displaySelectedShipment();

  document.getElementById("createShipmentForm").reset();
  alert("Shipment " + id + " created successfully.");
}

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
