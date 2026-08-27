export const products = [
  {
    name: "Ledgerline",
    tag: "Finance ops",
    desc: "Reconciliation and expense workflows for finance teams who are tired of spreadsheets that break every quarter.",
    idealFor: "Finance & accounts teams reconciling multiple bank and vendor feeds every month.",
    features: [
      "Automatic matching against bank and vendor statements",
      "Expense approval flows with audit trail",
      "Exception queue for anything that doesn't reconcile cleanly",
      "Exports straight into your existing accounting software",
    ],
  },
  {
    name: "Fieldpost",
    tag: "Field service",
    desc: "Job scheduling and proof-of-work capture for teams that work outside an office — built for spotty connectivity.",
    idealFor: "Field service and installation teams working across sites with unreliable networks.",
    features: [
      "Offline-first job cards that sync when back online",
      "Photo and signature proof-of-work capture",
      "Route-aware scheduling for field crews",
      "Live status visibility for the office team",
    ],
  },
  {
    name: "Rosterly",
    tag: "Workforce",
    desc: "Shift planning and attendance for hourly teams, with a phone-first interface that doesn't need training.",
    idealFor: "Retail, warehouse, and hourly workforces managing shift patterns across locations.",
    features: [
      "Drag-and-drop shift planning across locations",
      "Attendance via phone, no separate hardware",
      "Shift-swap requests with manager approval",
      "Payroll-ready hours export",
    ],
  },
];

export const services = [
  {
    title: "Product engineering",
    desc: "We design and build the software itself — from first prototype to the version your customers depend on daily.",
  },
  {
    title: "Platform & infrastructure",
    desc: "Systems that stay up: deployment pipelines, monitoring, and architecture that scales without a rewrite.",
  },
  {
    title: "Applied AI",
    desc: "Model integration and automation where it actually removes work, not where it just sounds impressive in a deck.",
  },
  {
    title: "Design systems",
    desc: "Interfaces built on a shared language of components, so every new feature looks like it belongs.",
  },
];

export const process = [
  { step: "Discover", desc: "We sit with the problem before touching a keyboard — talking to the people who'll use the product." },
  { step: "Design", desc: "Wireframes and prototypes get tested early, so mistakes are cheap to fix." },
  { step: "Build", desc: "Short cycles, visible progress, working software every week — not a reveal at the end." },
  { step: "Ship", desc: "Releases are boring on purpose: staged rollouts, rollback plans, no surprises." },
  { step: "Support", desc: "We stay on after launch. A product without upkeep is a liability, not an asset." },
];

export const jobs = [
  {
    title: "Senior Frontend Engineer",
    location: "Pune / Remote",
    type: "Full-time",
    desc: "Own the interface layer across our product line — React, accessibility, and a good eye for detail.",
  },
  {
    title: "Backend Engineer — Platform",
    location: "Pune",
    type: "Full-time",
    desc: "Build the services and data layer that our products run on. Comfortable with databases under real load.",
  },
  {
    title: "Product Designer",
    location: "Pune / Remote",
    type: "Full-time",
    desc: "Turn messy workflows into interfaces people don't need a manual for.",
  },
  {
    title: "QA & Release Engineer",
    location: "Pune",
    type: "Full-time",
    desc: "Keep our release process boring, in the best possible way.",
  },
];

export const blogPosts = [
  {
    title: "Why we rebuilt Rosterly's scheduling engine from scratch",
    date: "Jul 2026",
    tag: "Engineering",
    excerpt: "The old version worked — until a customer with 400 shift patterns a week found every edge case we hadn't.",
  },
  {
    title: "Designing for a phone screen your customer might be sharing",
    date: "Jun 2026",
    tag: "Design",
    excerpt: "Field teams often share one device between two shifts. That single fact changed our entire login flow.",
  },
  {
    title: "What we look for in a first engineering hire",
    date: "May 2026",
    tag: "Team",
    excerpt: "Less about the stack they know, more about how they behave when the stack breaks at 11pm.",
  },
  {
    title: "A quieter approach to applying AI in operations software",
    date: "Apr 2026",
    tag: "Product",
    excerpt: "The best use of a model in Ledgerline is the one our customers never notice is there.",
  },
];
