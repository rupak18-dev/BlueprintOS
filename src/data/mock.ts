export type Status = "new" | "active" | "won" | "lost" | "hold" | "done";

export const studio = {
  name: "Canvas",
  tagline: "Interior design studio · Bengaluru",
  plan: "Studio Pro",
  seats: 12,
  seatsUsed: 8,
};

export const kpis = [
  { label: "Open leads", value: "18", delta: "+4 this week", tone: "brass" },
  { label: "Active projects", value: "9", delta: "2 nearing handover", tone: "muted" },
  { label: "Quotations sent", value: "₹1.42 Cr", delta: "6 awaiting approval", tone: "muted" },
  { label: "Collected this month", value: "₹38.6 L", delta: "₹12.4 L overdue", tone: "muted" },
];

export const pipeline = [
  { stage: "New", count: 7, value: "₹64 L" },
  { stage: "Qualified", count: 5, value: "₹1.1 Cr" },
  { stage: "Site visit", count: 3, value: "₹72 L" },
  { stage: "Quotation", count: 6, value: "₹1.42 Cr" },
  { stage: "Negotiation", count: 2, value: "₹48 L" },
  { stage: "Won", count: 4, value: "₹2.05 Cr" },
];

export { leads, type Lead } from "./leads";

export const revenueSeries = [
  { month: "Apr", quoted: 62, collected: 41 },
  { month: "May", quoted: 74, collected: 52 },
  { month: "Jun", quoted: 58, collected: 47 },
  { month: "Jul", quoted: 91, collected: 63 },
  { month: "Aug", quoted: 86, collected: 71 },
  { month: "Sep", quoted: 104, collected: 78 },
];

export const LEAD_STATUSES = [
  "New",
  "Qualified",
  "Site visit",
  "Quotation",
  "Negotiation",
  "Won",
  "Lost",
];

export const LEAD_SOURCES = ["Website", "Referral", "Instagram", "Walk-in", "Houzz", "Architect"];

export const LEAD_OWNERS = ["Meera Nair", "Devansh Shah", "Priya Das"];

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Independent house",
  "Studio apartment",
  "Penthouse",
  "Office",
  "Retail store",
  "Café / Restaurant",
  "Co-working",
];

export const WORK_TYPES = [
  "Full home turnkey",
  "Modular kitchen",
  "Wardrobes",
  "Renovation",
  "Commercial fitout",
  "Office fitout",
  "Furniture only",
  "Compact home",
];

export const ROOM_OPTIONS = [
  "Living room",
  "Kitchen",
  "Bedrooms",
  "Bathrooms",
  "Dining",
  "Study",
  "Kids room",
  "Balcony",
  "Pooja room",
  "Home theatre",
];

export const STYLE_OPTIONS = [
  "Modern minimal",
  "Contemporary",
  "Traditional",
  "Industrial",
  "Bohemian",
  "Japandi",
  "Art deco",
];

export const BUDGET_RANGES = [
  { label: "Under ₹10 L", min: 0, max: 1_000_000 },
  { label: "₹10 L – ₹25 L", min: 1_000_000, max: 2_500_000 },
  { label: "₹25 L – ₹50 L", min: 2_500_000, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "Above ₹1 Cr", min: 10_000_000, max: Number.MAX_SAFE_INTEGER },
];

export function formatBudget(value: number): string {
  if (value >= 10_000_000) {
    const cr = value / 10_000_000;
    return `₹${Number.isInteger(cr) ? cr : cr.toFixed(2)} Cr`;
  }
  if (value >= 100_000) {
    const l = value / 100_000;
    return `₹${Number.isInteger(l) ? l : l.toFixed(1)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export type Project = {
  id: string;
  name: string;
  client: string;
  type: string;
  value: string;
  progress: number;
  stage: string;
  manager: string;
  start: string;
  handover: string;
  rooms: { room: string; status: string; designer: string }[];
  milestones: { name: string; date: string; state: string }[];
  budget: { head: string; planned: string; actual: string }[];
  team: { name: string; role: string }[];
};

export const projects: Project[] = [
  {
    id: "PRJ-118",
    name: "Prestige Lakeside 4BHK",
    client: "Ananya Rao",
    type: "Residential turnkey",
    value: "₹34.8 L",
    progress: 68,
    stage: "Execution",
    manager: "Meera Nair",
    start: "12 Jun 2026",
    handover: "28 Oct 2026",
    rooms: [
      { room: "Living & dining", status: "Approved", designer: "Kavya R" },
      { room: "Kitchen", status: "In production", designer: "Kavya R" },
      { room: "Master bedroom", status: "Approved", designer: "Arjun P" },
      { room: "Kids bedroom", status: "In review", designer: "Arjun P" },
    ],
    milestones: [
      { name: "Design sign-off", date: "02 Jul 2026", state: "Done" },
      { name: "Advance 50%", date: "05 Jul 2026", state: "Done" },
      { name: "Factory dispatch", date: "18 Sep 2026", state: "In progress" },
      { name: "Site installation", date: "06 Oct 2026", state: "Upcoming" },
      { name: "Handover", date: "28 Oct 2026", state: "Upcoming" },
    ],
    budget: [
      { head: "Modular", planned: "₹14.2 L", actual: "₹13.8 L" },
      { head: "Civil & finishes", planned: "₹8.4 L", actual: "₹9.1 L" },
      { head: "Furnishing", planned: "₹5.6 L", actual: "₹4.2 L" },
      { head: "Site & labour", planned: "₹6.6 L", actual: "₹5.9 L" },
    ],
    team: [
      { name: "Meera Nair", role: "Project manager" },
      { name: "Kavya R", role: "Lead designer" },
      { name: "Arjun P", role: "Designer" },
      { name: "Suresh K", role: "Site supervisor" },
    ],
  },
  {
    id: "PRJ-115",
    name: "Brew Lane Cafe",
    client: "Rohit Menon",
    type: "Commercial fitout",
    value: "₹41.2 L",
    progress: 42,
    stage: "Design",
    manager: "Devansh Shah",
    start: "01 Aug 2026",
    handover: "15 Dec 2026",
    rooms: [
      { room: "Dining hall", status: "In review", designer: "Nisha B" },
      { room: "Bar counter", status: "In design", designer: "Nisha B" },
    ],
    milestones: [
      { name: "Concept presentation", date: "20 Aug 2026", state: "Done" },
      { name: "Design sign-off", date: "22 Sep 2026", state: "In progress" },
      { name: "Handover", date: "15 Dec 2026", state: "Upcoming" },
    ],
    budget: [
      { head: "Joinery", planned: "₹14.2 L", actual: "₹2.1 L" },
      { head: "MEP", planned: "₹6.4 L", actual: "₹0.0 L" },
    ],
    team: [
      { name: "Devansh Shah", role: "Project manager" },
      { name: "Nisha B", role: "Lead designer" },
    ],
  },
  {
    id: "PRJ-109",
    name: "Kapoor Villa Refresh",
    client: "Saira Kapoor",
    type: "Renovation",
    value: "₹62.5 L",
    progress: 88,
    stage: "Handover",
    manager: "Meera Nair",
    start: "04 Mar 2026",
    handover: "20 Sep 2026",
    rooms: [
      { room: "Living", status: "Approved", designer: "Kavya R" },
      { room: "Home theatre", status: "Approved", designer: "Arjun P" },
    ],
    milestones: [
      { name: "Snag list", date: "12 Sep 2026", state: "In progress" },
      { name: "Handover", date: "20 Sep 2026", state: "Upcoming" },
    ],
    budget: [{ head: "Civil & finishes", planned: "₹22.0 L", actual: "₹23.4 L" }],
    team: [{ name: "Meera Nair", role: "Project manager" }],
  },
  {
    id: "PRJ-104",
    name: "Iyer Studio Apartment",
    client: "Tarun Iyer",
    type: "Compact home",
    value: "₹8.6 L",
    progress: 100,
    stage: "Completed",
    manager: "Priya Das",
    start: "10 Jan 2026",
    handover: "30 Apr 2026",
    rooms: [{ room: "Studio", status: "Approved", designer: "Priya Das" }],
    milestones: [{ name: "Handover", date: "30 Apr 2026", state: "Done" }],
    budget: [{ head: "Compact package", planned: "₹8.6 L", actual: "₹8.4 L" }],
    team: [{ name: "Priya Das", role: "Designer" }],
  },
];

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  since: string;
  projects: string[];
  value: string;
  notes: string;
};

export const clients: Client[] = [
  {
    id: "CL-071",
    name: "Ananya Rao",
    company: "—",
    email: "ananya.rao@example.com",
    phone: "+91 98450 11234",
    city: "Bengaluru",
    since: "Jun 2026",
    projects: ["PRJ-118"],
    value: "₹34.8 L",
    notes: "Prefers WhatsApp updates. Approvals usually within 2 days.",
  },
  {
    id: "CL-068",
    name: "Rohit Menon",
    company: "Brew Lane Hospitality",
    email: "rohit@brewlane.in",
    phone: "+91 99000 88213",
    city: "Bengaluru",
    since: "Aug 2026",
    projects: ["PRJ-115"],
    value: "₹41.2 L",
    notes: "Wants weekly site photos. Second outlet planned for 2027.",
  },
  {
    id: "CL-059",
    name: "Saira Kapoor",
    company: "—",
    email: "saira.k@example.com",
    phone: "+91 98860 44121",
    city: "Bengaluru",
    since: "Mar 2026",
    projects: ["PRJ-109"],
    value: "₹62.5 L",
    notes: "Referral source for two leads.",
  },
  {
    id: "CL-041",
    name: "Tarun Iyer",
    company: "—",
    email: "tarun.iyer@example.com",
    phone: "+91 90080 71190",
    city: "Bengaluru",
    since: "Jan 2026",
    projects: ["PRJ-104"],
    value: "₹8.6 L",
    notes: "Completed project. Open to review and testimonial.",
  },
];

export const invoices = [
  {
    id: "INV-2261",
    client: "Ananya Rao",
    project: "PRJ-118",
    amount: "₹8,70,000",
    due: "22 Sep 2026",
    status: "Overdue",
  },
  {
    id: "INV-2258",
    client: "Rohit Menon",
    project: "PRJ-115",
    amount: "₹12,36,000",
    due: "30 Sep 2026",
    status: "Sent",
  },
  {
    id: "INV-2247",
    client: "Saira Kapoor",
    project: "PRJ-109",
    amount: "₹15,62,500",
    due: "12 Sep 2026",
    status: "Paid",
  },
  {
    id: "INV-2239",
    client: "Ananya Rao",
    project: "PRJ-118",
    amount: "₹17,40,000",
    due: "05 Jul 2026",
    status: "Paid",
  },
];

export const payments = [
  {
    id: "PMT-881",
    date: "12 Sep 2026",
    client: "Saira Kapoor",
    mode: "NEFT",
    amount: "₹15,62,500",
  },
  { id: "PMT-874", date: "05 Jul 2026", client: "Ananya Rao", mode: "UPI", amount: "₹17,40,000" },
  { id: "PMT-869", date: "28 Jun 2026", client: "Tarun Iyer", mode: "Cheque", amount: "₹4,20,000" },
];

export const expenses = [
  {
    id: "EXP-512",
    date: "10 Sep 2026",
    head: "Site labour",
    project: "PRJ-118",
    amount: "₹1,84,000",
  },
  { id: "EXP-508", date: "06 Sep 2026", head: "Hardware", project: "PRJ-118", amount: "₹96,400" },
  { id: "EXP-501", date: "02 Sep 2026", head: "Transport", project: "PRJ-115", amount: "₹38,200" },
];

export const crew = [
  {
    id: "ST-12",
    name: "Meera Nair",
    role: "Project manager",
    type: "Staff",
    projects: 3,
    rate: "—",
    phone: "+91 98801 20011",
    status: "Active",
  },
  {
    id: "ST-09",
    name: "Kavya R",
    role: "Lead designer",
    type: "Staff",
    projects: 2,
    rate: "—",
    phone: "+91 98801 20009",
    status: "Active",
  },
  {
    id: "ST-14",
    name: "Arjun P",
    role: "Designer",
    type: "Staff",
    projects: 2,
    rate: "—",
    phone: "+91 98801 20014",
    status: "Active",
  },
  {
    id: "CR-31",
    name: "Suresh K",
    role: "Site supervisor",
    type: "Crew",
    projects: 4,
    rate: "₹1,800/day",
    phone: "+91 90190 33121",
    status: "On site",
  },
  {
    id: "CR-44",
    name: "Faizal Carpentry",
    role: "Carpentry vendor",
    type: "Vendor crew",
    projects: 2,
    rate: "Contract",
    phone: "+91 90190 44412",
    status: "Active",
  },
  {
    id: "CR-52",
    name: "Ravi Electricals",
    role: "Electrical vendor",
    type: "Vendor crew",
    projects: 3,
    rate: "Contract",
    phone: "+91 90190 52218",
    status: "Active",
  },
];

export const assets = [
  {
    id: "AS-1201",
    name: "Cane back lounge chair",
    category: "Seating",
    material: "Teak + cane",
    finish: "Natural",
    size: "680 × 720 mm",
    price: "₹18,400",
    vendor: "Studio Kaya",
  },
  {
    id: "AS-1188",
    name: "Fluted oak sideboard",
    category: "Storage",
    material: "Oak veneer",
    finish: "Matte lacquer",
    size: "1800 × 450 mm",
    price: "₹64,000",
    vendor: "Woodline",
  },
  {
    id: "AS-1174",
    name: "Terrazzo counter slab",
    category: "Surfaces",
    material: "Terrazzo",
    finish: "Honed",
    size: "2400 × 700 mm",
    price: "₹1,240/sq ft",
    vendor: "StoneCo",
  },
  {
    id: "AS-1160",
    name: "Linen roman blind",
    category: "Soft furnishing",
    material: "Linen blend",
    finish: "Ivory",
    size: "Custom",
    price: "₹420/sq ft",
    vendor: "Drape House",
  },
  {
    id: "AS-1142",
    name: "Brass pendant cluster",
    category: "Lighting",
    material: "Brass",
    finish: "Antique brass",
    size: "3 × 200 mm",
    price: "₹26,800",
    vendor: "Lumen Works",
  },
  {
    id: "AS-1129",
    name: "Micro-cement wall finish",
    category: "Finishes",
    material: "Micro-cement",
    finish: "Sand",
    size: "Per sq ft",
    price: "₹310/sq ft",
    vendor: "Surface Lab",
  },
];

export const purchaseOrders = [
  {
    id: "PO-3341",
    vendor: "Woodline",
    project: "PRJ-118",
    items: 14,
    amount: "₹6,84,000",
    eta: "24 Sep 2026",
    status: "In transit",
  },
  {
    id: "PO-3336",
    vendor: "Lumen Works",
    project: "PRJ-118",
    items: 9,
    amount: "₹1,42,600",
    eta: "18 Sep 2026",
    status: "Delivered",
  },
  {
    id: "PO-3330",
    vendor: "StoneCo",
    project: "PRJ-115",
    items: 4,
    amount: "₹3,26,000",
    eta: "02 Oct 2026",
    status: "Ordered",
  },
  {
    id: "PO-3322",
    vendor: "Drape House",
    project: "PRJ-109",
    items: 22,
    amount: "₹88,400",
    eta: "12 Sep 2026",
    status: "Delivered",
  },
];

export const tasks = [
  {
    id: "TK-901",
    title: "Send revised kitchen quote",
    project: "PRJ-118",
    assignee: "Meera Nair",
    due: "Today",
    priority: "High",
    state: "In progress",
  },
  {
    id: "TK-898",
    title: "Upload 3D walkthrough for client review",
    project: "PRJ-115",
    assignee: "Nisha B",
    due: "Tomorrow",
    priority: "High",
    state: "To do",
  },
  {
    id: "TK-893",
    title: "Snag list walkthrough",
    project: "PRJ-109",
    assignee: "Suresh K",
    due: "12 Sep",
    priority: "Medium",
    state: "In progress",
  },
  {
    id: "TK-887",
    title: "Collect GST details from vendor",
    project: "PRJ-118",
    assignee: "Priya Das",
    due: "14 Sep",
    priority: "Low",
    state: "To do",
  },
  {
    id: "TK-880",
    title: "Archive final drawings",
    project: "PRJ-104",
    assignee: "Priya Das",
    due: "Done",
    priority: "Low",
    state: "Done",
  },
];

export const events = [
  {
    id: "EV-71",
    title: "Site visit — Whitefield",
    time: "10:00 – 11:30",
    day: "Tue 8 Sep",
    type: "Site visit",
    with: "Ananya Rao",
  },
  {
    id: "EV-72",
    title: "Design presentation — Brew Lane",
    time: "15:00 – 16:00",
    day: "Tue 8 Sep",
    type: "Presentation",
    with: "Rohit Menon",
  },
  {
    id: "EV-73",
    title: "Factory dispatch review",
    time: "11:00 – 12:00",
    day: "Wed 9 Sep",
    type: "Internal",
    with: "Production team",
  },
  {
    id: "EV-74",
    title: "Snag walkthrough — Kapoor Villa",
    time: "09:30 – 11:00",
    day: "Thu 10 Sep",
    type: "Site visit",
    with: "Saira Kapoor",
  },
  {
    id: "EV-75",
    title: "New lead call — Hebbal duplex",
    time: "17:00 – 17:30",
    day: "Fri 11 Sep",
    type: "Call",
    with: "Nikhil Sharma",
  },
];

export const files = [
  {
    id: "F-511",
    name: "PRJ-118 Kitchen GA drawings.pdf",
    project: "PRJ-118",
    type: "Drawing",
    size: "4.2 MB",
    by: "Kavya R",
    date: "10 Sep 2026",
  },
  {
    id: "F-508",
    name: "Living room render v3.jpg",
    project: "PRJ-118",
    type: "Render",
    size: "8.1 MB",
    by: "Arjun P",
    date: "09 Sep 2026",
  },
  {
    id: "F-502",
    name: "Brew Lane signed quotation.pdf",
    project: "PRJ-115",
    type: "Quotation",
    size: "1.1 MB",
    by: "Devansh Shah",
    date: "05 Sep 2026",
  },
  {
    id: "F-497",
    name: "Kapoor Villa snag list.xlsx",
    project: "PRJ-109",
    type: "Sheet",
    size: "320 KB",
    by: "Suresh K",
    date: "02 Sep 2026",
  },
];

export const threads = [
  {
    id: "TH-31",
    subject: "Kitchen shutter finish options",
    with: "Ananya Rao",
    project: "PRJ-118",
    last: "Can we see the fluted option in walnut?",
    when: "12 min ago",
    unread: 2,
  },
  {
    id: "TH-29",
    subject: "Bar counter lighting",
    with: "Rohit Menon",
    project: "PRJ-115",
    last: "Shared the reference images.",
    when: "3 hours ago",
    unread: 0,
  },
  {
    id: "TH-26",
    subject: "Snag list closure",
    with: "Saira Kapoor",
    project: "PRJ-109",
    last: "Two items pending from carpentry.",
    when: "Yesterday",
    unread: 1,
  },
];

export const notifications = [
  {
    id: "N-91",
    title: "Client approved Master bedroom design",
    meta: "PRJ-118 · 20 min ago",
    type: "Approval",
  },
  {
    id: "N-90",
    title: "Invoice INV-2261 is overdue by 3 days",
    meta: "Accounts · 2 hours ago",
    type: "Finance",
  },
  {
    id: "N-89",
    title: "PO-3341 dispatched from Woodline",
    meta: "Procurement · 5 hours ago",
    type: "Procurement",
  },
  {
    id: "N-88",
    title: "New lead from website: Hebbal duplex",
    meta: "Leads · Yesterday",
    type: "Lead",
  },
];

export const plans = [
  {
    name: "Solo",
    price: "₹1,499",
    period: "per month",
    for: "Independent designers",
    features: [
      "1 designer seat",
      "5 active projects",
      "2D planner + 3D studio",
      "Client presentation links",
      "Basic quotations",
    ],
  },
  {
    name: "Studio Pro",
    price: "₹4,999",
    period: "per month",
    for: "Growing studios",
    features: [
      "12 seats",
      "Unlimited projects",
      "VR walkthroughs",
      "Procurement & accounts",
      "Crew management",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    for: "Multi-branch firms",
    features: [
      "Unlimited seats",
      "Custom asset library",
      "Branch-wise reporting",
      "API access",
      "Dedicated success manager",
    ],
  },
];

export const helpArticles = [
  { title: "Creating your first project from a won lead", cat: "Getting started", read: "4 min" },
  { title: "Drawing accurate walls in the 2D planner", cat: "2D Planner", read: "6 min" },
  {
    title: "Preparing a VR walkthrough for a client meeting",
    cat: "3D / VR Studio",
    read: "5 min",
  },
  { title: "Building a quotation from room estimates", cat: "Quotations", read: "7 min" },
  { title: "Tracking purchase orders and deliveries", cat: "Procurement", read: "5 min" },
  { title: "Inviting crew and setting permissions", cat: "Team", read: "3 min" },
];

export const gallery = [
  { title: "Lakeside living room", tag: "Residential", tone: "from-brass/40" },
  { title: "Brew Lane cafe", tag: "Commercial", tone: "from-chart-2/40" },
  { title: "Fluted oak kitchen", tag: "Kitchen", tone: "from-chart-4/40" },
  { title: "Home theatre", tag: "Residential", tone: "from-chart-5/40" },
  { title: "Terrazzo bath", tag: "Bathroom", tone: "from-chart-3/40" },
  { title: "Studio apartment", tag: "Compact", tone: "from-accent" },
];
