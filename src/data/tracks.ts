import { 
  BrainCircuit, 
  BarChart3, 
  Code, 
  ShieldCheck, 
  Megaphone, 
  Rocket, 
  Target 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TrackModule {
  title: string;
  description: string;
}

export interface Track {
  name: string;
  slug: string;
  image: string;
  icon: LucideIcon;
  desc: string;
  overview: string;
  targetAudience: string;
  modules: TrackModule[];
}

export const tracks: Track[] = [
  {
    name: "AI Fundamentals",
    slug: "ai-fundamentals",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800",
    icon: BrainCircuit,
    desc: "Master the basics of Generative AI and prompt engineering.",
    overview: "Step into the future of computing by understanding how Artificial Intelligence is transforming industries globally. The AI Fundamentals track is designed to demystify generative AI, large language models, and practical AI applications. You will learn not just the theory behind AI, but how to effectively use tools like ChatGPT, Claude, and Midjourney to augment your daily workflows.",
    targetAudience: "Professionals looking to integrate AI into their work, aspiring AI engineers, and tech enthusiasts.",
    modules: [
      { title: "Introduction to AI", description: "Understand the history, evolution, and core concepts of Artificial Intelligence and Machine Learning." },
      { title: "Generative AI Basics", description: "Explore how LLMs work, tokenization, and the principles behind text and image generation." },
      { title: "Prompt Engineering", description: "Master the art of crafting effective prompts to get the best possible outputs from AI tools." },
      { title: "AI Ethics & Safety", description: "Learn about bias, copyright issues, and the ethical implications of using AI in production." },
      { title: "Workflow Automation", description: "Integrate AI tools into your daily processes to save time and boost productivity." }
    ]
  },
  {
    name: "Data Analysis",
    slug: "data-analysis",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    icon: BarChart3,
    desc: "Turning raw data into strategic insights for decision making.",
    overview: "Data is the new oil, but it requires refining. Our Data Analysis track equips you with the skills to extract, clean, and interpret complex data sets. From basic spreadsheet manipulations to advanced visualizations, this track prepares you to become a data-driven decision maker. Learn the industry-standard tools required to turn numbers into actionable business strategies.",
    targetAudience: "Business analysts, aspiring data scientists, and managers who need to make data-driven decisions.",
    modules: [
      { title: "Data Collection & Cleaning", description: "Learn how to gather data from various sources and prepare it for analysis using advanced Excel and SQL techniques." },
      { title: "Statistical Fundamentals", description: "Grasp the core statistical concepts necessary for analyzing trends and distributions." },
      { title: "Data Visualization", description: "Create compelling dashboards and reports using tools like Power BI, Tableau, and Python libraries." },
      { title: "Exploratory Data Analysis", description: "Discover hidden patterns, spot anomalies, and test hypotheses using real-world datasets." },
      { title: "Storytelling with Data", description: "Communicate your findings effectively to non-technical stakeholders through clear, impactful presentations." }
    ]
  },
  {
    name: "Programming",
    slug: "programming",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
    icon: Code,
    desc: "Software development from web apps to system infrastructure.",
    overview: "The Programming track is a comprehensive journey from writing your first line of code to building full-stack applications. Focusing on modern programming languages and frameworks, this curriculum emphasizes clean architecture, algorithmic thinking, and real-world problem solving. Whether you aim to build the next big app or maintain critical infrastructure, this track is your foundation.",
    targetAudience: "Aspiring software engineers, front-end and back-end developers, and computer science students.",
    modules: [
      { title: "Programming Fundamentals", description: "Master variables, loops, conditionals, and data structures using Python and JavaScript." },
      { title: "Front-End Development", description: "Build interactive, responsive user interfaces using HTML5, CSS3, and modern frameworks like React." },
      { title: "Back-End & APIs", description: "Create robust server-side applications, design RESTful APIs, and manage database integrations." },
      { title: "Version Control & Git", description: "Learn how to collaborate effectively in a team environment using Git and GitHub workflows." },
      { title: "System Architecture", description: "Understand the basics of cloud deployment, scaling, and architectural patterns for modern web apps." }
    ]
  },
  {
    name: "Cybersecurity Alertness",
    slug: "cybersecurity-alertness",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
    icon: ShieldCheck,
    desc: "Protecting digital assets in an increasingly connected world.",
    overview: "As digital footprints expand, the need for robust security measures has never been greater. This track focuses on creating a security-first mindset. It covers the landscape of modern cyber threats, how to identify vulnerabilities, and the best practices for protecting sensitive data. You will learn how to defend against phishing, malware, and social engineering attacks in both personal and corporate environments.",
    targetAudience: "IT professionals, security enthusiasts, and employees wanting to protect their organization's data.",
    modules: [
      { title: "Threat Landscape Overview", description: "Understand the different types of cyber threats, from malware and ransomware to zero-day exploits." },
      { title: "Social Engineering", description: "Learn how attackers manipulate human psychology to breach security systems, and how to defend against it." },
      { title: "Network Security Basics", description: "Explore the fundamentals of firewalls, VPNs, encryption, and secure communication protocols." },
      { title: "Identity & Access Management", description: "Implement strong authentication, authorization, and password management strategies." },
      { title: "Incident Response", description: "Learn what to do when a breach occurs, including containment, eradication, and recovery procedures." }
    ]
  },
  {
    name: "Digital Literacy",
    slug: "digital-literacy",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
    icon: Megaphone,
    desc: "Foundational skills for the modern digital workplace.",
    overview: "Digital Literacy is the cornerstone of modern professional life. This track is designed for individuals looking to gain confidence in using essential digital tools and platforms. From mastering collaborative workspaces like Google Workspace and Microsoft 365, to understanding basic digital etiquette and online safety, this course ensures you are ready to thrive in any digital-first environment.",
    targetAudience: "Individuals entering the workforce, transitioning to office roles, or needing a refresh on modern digital tools.",
    modules: [
      { title: "Operating Systems Navigation", description: "Gain proficiency in managing files, navigating settings, and troubleshooting basic issues on Windows and macOS." },
      { title: "Cloud Collaboration", description: "Master tools like Google Drive, Docs, Sheets, and Microsoft 365 for seamless teamwork." },
      { title: "Digital Communication", description: "Learn the etiquette and practical use of email, Slack, Microsoft Teams, and video conferencing software." },
      { title: "Online Research & Verification", description: "Develop skills to find accurate information online and evaluate the credibility of sources." },
      { title: "Basic Online Safety", description: "Understand the fundamentals of protecting your personal information and recognizing scams." }
    ]
  },
  {
    name: "Productivity & Automation",
    slug: "productivity-automation",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800",
    icon: Rocket,
    desc: "Optimizing workflows using modern digital tools.",
    overview: "Stop doing repetitive tasks manually. The Productivity & Automation track focuses on leveraging modern no-code/low-code tools to streamline operations. You'll learn how to connect different applications, automate data entry, and design workflows that save hours of work each week. This track empowers you to work smarter, not harder, using platforms like Zapier, Make, and Notion.",
    targetAudience: "Operations managers, entrepreneurs, and anyone looking to optimize their daily tasks and workflows.",
    modules: [
      { title: "Workflow Mapping", description: "Learn how to visually map out your daily processes to identify bottlenecks and opportunities for automation." },
      { title: "Introduction to No-Code", description: "Explore the ecosystem of no-code tools and understand how they can replace custom software development." },
      { title: "Building Automations (Zapier/Make)", description: "Create multi-step automated workflows connecting apps like Gmail, Slack, and CRM platforms." },
      { title: "Database & Project Management", description: "Design efficient, customized workspaces using tools like Notion, Airtable, or Monday.com." },
      { title: "Advanced Automation Logic", description: "Implement conditional logic, webhooks, and formatting steps to handle complex automation scenarios." }
    ]
  },
  {
    name: "Career Readiness",
    slug: "career-readiness",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800",
    icon: Target,
    desc: "Soft skills and professional branding for global employment.",
    overview: "Technical skills alone are not enough to secure top-tier opportunities. The Career Readiness track is dedicated to polishing your professional image, improving your communication skills, and preparing you for the modern job market. From building a standout resume and optimizing your LinkedIn profile, to mastering the art of the interview, this track ensures you are prepared to land your dream role.",
    targetAudience: "Recent graduates, career changers, and professionals looking to level up their employment prospects.",
    modules: [
      { title: "Personal Branding", description: "Discover how to identify your unique value proposition and communicate it effectively to employers." },
      { title: "Resume & Portfolio Building", description: "Create ATS-friendly resumes and compelling digital portfolios that highlight your best work." },
      { title: "LinkedIn Optimization", description: "Transform your LinkedIn profile into a magnet for recruiters and build a valuable professional network." },
      { title: "Interview Preparation", description: "Master techniques for technical and behavioral interviews, including the STAR method." },
      { title: "Workplace Communication & Soft Skills", description: "Develop emotional intelligence, conflict resolution skills, and effective written and verbal communication strategies." }
    ]
  }
];
