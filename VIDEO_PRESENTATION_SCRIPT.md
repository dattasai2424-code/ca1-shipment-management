# CA1 Video Presentation Script (5 Marks)
## Project: LogiPulse - Supply Chain Shipment Visibility & Bottleneck Tracking Interface
### Team Name: `dattasai` | Problem Statement #8
### Duration: ~4 to 5 Minutes
### Participants: Datta Sai (Leader - 12623781), Member 2 (12629667), Member 3 (12610145)

---

## Part 1: Introduction & Problem Motivation (0:00 - 1:10)
**Speaker: Datta Sai (Team Leader - 12623781)**

> *"Hello everyone and respected evaluator. My name is **Datta Sai**, Registration Number **12623781**, and I am the leader of team **dattasai**. With me are my teammates, **Registration Number 12629667** and **Registration Number 12610145**.*
>
> *Today we are presenting our CA1 Project-Based Assessment on **Problem Statement #8: Supply Chain Shipment Visibility and Bottleneck Tracking**.*
>
> *In today's interconnected global and domestic commerce, businesses continuously move critical cargo between suppliers, intermediate logistics hubs, regional warehouses, and final customer destinations. However, a major industry bottleneck is lack of real-time visibility. When goods are delayed due to warehouse sorter breakdowns, port congestion, or highway blockages, supply chain operators usually find out too late—often after customer SLAs have already failed.*
>
> *To solve this, our team engineered **LogiPulse**: a responsive, real-time shipment management system that tracks goods across 5 critical supply chain stages, automatically identifies bottlenecks when dwell times exceed SLA limits, and provides instant actionable insights."*

---

## Part 2: Architecture & Live UI Demonstration (1:10 - 2:40)
**Speaker: Team Member 2 (Registration No: 12629667)**

> *(Screen showing the active LogiPulse Dashboard)*
>
> *"Hi, I am **[Member 2 Name]**, Registration Number **12629667**. My primary role in the team was frontend design, responsive user experience, and interactive map integration.*
>
> *Here is the live demonstration of LogiPulse. On the top bar, you can immediately see our KPI summary: total consignments, in-transit cargo, active bottlenecks, on-time delivery rate, and average warehouse dwell latency.*
>
> *Notice our prominent **Bottleneck Warning Banner** at the top. It alerts operators in real-time if any hub has exceeded its dwell threshold. Clicking 'Filter Delayed Shipments' immediately isolates delayed cargo.*
>
> *On the left panel, we have a dynamic roster with search and status filters for In-Transit, Delayed, and Delivered goods. When I select a shipment—for example, this shipment of industrial microcontrollers—the right panel displays:*
> 1. *Our **5-Stage Supply Chain Milestone Track**: from Supplier Dispatched, to In Transit, Regional Warehouse, Out for Delivery, and Customer Delivered.*
> 2. *Our **Interactive Geospatial Route Map**, powered by Leaflet.js. It renders the full route connecting the factory in Pune, through Navi Mumbai and Nagpur hubs, all the way to Hosur. The route line turns red and dashed for delayed shipments, and a vehicle icon indicates current position.*
> 3. *A full **Milestone Audit Timeline** with chronological timestamps.*
>
> *We also built a one-click **Printable Shipping Manifest / Bill of Lading** generator that creates an official multimodal document ready for PDF export."*

---

## Part 3: Live Feature Demonstration & Bottleneck Logic (2:40 - 3:50)
**Speaker: Datta Sai (Team Leader - 12623781)**

> *(Screen showing Datta Sai clicking 'New Shipment' and 'Advance Stage')*
>
> *"Now, I will demonstrate our core functional features.*
>
> *First, **Shipment Creation**: Clicking 'New Shipment' opens our modal form. Let's register a consignment of 500 Solar Inverters from Bengaluru to New Delhi with Express priority. Upon submitting, the system assigns a unique tracking ID, calculates estimated arrival dates, and saves it instantly into LocalStorage.*
>
> *Next, **Transport Stage Progression**: With a single click on 'Advance Stage', our engine simulates goods moving to the next corridor milestone, automatically appending a timestamped entry to the audit timeline.*
>
> *Furthermore, if an unexpected disruption occurs, we can click 'Bottleneck Action' to flag a specific issue—such as a conveyor sorter failure or highway landslide—and log the estimated dwell hours. Notice how the status immediately updates to 'Delayed', triggering audio alerts and map highlights. When operations resolve the issue, clicking 'Resolve Delay' seamlessly restores the shipment to 'On Schedule' with full resolution notes logged."*

---

## Part 4: Analytics, History & Outcomes (3:50 - 4:45)
**Speaker: Team Member 3 (Registration No: 12610145)**

> *(Screen showing the Bottleneck Analytics tab with Chart.js graphs)*
>
> *"Hello, I am **[Member 3 Name]**, Registration Number **12610145**. My focus was on bottleneck analytics algorithms, dwell time calculations, and data reporting.*
>
> *Under our **Bottleneck Analytics** tab, we utilize Chart.js to visualize two critical metrics:*
> 1. *The **Average Dwell Time by Supply Chain Node**: comparing actual dwell hours against our 18-hour SLA threshold. This clearly highlights that Regional Warehouses suffer the greatest latency (28.5 hours).*
> 2. *The **Delay Root Cause Distribution**: showing that warehouse sorting breakdowns account for 42% of bottlenecks, followed by weather disruptions at 28%.*
>
> *We also built a **Facility Bottleneck Risk Registry** providing actionable mitigation strategies for each hub.*
>
> *Finally, under the **Shipment History** tab, dispatchers can view the complete master ledger and click 'Export to CSV / Excel' to download an auditable spreadsheet of all supply chain operations."*

---

## Part 5: Conclusion & Summary (4:45 - 5:00)
**Speaker: Datta Sai (Team Leader - 12623781)**

> *"In conclusion, **LogiPulse** fulfills 100% of the core requirements set out in CA1 Problem Statement #8. Built with modern HTML5, Tailwind CSS, Leaflet.js, and ES6 JavaScript, it is lightweight, fully responsive, and deployed live on GitHub Pages.*
>
> *Thank you very much!"*
