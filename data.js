/**
 * LogiPulse - Supply Chain Shipment Management & Bottleneck Tracking System
 * Team: dattasai | Team Leader: Datta Sai (Reg: 12623781)
 * Team Members: 12623781, 12629667, 12610145
 * 
 * Default Initial Dataset representing diverse supply chain movements:
 * - Suppliers, Central Hubs, Regional Warehouses, and Customer Destinations
 * - Includes normal transit, delivered shipments, and critical bottlenecks
 */

const DEFAULT_SHIPMENTS = [
  {
    id: "SHP-2026-8810",
    title: "High-Precision Industrial Microcontrollers",
    category: "Electronics",
    priority: "Urgent",
    status: "Delayed", // "On Schedule", "Delayed", "At Risk", "Delivered"
    carrier: "BlueDart Express",
    transportMode: "Road Express",
    weight: "450 kg",
    packages: 35,
    value: "₹ 18,50,000",
    createdDate: "2026-10-14T09:30:00Z",
    estimatedDelivery: "2026-10-21T18:00:00Z",
    currentStageIndex: 2, // 0: Supplier Dispatched, 1: Transit Hub, 2: Regional Warehouse, 3: Out for Delivery, 4: Delivered
    origin: {
      name: "Foxconn Semi Manufacturing Facility",
      city: "Pune, Maharashtra",
      lat: 18.5204,
      lng: 73.8567,
      type: "Supplier Factory"
    },
    intermediateHubs: [
      {
        name: "Navi Mumbai Central Logistics Gateway",
        city: "Navi Mumbai, Maharashtra",
        lat: 19.0330,
        lng: 73.0297,
        type: "Transit Hub",
        dwellHours: 14,
        slaHours: 12
      },
      {
        name: "Nagpur Central Consolidation Warehouse",
        city: "Nagpur, Maharashtra",
        lat: 21.1458,
        lng: 79.0882,
        type: "Regional Warehouse Hub",
        dwellHours: 42, // EXCEEDED SLA! Bottleneck
        slaHours: 18,
        isBottleneck: true,
        bottleneckReason: "Heavy warehouse congestion & automated sorter breakdown"
      }
    ],
    destination: {
      name: "Tata Electronics Assembly Plant",
      city: "Hosur, Tamil Nadu",
      lat: 12.7409,
      lng: 77.8253,
      type: "Customer Assembly Plant"
    },
    delayAlert: {
      active: true,
      severity: "High",
      bottleneckStage: "Regional Warehouse",
      facilityName: "Nagpur Central Consolidation Warehouse",
      delayHours: 24,
      cause: "Automated conveyor sorting breakdown and backlog at sorting bay #4.",
      impact: "Expected arrival pushed back by 1.5 days. Rerouting via Bengaluru bypass suggested.",
      flaggedAt: "2026-10-18T14:15:00Z"
    },
    timeline: [
      {
        stage: "Order Created & Cargo Verified",
        location: "Pune Factory Bay 3",
        timestamp: "2026-10-14 09:30 AM",
        status: "Completed",
        note: "Cargo packed, weighed (450 kg), and bill of lading generated."
      },
      {
        stage: "Dispatched from Supplier",
        location: "Pune Gateway Toll",
        timestamp: "2026-10-14 02:45 PM",
        status: "Completed",
        note: "Handed over to BlueDart fleet truck MH-12-Q-4491."
      },
      {
        stage: "Reached Transit Hub",
        location: "Navi Mumbai Logistics Gateway",
        timestamp: "2026-10-15 08:20 AM",
        status: "Completed",
        note: "Pallet barcoded and scanned into cross-dock facility."
      },
      {
        stage: "Arrived at Regional Warehouse",
        location: "Nagpur Consolidation Hub",
        timestamp: "2026-10-16 11:30 AM",
        status: "Current (Bottleneck)",
        note: "⚠️ DELAY ALERT: Conveyor sorting line malfunction. Dwell time: 42h (SLA: 18h)."
      }
    ]
  },
  {
    id: "SHP-2026-9042",
    title: "Temperature-Controlled Cardiac Vaccines",
    category: "Pharmaceuticals",
    priority: "Urgent",
    status: "On Schedule",
    carrier: "DHL Global ColdChain",
    transportMode: "Air & Reefer Truck",
    weight: "120 kg",
    packages: 8,
    value: "₹ 42,00,000",
    createdDate: "2026-10-18T07:00:00Z",
    estimatedDelivery: "2026-10-21T12:00:00Z",
    currentStageIndex: 1,
    origin: {
      name: "Bharat Biotech Vaccine Bio-Park",
      city: "Hyderabad, Telangana",
      lat: 17.3850,
      lng: 78.4867,
      type: "Pharma Manufacturer"
    },
    intermediateHubs: [
      {
        name: "Hyderabad Air Cargo Terminal (RGIA)",
        city: "Shamshabad, Hyderabad",
        lat: 17.2403,
        lng: 78.4294,
        type: "Air Freight Hub",
        dwellHours: 6,
        slaHours: 8
      },
      {
        name: "Indira Gandhi Int'l Cold Chain Bay",
        city: "New Delhi",
        lat: 28.5562,
        lng: 77.1000,
        type: "Air Transit Hub",
        dwellHours: 5,
        slaHours: 8
      }
    ],
    destination: {
      name: "AIIMS Apex Medical Center",
      city: "New Delhi",
      lat: 28.5672,
      lng: 77.2100,
      type: "Hospital Fulfillment"
    },
    delayAlert: {
      active: false,
      severity: "None",
      cause: "",
      impact: ""
    },
    timeline: [
      {
        stage: "Cold Storage Validation",
        location: "Bharat Biotech Genome Valley",
        timestamp: "2026-10-18 07:00 AM",
        status: "Completed",
        note: "Temp logging active at -20°C. Verified cold chain tamper seals."
      },
      {
        stage: "Dispatched from Supplier",
        location: "Hyderabad Facility",
        timestamp: "2026-10-18 10:15 AM",
        status: "Completed",
        note: "Loaded onto dedicated Reefer van DL-1C-5092."
      },
      {
        stage: "Air Transit Transfer",
        location: "RGIA Air Cargo Bay",
        timestamp: "2026-10-19 01:40 PM",
        status: "Current",
        note: "Customs cleared. Boarding flight 6E-Pharma-881 to New Delhi."
      }
    ]
  },
  {
    id: "SHP-2026-7231",
    title: "Electric Vehicle Lithium Battery Packs",
    category: "Automotive",
    priority: "Express",
    status: "Delayed",
    carrier: "Delhivery Freight",
    transportMode: "Heavy Freight Road",
    weight: "2,800 kg",
    packages: 12,
    value: "₹ 34,20,000",
    createdDate: "2026-10-12T11:00:00Z",
    estimatedDelivery: "2026-10-19T16:00:00Z",
    currentStageIndex: 1,
    origin: {
      name: "Exide Energy Gigafactory",
      city: "Bengaluru, Karnataka",
      lat: 12.9716,
      lng: 77.5946,
      type: "Supplier Plant"
    },
    intermediateHubs: [
      {
        name: "Belagavi Highway Transshipment Hub",
        city: "Belagavi, Karnataka",
        lat: 15.8497,
        lng: 74.4977,
        type: "Transit Hub",
        dwellHours: 38, // Bottleneck
        slaHours: 16,
        isBottleneck: true,
        bottleneckReason: "Severe NH-48 monsoon landslide & lane closure"
      }
    ],
    destination: {
      name: "Mahindra EV Manufacturing Plant",
      city: "Chakan, Pune",
      lat: 18.7606,
      lng: 73.8636,
      type: "OEM Manufacturer"
    },
    delayAlert: {
      active: true,
      severity: "Critical",
      bottleneckStage: "Transit Hub / Inter-state Corridor",
      facilityName: "Belagavi Highway Transshipment Hub",
      delayHours: 32,
      cause: "NH-48 Ghat section landslide and heavy transport diversions.",
      impact: "Production line at Chakan factory alerted for 36-hour schedule buffer.",
      flaggedAt: "2026-10-16 09:20 AM"
    },
    timeline: [
      {
        stage: "Cargo Certification",
        location: "Exide Bengaluru Yard",
        timestamp: "2026-10-12 11:00 AM",
        status: "Completed",
        note: "Hazardous Materials (HAZMAT Class 9) compliance certificates attached."
      },
      {
        stage: "Dispatched from Supplier",
        location: "Hosur Road Checkpost",
        timestamp: "2026-10-13 04:00 PM",
        status: "Completed",
        note: "Flatbed multi-axle trailer KA-01-E-9021 en route."
      },
      {
        stage: "In Transit Bottleneck",
        location: "Belagavi Transshipment Hub",
        timestamp: "2026-10-15 08:00 AM",
        status: "Current (Bottleneck)",
        note: "⚠️ HIGHWAY ALERT: Landslide near Kolhapur border. Dwell time: 38h."
      }
    ]
  },
  {
    id: "SHP-2026-5520",
    title: "Organic Cotton Apparel Consignment",
    category: "Textiles",
    priority: "Standard",
    status: "Delivered",
    carrier: "TCI Freight",
    transportMode: "Dedicated Truckload",
    weight: "1,400 kg",
    packages: 85,
    value: "₹ 9,50,000",
    createdDate: "2026-10-08T08:30:00Z",
    estimatedDelivery: "2026-10-15T18:00:00Z",
    currentStageIndex: 4,
    origin: {
      name: "Coimbatore Textile Mills",
      city: "Coimbatore, Tamil Nadu",
      lat: 11.0168,
      lng: 76.9558,
      type: "Textile Mill"
    },
    intermediateHubs: [
      {
        name: "Salem Central Hub",
        city: "Salem, Tamil Nadu",
        lat: 11.6643,
        lng: 78.1460,
        type: "Transit Hub",
        dwellHours: 10,
        slaHours: 14
      },
      {
        name: "Chennai Perungudi Fulfillment Depot",
        city: "Chennai, Tamil Nadu",
        lat: 12.9654,
        lng: 80.2461,
        type: "Regional Warehouse",
        dwellHours: 12,
        slaHours: 16
      }
    ],
    destination: {
      name: "Zara Retail Flagship Distribution Hub",
      city: "Chennai, Tamil Nadu",
      lat: 13.0827,
      lng: 80.2707,
      type: "Retail Customer"
    },
    delayAlert: {
      active: false,
      severity: "None",
      cause: "",
      impact: ""
    },
    timeline: [
      {
        stage: "Packed & Sealed",
        location: "Coimbatore Mills",
        timestamp: "2026-10-08 08:30 AM",
        status: "Completed",
        note: "Palletized and shrink-wrapped with RFID tags."
      },
      {
        stage: "Dispatched from Supplier",
        location: "Coimbatore Toll",
        timestamp: "2026-10-09 11:00 AM",
        status: "Completed",
        note: "Vehicle TN-37-AA-3841 dispatched."
      },
      {
        stage: "In Transit Processing",
        location: "Salem Hub",
        timestamp: "2026-10-10 03:30 PM",
        status: "Completed",
        note: "Cross-dock inspection passed."
      },
      {
        stage: "Regional Warehouse Sorting",
        location: "Chennai Perungudi Hub",
        timestamp: "2026-10-12 09:15 AM",
        status: "Completed",
        note: "Sorted to urban last-mile delivery vans."
      },
      {
        stage: "Delivered to Customer",
        location: "Zara Chennai Retail Hub",
        timestamp: "2026-10-14 04:30 PM",
        status: "Completed",
        note: "POD signed by Store Receiving Manager. Delivered 1 day ahead of SLA."
      }
    ]
  },
  {
    id: "SHP-2026-6194",
    title: "5G Telecommunication Network Towers",
    category: "Telecom",
    priority: "Express",
    status: "At Risk",
    carrier: "Gati-KWE Logistics",
    transportMode: "Heavy Rail & Road",
    weight: "5,400 kg",
    packages: 28,
    value: "₹ 62,00,000",
    createdDate: "2026-10-15T10:00:00Z",
    estimatedDelivery: "2026-10-22T20:00:00Z",
    currentStageIndex: 2,
    origin: {
      name: "Sterlite Telecom Manufacturing",
      city: "Aurangabad, Maharashtra",
      lat: 19.8762,
      lng: 75.3433,
      type: "Factory"
    },
    intermediateHubs: [
      {
        name: "Surat Logistics Park",
        city: "Surat, Gujarat",
        lat: 21.1702,
        lng: 72.8311,
        type: "Transit Hub",
        dwellHours: 11,
        slaHours: 14
      },
      {
        name: "Ahmedabad Western Terminal",
        city: "Ahmedabad, Gujarat",
        lat: 23.0225,
        lng: 72.5714,
        type: "Regional Warehouse Hub",
        dwellHours: 20, // Near SLA
        slaHours: 22,
        isBottleneck: false
      }
    ],
    destination: {
      name: "Jio Infocomm Regional Data Center",
      city: "Jaipur, Rajasthan",
      lat: 26.9124,
      lng: 75.7873,
      type: "Customer Facility"
    },
    delayAlert: {
      active: true,
      severity: "Medium",
      bottleneckStage: "Regional Warehouse Hub",
      facilityName: "Ahmedabad Western Terminal",
      delayHours: 8,
      cause: "High festive volume backlog approaching storage capacity limits.",
      impact: "Monitoring closely. May require priority dock assignment to prevent full delay.",
      flaggedAt: "2026-10-19 11:00 AM"
    },
    timeline: [
      {
        stage: "Cargo Verification",
        location: "Aurangabad Yard",
        timestamp: "2026-10-15 10:00 AM",
        status: "Completed",
        note: "Heavy tower frames scanned and secured."
      },
      {
        stage: "Dispatched from Supplier",
        location: "Aurangabad Hub",
        timestamp: "2026-10-16 02:00 PM",
        status: "Completed",
        note: "Container GJ-05-BX-1120 departed."
      },
      {
        stage: "Cross-dock at Surat",
        location: "Surat Logistics Park",
        timestamp: "2026-10-17 06:45 PM",
        status: "Completed",
        note: "Transfer to northern corridor express train."
      },
      {
        stage: "Regional Warehouse Receiving",
        location: "Ahmedabad Western Terminal",
        timestamp: "2026-10-19 09:00 AM",
        status: "Current (At Risk)",
        note: "⚠️ CAPACITY WARNING: Warehouse at 92% occupancy. Dwell time 20h."
      }
    ]
  },
  {
    id: "SHP-2026-4402",
    title: "Aerospace Titanium Hydraulic Valves",
    category: "Aerospace",
    priority: "Urgent",
    status: "On Schedule",
    carrier: "FedEx Critical Supply",
    transportMode: "Air Express",
    weight: "85 kg",
    packages: 4,
    value: "₹ 55,00,000",
    createdDate: "2026-10-19T06:00:00Z",
    estimatedDelivery: "2026-10-21T15:00:00Z",
    currentStageIndex: 3,
    origin: {
      name: "HAL Aerospace Component Division",
      city: "Bengaluru, Karnataka",
      lat: 12.9600,
      lng: 77.6500,
      type: "Aerospace Supplier"
    },
    intermediateHubs: [
      {
        name: "Kempegowda Int'l Air Cargo Hub",
        city: "Devanahalli, Bengaluru",
        lat: 13.1986,
        lng: 77.7066,
        type: "Air Terminal",
        dwellHours: 4,
        slaHours: 6
      },
      {
        name: "Rajiv Gandhi Air Logistics Hub",
        city: "Hyderabad",
        lat: 17.2403,
        lng: 78.4294,
        type: "Regional Hub",
        dwellHours: 3,
        slaHours: 6
      }
    ],
    destination: {
      name: "Boeing Hyderabad Maintenance Center",
      city: "Gachibowli, Hyderabad",
      lat: 17.4401,
      lng: 78.3489,
      type: "Aerospace MRO Facility"
    },
    delayAlert: {
      active: false,
      severity: "None",
      cause: "",
      impact: ""
    },
    timeline: [
      {
        stage: "AOG Security Clearance",
        location: "HAL Tech Bay",
        timestamp: "2026-10-19 06:00 AM",
        status: "Completed",
        note: "Critical aircraft-on-ground tag assigned."
      },
      {
        stage: "Supplier Dispatch",
        location: "Bengaluru City",
        timestamp: "2026-10-19 08:30 AM",
        status: "Completed",
        note: "Escorted transport to Kempegowda airport."
      },
      {
        stage: "Air Cargo Flight",
        location: "BLR to HYD",
        timestamp: "2026-10-19 02:00 PM",
        status: "Completed",
        note: "Arrived on Boeing 737 freighter."
      },
      {
        stage: "Out for Final Delivery",
        location: "Hyderabad Gachibowli Corridor",
        timestamp: "2026-10-20 09:30 AM",
        status: "Current",
        note: "In FedEx Priority Van TS-09-UB-8822. Expected delivery by 02:00 PM."
      }
    ]
  }
];

// Stages definition in supply chain order
const SUPPLY_CHAIN_STAGES = [
  { index: 0, key: "supplier_dispatched", name: "Supplier Dispatched", icon: "factory", desc: "Goods packed & dispatched from supplier source" },
  { index: 1, key: "transit_hub", name: "In Transit / Gateway Hub", icon: "truck", desc: "Moving across inter-state transport corridor or transit hub" },
  { index: 2, key: "regional_warehouse", name: "Regional Warehouse Hub", icon: "warehouse", desc: "Received, sorted, and palletized at regional fulfillment hub" },
  { index: 3, key: "out_for_delivery", name: "Out for Delivery", icon: "navigation", desc: "Dispatched on last-mile vehicle to final destination" },
  { index: 4, key: "delivered", name: "Delivered to Customer", icon: "check-circle", desc: "Delivered, inspected, and proof-of-delivery signed" }
];

// Available Predefined Hubs for easy selection during Shipment Creation
const PRESET_HUBS = [
  { name: "Pune Foxconn Hub", city: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, type: "Supplier Factory" },
  { name: "Navi Mumbai Gateway Hub", city: "Navi Mumbai, Maharashtra", lat: 19.0330, lng: 73.0297, type: "Transit Hub" },
  { name: "Nagpur Central Hub", city: "Nagpur, Maharashtra", lat: 21.1458, lng: 79.0882, type: "Regional Warehouse Hub" },
  { name: "Hyderabad ColdChain Hub", city: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867, type: "Pharma Hub" },
  { name: "Bengaluru Tech Logistics Hub", city: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946, type: "Supplier Factory" },
  { name: "Chennai Port Container Terminal", city: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707, type: "Maritime/Port Hub" },
  { name: "Delhi National Consolidation Hub", city: "New Delhi", lat: 28.6139, lng: 77.2090, type: "Central Warehouse" },
  { name: "Ahmedabad Western Terminal", city: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714, type: "Regional Warehouse" },
  { name: "Kolkata Eastern Gateway", city: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639, type: "Transit Hub" },
  { name: "Jaipur Northern Distribution Center", city: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873, type: "Distribution Hub" }
];
