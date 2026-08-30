// Central content for the portfolio. Edit values here to update the site.

/*
  Contact form (Web3Forms, free: 250 submissions/month, no account needed).

  Setup, once:
    1. Go to https://web3forms.com
    2. Type the email you want messages delivered to, press "Create Access Key"
    3. They email you a key that looks like: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
    4. Paste it below, replacing PASTE_YOUR_KEY_HERE

  This key is meant to be public: it only allows *sending* a message to your
  inbox, and your email address never appears in the page source. Until it is
  set, the form tells the visitor to email directly instead of failing silently.
*/
export const WEB3FORMS_KEY = "b04dd01f-4208-4f2f-870b-c258b5d42bf2";

export const profile = {
  name: "Rejil Raj PR",
  role: "Full-Stack Software Development Engineer",
  location: "Chennai, India",
  eyebrow: "Full-Stack SDE / Chennai",
  // The hero layers this image between two lines of display type, so a
  // background-removed cut-out (transparent PNG) looks best here. Drop it at
  // app/public/rejil.png. A plain photo also works: it is masked with a soft
  // vignette. Point this at /rejil.jpg if you keep a JPG.
  photo: "/rejil.png",
  intro:
    "I build real-time and AI products: voice interview platforms, WebRTC identity verification, and fintech apps, across the full stack.",
  email: "rejilrajpr3@gmail.com",
  resume: "/Rejil_Raj_PR.pdf",
  socials: [
    { label: "GitHub", handle: "github.com/rejilraj", href: "https://github.com/rejilraj" },
    { label: "LinkedIn", handle: "linkedin.com/in/rejil-raj-pr", href: "https://linkedin.com/in/rejil-raj-pr" },
  ],
};

export const hero = {
  greeting: "my name is Rejil Raj PR, and I work as a",
  lineTop: "Full-Stack",
  lineBottom: "& AI Engineer",
  location: "based in Chennai, India.",
};

export const about = {
  body: [
    "Four years across web, mobile, AI, and IoT. At Renambl I owned full-stack delivery for an AI products lab: a real-time voice interview platform with a lip-synced 3D avatar, a WebRTC video KYC flow, and three connected apps for a fintech platform.",
    "Now at Tech Mahindra I work on the other side of the same coin: finding and closing security vulnerabilities across Java and React codebases before they reach production.",
  ],
  stats: [
    { value: "4+", label: "years shipping production software" },
    { value: "50%", label: "lower API latency on the analytics platform" },
    { value: "40%", label: "faster field inventory tracking" },
    { value: "3", label: "connected apps built for one fintech platform" },
  ],
};

export type Job = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export const experience: Job[] = [
  {
    company: "Tech Mahindra",
    role: "Software Development Engineer",
    period: "Jun 2025 - Present",
    points: [
      "Remediate enterprise-scale security vulnerabilities across Java backend and React.js frontend systems surfaced by audits and automated scans.",
      "Harden platforms with input validation, authentication and authorization fixes, and dependency-vulnerability upgrades across production apps.",
    ],
  },
  {
    company: "Renambl Technology",
    role: "SDE, Application Developer (AI Products R&D)",
    period: "Oct 2022 - Nov 2024",
    points: [
      "Built a real-time AI interview platform with a lip-synced 3D avatar in Three.js: speech to text, Grok LLM responses, and voice replies synced to visemes in real time.",
      "Engineered a browser-based code editor from scratch to run live coding rounds inside that platform, with real-time execution and evaluation.",
      "Cut API latency by 50% leading a sound-box tracking and analytics platform in React, React Native, Node, and MongoDB through schema and caching work.",
      "Delivered admin, customer, and staff apps for the Kaasu finance platform, owning frontend, backend, and API design end to end.",
    ],
  },
  {
    company: "MakeEasyFilings",
    role: "React JS Developer",
    period: "Aug 2021 - Sep 2022",
    points: [
      "Shipped a production website end to end, meeting functional, security, performance, and accessibility benchmarks before launch.",
      "Built responsive, accessible UI with React.js, Material UI, and SASS, and improved stability through continuous refactoring and performance tuning.",
    ],
  },
];

export type Project = {
  name: string;
  tag: string;
  blurb: string;
  stack: string[];
  span: "wide" | "tall" | "std";
  accent: "cyan" | "violet" | "amber" | "rose";
};

export const projects: Project[] = [
  {
    name: "AI Interview Platform",
    tag: "Real-time voice AI",
    blurb:
      "A lip-synced 3D avatar that interviews candidates for any role. Speech to text, Grok LLM reasoning, and viseme-synced voice replies, with a built-from-scratch code editor for live coding rounds.",
    stack: ["Three.js", "WebRTC", "Grok LLM", "Node.js"],
    span: "wide",
    accent: "cyan",
  },
  {
    name: "Kaasu Fintech Suite",
    tag: "Full-stack product",
    blurb:
      "Admin panel, customer app, and staff app for one finance platform, with frontend, backend, and API design owned end to end.",
    stack: ["React", "React Native", "Express", "MongoDB"],
    span: "std",
    accent: "violet",
  },
  {
    name: "WebRTC Video KYC",
    tag: "Secure real-time",
    blurb:
      "Encrypted, real-time identity verification in React Native, working across devices with a live agent on the call.",
    stack: ["React Native", "WebRTC", "Encryption"],
    span: "std",
    accent: "amber",
  },
  {
    name: "Sound-box Analytics",
    tag: "IoT + analytics",
    blurb:
      "Tracking and analytics for field payment devices. Schema optimization and caching brought API latency down by half.",
    stack: ["React", "Node.js", "Redis", "MongoDB"],
    span: "tall",
    accent: "rose",
  },
  {
    name: "News Video Pipeline",
    tag: "Independent project",
    blurb:
      "Scrapes tech news, generates narration, and renders a lip-synced avatar with automated background removal, end to end.",
    stack: ["Python", "OpenVoice", "Whisper", "Wav2Lip"],
    span: "std",
    accent: "cyan",
  },
  {
    name: "Auto Object Detection",
    tag: "Independent project",
    blurb:
      "A self-annotating pipeline that scrapes and labels images, fine-tunes YOLOv8, and deploys the model for live detection.",
    stack: ["YOLOv8", "Ultralytics", "OpenCV"],
    span: "wide",
    accent: "violet",
  },
];

export const skillGroups: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Python", "C++", "SQL"],
  },
  {
    label: "Frontend & Mobile",
    items: ["React", "React Native", "Next.js", "Three.js", "Redux", "SASS", "Material UI"],
  },
  {
    label: "Backend & APIs",
    items: ["Node.js", "Express", "REST", "GraphQL", "WebSockets", "WebRTC"],
  },
  {
    label: "Data & Infra",
    items: ["MongoDB", "MySQL", "Redis", "ChromaDB", "Azure", "Docker", "Kubernetes"],
  },
  {
    label: "AI / ML",
    items: ["LLM integration", "RAG pipelines", "TensorFlow", "PyTorch", "Hugging Face", "OpenCV"],
  },
  {
    label: "Practices",
    items: ["Agile / Scrum", "TDD", "Jest", "System design", "Secure coding", "CI/CD"],
  },
];

// Simple Icons slugs for the tech marquee.
export const marqueeIcons = [
  "react", "typescript", "javascript", "nodedotjs", "nextdotjs", "python",
  "mongodb", "redis", "graphql", "docker", "kubernetes", "tensorflow",
  "pytorch", "opencv", "threedotjs", "express", "webrtc", "sass",
];

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
];
