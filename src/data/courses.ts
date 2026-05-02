export interface Course {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  hours: string;
  level: string;
  certificate: string;
  fee: string;
  learn: string[];
  outcome: string;
  careerPaths: string[];
  talentCloud: string;
  accentColor: string;
  tools: string[];
}

export const courses: Course[] = [
  {
    id: "fintech",
    title: "Financial Technology (FinTech)",
    subtitle: "Build the future of money in Africa",
    duration: "4 WEEKS",
    hours: "24 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "N20,000",
    accentColor: "#007BFF",
    learn: [
      "How digital payment work in Africa",
      "Paystack and payment APIs",
      "Digital banking and mobile money",
      "Blockchain and cryptocurrency basics",
      "Building a FinTech product concept"
    ],
    outcome: "Design a FinTech product concept ready to pitch to investors or build as MVP.",
    careerPaths: ["Fintech Analyst", "Payment Systems developer"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Paystack API", "Flutterwave", "Stripe", "Ethereum"]
  },
  {
    id: "fullstack-web",
    title: "Full Stack Web Development",
    subtitle: "Build real websites, get paid for it",
    duration: "8 WEEKS",
    hours: "48 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "N25,000",
    accentColor: "#00AEEF",
    learn: [
      "HTML, CSS & JavaScript",
      "Responsive design for all devices",
      "Build & deploy a real website",
      "Portfolio project from week one",
      "Ready for freelance and employment"
    ],
    outcome: "Leave with a fully deployed website ready to show any employer or client.",
    careerPaths: ["Web developer", "Freelance Designer", "Frontend engineer"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["VS Code", "GitHub", "Vercel", "React", "Tailwind"]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    subtitle: "Create designs that stop the scroll.",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER",
    certificate: "VERIFIED",
    fee: "N18,000",
    accentColor: "#FFFFFF",
    learn: [
      "Design principles and colour theory",
      "Canva mastery, design at speed",
      "Adobe Photoshop fundamentals",
      "Brand identity design for businesses",
      "Social media flyers and print design"
    ],
    outcome: "Build a full brand identity kit and a portfolio of 10+ professional designs.",
    careerPaths: ["Graphics designer", "Brand designer", "Creative designer"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Canva", "Adobe Photoshop", "Illustrator", "Figma"]
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Startups",
    subtitle: "Build the next generation of African startups",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "ALL LEVELS",
    certificate: "VERIFIED",
    fee: "N20,000",
    accentColor: "#00AEEF",
    learn: [
      "Founders mindset",
      "Finding and validating business idea",
      "Business models, pricing and revenue",
      "Marketing, Sales and getting client",
      "90 day founder launch plan"
    ],
    outcome: "Launch your first validated business idea ready for customers within 90 days.",
    careerPaths: ["Founder", "Entrepreneur", "Business owner"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Notion", "Slack", "Trello", "Pitch.com", "LinkedIn"]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    subtitle: "Make any business find customers online.",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "N20,000",
    accentColor: "#007BFF",
    learn: [
      "Meta & Google Ads",
      "SEO - rank on Google for free",
      "Email marketing campaigns",
      "Content strategy that converts",
      "Analytics, reporting and ROI tracking"
    ],
    outcome: "Run a live facebook/instagram ad campaign with real budget and see results.",
    careerPaths: ["Digital marketer", "Ads specialist"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Meta Ads Manager", "Google Analytics", "SEMRush", "Mailchimp"]
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    subtitle: "Master the tools of the intelligent age",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "INTERMEDIATE",
    certificate: "VERIFIED",
    fee: "N30,000",
    accentColor: "#7C3AED",
    learn: [
      "Python for AI and Data Science",
      "Prompt engineering and LLMs",
      "Building AI-powered applications",
      "Neural networks fundamentals",
      "Ethics and safety in AI"
    ],
    outcome: "Develop and deploy a custom AI model or agent for a real-world use case.",
    careerPaths: ["AI Engineer", "ML Researcher", "Data Scientist"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Python", "PyTorch", "OpenAI API", "Jupyter Notebooks", "HuggingFace"]
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    subtitle: "Design experiences users will love",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "N20,000",
    accentColor: "#F59E0B",
    learn: [
      "User research and personas",
      "Wireframing and Prototyping (Figma)",
      "Visual hierarchy and typography",
      "Usability testing and iteration",
      "Design systems and handoff"
    ],
    outcome: "Complete a full case study and high-fidelity prototype ready for your portfolio.",
    careerPaths: ["Product Designer", "UI Designer", "UX Researcher"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Figma", "FigJam", "Miro", "Maze", "Zeplin"]
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    subtitle: "Turn raw data into actionable insights",
    duration: "8 WEEKS",
    hours: "48 HRS",
    level: "INTERMEDIATE",
    certificate: "VERIFIED",
    fee: "N25,000",
    accentColor: "#10B981",
    learn: [
      "Statistical analysis and probability",
      "SQL for data retrieval",
      "Data visualization with Tableau/PowerBI",
      "Predictive modeling basics",
      "Storytelling with data"
    ],
    outcome: "Produce a comprehensive data report and dashboard for a partner company.",
    careerPaths: ["Data Analyst", "Business Intelligence Analyst", "Data Strategist"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["SQL", "Tableau", "PowerBI", "Excel", "Pandas"]
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Strategy",
    subtitle: "Defend the digital frontier",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "ADVANCED",
    certificate: "VERIFIED",
    fee: "N25,000",
    accentColor: "#EF4444",
    learn: [
      "Network security and firewalls",
      "Ethical hacking and pentesting",
      "Risk management and compliance",
      "Incident response planning",
      "Cloud security architecture"
    ],
    outcome: "Conduct a security audit and develop a defense strategy for an enterprise network.",
    careerPaths: ["Security Analyst", "Ethical Hacker", "Security Consultant"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Kali Linux", "Wireshark", "Metasploit", "Nmap", "AWS GuardDuty"]
  },
  {
    id: "product-management",
    title: "Product Management",
    subtitle: "Lead the lifecycle of great products",
    duration: "4 WEEKS",
    hours: "24 HRS",
    level: "ALL LEVELS",
    certificate: "VERIFIED",
    fee: "N22,000",
    accentColor: "#3B82F6",
    learn: [
      "Agile and Scrum methodologies",
      "Product roadmap and strategy",
      "Market research and validation",
      "Growth hacking and metrics",
      "Stakeholder management"
    ],
    outcome: "Define a product vision, roadmap, and PRD for a new tech venture.",
    careerPaths: ["Product Manager", "Product Owner", "Program Manager"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Jira", "Confluence", "Productboard", "Mixpanel", "Google Analytics"]
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    subtitle: "Build apps for the world's pockets",
    duration: "8 WEEKS",
    hours: "48 HRS",
    level: "INTERMEDIATE",
    certificate: "VERIFIED",
    fee: "N28,000",
    accentColor: "#6366F1",
    learn: [
      "Cross-platform dev with Flutter/React Native",
      "Native mobile features (Camera, GPS)",
      "App state management",
      "API integration and storage",
      "App Store/Play Store deployment"
    ],
    outcome: "Launch a fully functional mobile app on both iOS and Android platforms.",
    careerPaths: ["Mobile Developer", "App Architect", "Software Engineer"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Flutter", "Dart", "Firebase", "Xcode", "Android Studio"]
  },
  {
    id: "blockchain-web3",
    title: "Blockchain & Web3",
    subtitle: "Decentralize the future",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "ADVANCED",
    certificate: "VERIFIED",
    fee: "N30,000",
    accentColor: "#F43F5E",
    learn: [
      "Smart contract dev with Solidity",
      "DApp architecture and deployment",
      "Tokenomics and DAO governance",
      "Web3.js and Ethers.js integration",
      "NFT and DeFi protocols"
    ],
    outcome: "Build and deploy a decentralized application (DApp) on an Ethereum-compatible chain.",
    careerPaths: ["Blockchain Developer", "Web3 Engineer", "Smart Contract Auditor"],
    talentCloud: "Graduates get added to our Nigerian verified talent database",
    tools: ["Solidity", "Hardhat", "Metamask", "Infura", "The Graph"]
  }
];
