export interface QuizOption {
  label: string; // A, B, C, D, etc.
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerIndex: number;
}

export type LessonType = "video" | "pdf" | "quiz" | "assignment" | "text" | "link" | "document";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  quizQuestions?: QuizQuestion[];
  assignmentPrompt?: string;
  textContent?: string;      // For "text" type lessons
  linkUrl?: string;          // For "link" type lessons (external resources)
  linkTitle?: string;        // Display title for link
  documentUrl?: string;      // For "document" type (generic doc resource)
  documentName?: string;     // Name of the document file
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

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
  iconName: string;
  imageUrl?: string;
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: "ai-ml",
    title: "Machine Learning & AI",
    subtitle: "Master the tools of the intelligent age",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "INTERMEDIATE",
    certificate: "VERIFIED",
    fee: "₦30,000",
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
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Python", "PyTorch", "OpenAI API", "Jupyter Notebooks", "HuggingFace"],
    iconName: "BrainCircuit",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
    modules: [
      {
        id: "ai-ml-m1",
        title: "Module 1: Foundations of Artificial Intelligence",
        lessons: [
          {
            id: "ai-ml-m1-l1",
            title: "Introduction to Machine Learning & Neural Networks",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/5q87K1WaoFI"
          },
          {
            id: "ai-ml-m1-l2",
            title: "Supervised vs Unsupervised Learning Guide",
            type: "pdf",
            duration: "10 mins reading",
            pdfUrl: "/assets/docs/ml_foundations.pdf"
          },
          {
            id: "ai-ml-m1-q1",
            title: "AI Foundations Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "ai-ml-q1-1",
                question: "What is the primary difference between supervised and unsupervised learning?",
                options: [
                  { label: "A", text: "Supervised learning uses labeled training data; unsupervised does not." },
                  { label: "B", text: "Supervised learning does not require computer resources." },
                  { label: "C", text: "Unsupervised learning always produces higher accuracy." },
                  { label: "D", text: "Supervised learning is only used for images." }
                ],
                correctAnswerIndex: 0
              },
              {
                id: "ai-ml-q1-2",
                question: "Which neural network architecture is primarily used for computer vision tasks?",
                options: [
                  { label: "A", text: "Recurrent Neural Networks (RNN)" },
                  { label: "B", text: "Convolutional Neural Networks (CNN)" },
                  { label: "C", text: "Transformers" },
                  { label: "D", text: "Linear Regression Models" }
                ],
                correctAnswerIndex: 1
              }
            ]
          }
        ]
      },
      {
        id: "ai-ml-m2",
        title: "Module 2: Practical LLMs and Prompt Engineering",
        lessons: [
          {
            id: "ai-ml-m2-l1",
            title: "Designing Effective Prompts for Generative AI",
            type: "video",
            duration: "20 mins",
            videoUrl: "https://www.youtube.com/embed/jC16L9n-9zE"
          },
          {
            id: "ai-ml-m2-a1",
            title: "Assignment: Create a Custom Prompt Template",
            type: "assignment",
            duration: "1 hour",
            assignmentPrompt: "Draft a system prompt template that instructs an LLM to act as a rigorous code auditor. Provide examples of input and output, and test it against a sample Javascript code snippet."
          }
        ]
      }
    ]
  },
  {
    id: "fullstack-web",
    title: "Full Stack Web Development",
    subtitle: "Build real websites, get paid for it",
    duration: "8 WEEKS",
    hours: "48 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦25,000",
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
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["VS Code", "GitHub", "Vercel", "React", "Tailwind"],
    iconName: "Code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
    modules: [
      {
        id: "fsw-m1",
        title: "Module 1: Frontend Basics (HTML & CSS)",
        lessons: [
          {
            id: "fsw-m1-l1",
            title: "Structuring Web Pages with HTML5",
            type: "video",
            duration: "12 mins",
            videoUrl: "https://www.youtube.com/embed/kUMe1FH4XXY"
          },
          {
            id: "fsw-m1-l2",
            title: "Styling and Layouts with CSS Grid and Flexbox",
            type: "video",
            duration: "18 mins",
            videoUrl: "https://www.youtube.com/embed/8v_6u40zH6k"
          },
          {
            id: "fsw-m1-q1",
            title: "HTML/CSS Quiz",
            type: "quiz",
            duration: "8 mins",
            quizQuestions: [
              {
                id: "fsw-q1-1",
                question: "Which HTML5 tag is used to define the navigation links section?",
                options: [
                  { label: "A", text: "<header>" },
                  { label: "B", text: "<section>" },
                  { label: "C", text: "<nav>" },
                  { label: "D", text: "<links>" }
                ],
                correctAnswerIndex: 2
              },
              {
                id: "fsw-q1-2",
                question: "In CSS Flexbox, what property aligns items along the main axis?",
                options: [
                  { label: "A", text: "align-items" },
                  { label: "B", text: "justify-content" },
                  { label: "C", text: "flex-direction" },
                  { label: "D", text: "align-content" }
                ],
                correctAnswerIndex: 1
              }
            ]
          }
        ]
      },
      {
        id: "fsw-m2",
        title: "Module 2: Javascript & Deployment",
        lessons: [
          {
            id: "fsw-m2-l1",
            title: "DOM Manipulation with Modern JavaScript",
            type: "video",
            duration: "25 mins",
            videoUrl: "https://www.youtube.com/embed/y17RuWkWdn8"
          },
          {
            id: "fsw-m2-a1",
            title: "Assignment: Portfolio Website Deployment",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Build a single-page responsive portfolio showcasing your bio and projects. Deploy it to Vercel or Netlify, and submit the live URL and GitHub link."
          }
        ]
      }
    ]
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    subtitle: "Create designs that stop the scroll.",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER",
    certificate: "VERIFIED",
    fee: "₦18,000",
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
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Canva", "Adobe Photoshop", "Illustrator", "Figma"],
    iconName: "Palette",
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800",
    modules: [
      {
        id: "gd-m1",
        title: "Module 1: Principles of Graphic Design",
        lessons: [
          {
            id: "gd-m1-l1",
            title: "Visual Hierarchy & Typography Rules",
            type: "video",
            duration: "14 mins",
            videoUrl: "https://www.youtube.com/embed/a5KYlH5px5Y"
          },
          {
            id: "gd-m1-q1",
            title: "Color Theory and Layout Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "gd-q1-1",
                question: "What color harmony uses three colors spaced equally on the color wheel?",
                options: [
                  { label: "A", text: "Analogous" },
                  { label: "B", text: "Complementary" },
                  { label: "C", text: "Triadic" },
                  { label: "D", text: "Monochromatic" }
                ],
                correctAnswerIndex: 2
              }
            ]
          }
        ]
      },
      {
        id: "gd-m2",
        title: "Module 2: Tooling and Projects",
        lessons: [
          {
            id: "gd-m2-l1",
            title: "Canva Design and Asset Creation Workflow",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/un50Bs4yKJA"
          },
          {
            id: "gd-m2-a1",
            title: "Assignment: Design a Business Logo and Branding Kit",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Pick a business idea (e.g., tech agency or bakery) and design a logo along with a cohesive brand board displaying typography choices, color hex codes, and mock social media banner ads."
          }
        ]
      }
    ]
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Fundamentals",
    subtitle: "Defend the digital frontier and protect assets",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦25,000",
    accentColor: "#EF4444",
    learn: [
      "Network security and firewalls",
      "Ethical hacking principles",
      "Threat vectors and security awareness",
      "Incident response planning",
      "Information assurance and cryptography"
    ],
    outcome: "Understand foundational security methodologies and audit small business digital infrastructures.",
    careerPaths: ["Cybersecurity Analyst", "Information Security Officer", "IT Auditor"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Wireshark", "Nmap", "Metasploit", "Kali Linux"],
    iconName: "ShieldCheck",
    imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=800",
    modules: [
      {
        id: "cyber-m1",
        title: "Module 1: Cyber Threat Landscape",
        lessons: [
          {
            id: "cyber-m1-l1",
            title: "Introduction to Cybersecurity Threats & Attack Vectors",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/z5nc9MDbv18"
          },
          {
            id: "cyber-m1-q1",
            title: "Threat Types and Cryptography Quiz",
            type: "quiz",
            duration: "6 mins",
            quizQuestions: [
              {
                id: "cyber-q1-1",
                question: "What is an exploit that targets a vulnerability before a developer issues a patch?",
                options: [
                  { label: "A", text: "Zero-day exploit" },
                  { label: "B", text: "Phishing campaign" },
                  { label: "C", text: "Ransomware" },
                  { label: "D", text: "SQL injection" }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "cyber-m2",
        title: "Module 2: Network Inspection & Protection",
        lessons: [
          {
            id: "cyber-m2-l1",
            title: "Network Mapping with Nmap and Packet Capture basics",
            type: "video",
            duration: "22 mins",
            videoUrl: "https://www.youtube.com/embed/4tYrP7X3vYw"
          },
          {
            id: "cyber-m2-a1",
            title: "Assignment: Network Security Audit Report",
            type: "assignment",
            duration: "1.5 hours",
            assignmentPrompt: "Formulate a threat model for a standard home-office network. Detail vulnerabilities such as default router passwords, unencrypted Wi-Fi, and legacy protocols, along with remediation recommendations."
          }
        ]
      }
    ]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    subtitle: "Make any business find customers online.",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦20,000",
    accentColor: "#007BFF",
    learn: [
      "Meta & Google Ads Management",
      "SEO - Rank higher on Google",
      "Email marketing automation",
      "Content strategy and copy editing",
      "Performance metrics & conversion analytics"
    ],
    outcome: "Launch and manage high-conversion ad campaigns across Facebook, Instagram, and search engines.",
    careerPaths: ["Digital Marketing Specialist", "Growth Marketer", "SEO Analyst"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Meta Ads Manager", "Google Analytics", "Mailchimp", "SEMrush"],
    iconName: "Megaphone",
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800",
    modules: [
      {
        id: "dm-m1",
        title: "Module 1: Search Engine Optimization & Copywriting",
        lessons: [
          {
            id: "dm-m1-l1",
            title: "Keyword Research & On-Page SEO Best Practices",
            type: "video",
            duration: "16 mins",
            videoUrl: "https://www.youtube.com/embed/xsVTqzratPs"
          },
          {
            id: "dm-m1-q1",
            title: "SEO Foundations Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "dm-q1-1",
                question: "Which of the following is considered an on-page SEO factor?",
                options: [
                  { label: "A", text: "Keyword optimization in heading tags" },
                  { label: "B", text: "Getting links from news sites" },
                  { label: "C", text: "Social media shares" },
                  { label: "D", text: "Running PPC banner ads" }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "dm-m2",
        title: "Module 2: Paid Ad Campaigns",
        lessons: [
          {
            id: "dm-m2-l1",
            title: "Setting Up Meta Ads from Scratch",
            type: "video",
            duration: "20 mins",
            videoUrl: "https://www.youtube.com/embed/zde3X83LwNs"
          },
          {
            id: "dm-m2-a1",
            title: "Assignment: Draft a Complete Ad Strategy",
            type: "assignment",
            duration: "1 hour",
            assignmentPrompt: "Choose a product and outline an Instagram ad campaign. Define your target audience segments, write the primary text and headline, and outline your budget and metrics tracking strategy."
          }
        ]
      }
    ]
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    subtitle: "Turn raw data into actionable business insights",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦20,000",
    accentColor: "#10B981",
    learn: [
      "Microsoft Excel for data cleanup and analysis",
      "SQL data retrieval fundamentals",
      "Interactive data reporting with Power BI & Tableau",
      "Statistical modeling basics",
      "Storytelling and presenting complex findings"
    ],
    outcome: "Build interactive database dashboards that resolve key business bottlenecks.",
    careerPaths: ["Data Analyst", "Business Intelligence Specialist", "Data Operations Specialist"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Excel", "MySQL", "Power BI", "Tableau"],
    iconName: "BarChart3",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    modules: [
      {
        id: "da-m1",
        title: "Module 1: Excel & SQL Fundamentals",
        lessons: [
          {
            id: "da-m1-l1",
            title: "Advanced Excel VLOOKUP and Pivot Tables",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/3kYg1vA9Lio"
          },
          {
            id: "da-m1-q1",
            title: "SQL & Spreadsheet Operations Quiz",
            type: "quiz",
            duration: "6 mins",
            quizQuestions: [
              {
                id: "da-q1-1",
                question: "Which SQL clause is used to filter records in a grouped query result?",
                options: [
                  { label: "A", text: "WHERE" },
                  { label: "B", text: "HAVING" },
                  { label: "C", text: "GROUP BY" },
                  { label: "D", text: "ORDER BY" }
                ],
                correctAnswerIndex: 1
              }
            ]
          }
        ]
      },
      {
        id: "da-m2",
        title: "Module 2: Dashboard Visualization",
        lessons: [
          {
            id: "da-m2-l1",
            title: "Creating Dashboards in Power BI",
            type: "video",
            duration: "25 mins",
            videoUrl: "https://www.youtube.com/embed/TmhQCQr_DCA"
          },
          {
            id: "da-m2-a1",
            title: "Assignment: Dynamic Business Intelligence Report",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Use a public dataset (e.g., global superstore sales) to design a dashboard with key visual metrics. Write a 1-page summary explaining the patterns and business recommendations based on the data."
          }
        ]
      }
    ]
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    subtitle: "Design experiences users will fall in love with",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦20,000",
    accentColor: "#F59E0B",
    learn: [
      "User research, interviews and persona development",
      "Information architecture and wireframing",
      "Interactive prototyping in Figma",
      "Usability testing methodologies",
      "Design systems and developer handoff"
    ],
    outcome: "Create a complete product design case study from wireframe to interactive prototype.",
    careerPaths: ["Product Designer", "UI Designer", "UX Researcher"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Figma", "FigJam", "Miro", "Maze"],
    iconName: "Layout",
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800",
    modules: [
      {
        id: "ui-ux-m1",
        title: "Module 1: User Research & Wireframes",
        lessons: [
          {
            id: "ui-ux-m1-l1",
            title: "Conducting User Interviews and Persona Creation",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/c_M1S80n4tM"
          },
          {
            id: "ui-ux-m1-q1",
            title: "UI/UX Principles Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "ui-ux-q1-1",
                question: "What does UX stand for in design terminology?",
                options: [
                  { label: "A", text: "User Experience" },
                  { label: "B", text: "User Interface" },
                  { label: "C", text: "Utility eXtension" },
                  { label: "D", text: "Unique UX" }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "ui-ux-m2",
        title: "Module 2: High Fidelity Design & Prototyping",
        lessons: [
          {
            id: "ui-ux-m2-l1",
            title: "Figma Components, Autolayout, and Variables",
            type: "video",
            duration: "24 mins",
            videoUrl: "https://www.youtube.com/embed/FTFaQWZBqA8"
          },
          {
            id: "ui-ux-m2-a1",
            title: "Assignment: Prototype a Food Delivery App",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Design three screens in Figma (Splash, Home, Detail) for a food delivery application. Add dynamic prototyping connections (transitions/clicks) and share the public view link."
          }
        ]
      }
    ]
  },
  {
    id: "ai-productivity",
    title: "AI Tools for Productivity",
    subtitle: "Accelerate your workflow with Generative AI tools",
    duration: "4 WEEKS",
    hours: "24 HRS",
    level: "BEGINNER",
    certificate: "VERIFIED",
    fee: "₦15,000",
    accentColor: "#D03B29",
    learn: [
      "Integrating ChatGPT & Claude into daily work",
      "Automating document writing and summaries",
      "Using AI for slide generation and graphics",
      "Basic workflow automation with Zapier",
      "Ethical data input guidelines"
    ],
    outcome: "Boost operational throughput by up to 2-3x using automated workflows.",
    careerPaths: ["Virtual Assistant", "Operations Coordinator", "Productivity Consultant"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["ChatGPT", "Claude AI", "Zapier", "Midjourney", "Gamma App"],
    iconName: "Zap",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800",
    modules: [
      {
        id: "aip-m1",
        title: "Module 1: AI Writing & Reasoning Engines",
        lessons: [
          {
            id: "aip-m1-l1",
            title: "Claude & ChatGPT: System Instructions & Context",
            type: "video",
            duration: "13 mins",
            videoUrl: "https://www.youtube.com/embed/v2l7B_u8V6Y"
          },
          {
            id: "aip-m1-q1",
            title: "AI Usage Compliance Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "aip-q1-1",
                question: "Which of the following data types should NEVER be fed into public LLMs?",
                options: [
                  { label: "A", text: "Public code libraries" },
                  { label: "B", text: "Proprietary user data and secret keys" },
                  { label: "C", text: "A general blog draft" },
                  { label: "D", text: "An email outline" }
                ],
                correctAnswerIndex: 1
              }
            ]
          }
        ]
      },
      {
        id: "aip-m2",
        title: "Module 2: Automation with APIs & Triggers",
        lessons: [
          {
            id: "aip-m2-l1",
            title: "Connecting AI to Gmail and Slack via Zapier",
            type: "video",
            duration: "18 mins",
            videoUrl: "https://www.youtube.com/embed/d2Wq-ZqA4Zc"
          },
          {
            id: "aip-m2-a1",
            title: "Assignment: Establish an AI-Supported Inbox",
            type: "assignment",
            duration: "1 hour",
            assignmentPrompt: "Create a simple automated flow diagram using Notion or draw.io outlining how you would feed client inquiry emails to Claude to draft replies and save them to your draft folder automatically."
          }
        ]
      }
    ]
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship & Startups",
    subtitle: "Build the next generation of African startups",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "ALL LEVELS",
    certificate: "VERIFIED",
    fee: "₦20,000",
    accentColor: "#00AEEF",
    learn: [
      "Founders mindset",
      "Finding and validating business ideas",
      "Business models, pricing and revenue",
      "Marketing, Sales and getting clients",
      "90 day founder launch plan"
    ],
    outcome: "Launch your first validated business idea ready for customers within 90 days.",
    careerPaths: ["Founder", "Entrepreneur", "Business owner"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Notion", "Slack", "Trello", "Pitch.com", "LinkedIn"],
    iconName: "Rocket",
    imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800",
    modules: [
      {
        id: "ent-m1",
        title: "Module 1: Market Research & Ideation",
        lessons: [
          {
            id: "ent-m1-l1",
            title: "Validating Business Hypotheses Without Budget",
            type: "video",
            duration: "16 mins",
            videoUrl: "https://www.youtube.com/embed/5a2d_W8J54U"
          },
          {
            id: "ent-m1-q1",
            title: "Startup Validation Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "ent-q1-1",
                question: "What is an MVP in the context of startup development?",
                options: [
                  { label: "A", text: "Minimum Viable Product" },
                  { label: "B", text: "Most Valuable Player" },
                  { label: "C", text: "Maximum Value Pricing" },
                  { label: "D", text: "Master Velocity Planner" }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "ent-m2",
        title: "Module 2: Pitching & Launch",
        lessons: [
          {
            id: "ent-m2-l1",
            title: "Building an Investor Pitch Deck that Secures Funding",
            type: "video",
            duration: "20 mins",
            videoUrl: "https://www.youtube.com/embed/V4l328Y3WlI"
          },
          {
            id: "ent-m2-a1",
            title: "Assignment: Write a 1-Page Lean Business Canvas",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Fill out a Lean Canvas outline detailing problem, solution, unique value proposition, metrics, cost structure, and target customer profiles for your business idea."
          }
        ]
      }
    ]
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    subtitle: "Deploy, scale and manage servers on global clouds",
    duration: "6 WEEKS",
    hours: "36 HRS",
    level: "INTERMEDIATE",
    certificate: "VERIFIED",
    fee: "₦28,000",
    accentColor: "#2563EB",
    learn: [
      "AWS and Google Cloud Platform core infrastructure",
      "Containerization using Docker",
      "Deploying secure microservices with Kubernetes",
      "Infrastructure-as-code basics using Terraform",
      "CI/CD deployment pipelines"
    ],
    outcome: "Configure and deploy containerized web applications on high-availability global hosting servers.",
    careerPaths: ["Cloud Engineer", "DevOps Engineer", "Systems Administrator"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
    iconName: "Cloud",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    modules: [
      {
        id: "cloud-m1",
        title: "Module 1: Docker Containers & Host Architecture",
        lessons: [
          {
            id: "cloud-m1-l1",
            title: "Containerizing Web Apps using Dockerfiles",
            type: "video",
            duration: "18 mins",
            videoUrl: "https://www.youtube.com/embed/gAkwW2tuIqE"
          },
          {
            id: "cloud-m1-q1",
            title: "Containerization Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "cloud-q1-1",
                question: "What is the primary difference between a Docker container and a Virtual Machine?",
                options: [
                  { label: "A", text: "Containers share the host operating system kernel; VMs require a hypervisor and full guest OS." },
                  { label: "B", text: "VMs are faster than containers to boot." },
                  { label: "C", text: "Containers require specialized hardware components." },
                  { label: "D", text: "Docker only runs on Linux computers." }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "cloud-m2",
        title: "Module 2: Deployments & Scaling",
        lessons: [
          {
            id: "cloud-m2-l1",
            title: "Continuous Deployments using Github Actions",
            type: "video",
            duration: "22 mins",
            videoUrl: "https://www.youtube.com/embed/R8_veQiYt64"
          },
          {
            id: "cloud-m2-a1",
            title: "Assignment: Write a Dockerfile and CI Pipeline Configuration",
            type: "assignment",
            duration: "2 hours",
            assignmentPrompt: "Draft a simple Dockerfile for a Node.js web server. Below it, draft a GitHub Actions YAML configuration file that builds the container image and runs basic unit checks."
          }
        ]
      }
    ]
  },
  {
    id: "fintech",
    title: "Financial Technology (FinTech)",
    subtitle: "Build the future of payment systems in Africa",
    duration: "4 WEEKS",
    hours: "24 HRS",
    level: "BEGINNER+",
    certificate: "VERIFIED",
    fee: "₦20,000",
    accentColor: "#007BFF",
    learn: [
      "How digital payment works in Africa",
      "Paystack and Flutterwave payment APIs",
      "Digital banking and mobile money protocols",
      "Blockchain and decentralized finance (DeFi) basics",
      "Building a FinTech product concept"
    ],
    outcome: "Design a FinTech product concept ready to pitch to investors or build as MVP.",
    careerPaths: ["Fintech Analyst", "Payment Systems Developer", "Product Manager"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["Paystack API", "Flutterwave", "Ethereum", "Stripe"],
    iconName: "Wallet",
    modules: [
      {
        id: "fintech-m1",
        title: "Module 1: Payments & Banking APIs",
        lessons: [
          {
            id: "fintech-m1-l1",
            title: "Integrating Paystack for Card & Bank Payments",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/c02D8vP3Vms"
          },
          {
            id: "fintech-m1-q1",
            title: "FinTech Compliance Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "fintech-q1-1",
                question: "What does KYC stand for in digital finance compliance?",
                options: [
                  { label: "A", text: "Know Your Customer" },
                  { label: "B", text: "Keep Your Cash" },
                  { label: "C", text: "Key Yield Calculation" },
                  { label: "D", text: "Kernel Yield Controller" }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "fintech-m2",
        title: "Module 2: Blockchain and Digital Assets",
        lessons: [
          {
            id: "fintech-m2-l1",
            title: "Introduction to Ethereum, Smart Contracts, & Stablecoins",
            type: "video",
            duration: "20 mins",
            videoUrl: "https://www.youtube.com/embed/3xGLc-TcoSI"
          },
          {
            id: "fintech-m2-a1",
            title: "Assignment: Design a Fintech Payment Workflow",
            type: "assignment",
            duration: "1.5 hours",
            assignmentPrompt: "Create a flowchart or detailed text explaining how a customer's payment flows from clicking 'Pay' on a site to receiving value in an escrow wallet, highlighting API hooks and callbacks."
          }
        ]
      }
    ]
  },
  {
    id: "smartphone-content",
    title: "Smartphone Content Creation",
    subtitle: "Create high-impact video & photo directly on your phone",
    duration: "4 WEEKS",
    hours: "24 HRS",
    level: "BEGINNER",
    certificate: "VERIFIED",
    fee: "₦15,000",
    accentColor: "#F43F5E",
    learn: [
      "Smartphone camera manual configuration and settings",
      "Lighting, sound setup, and framing principles",
      "Video editing using CapCut and mobile apps",
      "Scripting, storytelling, and hooks for social channels",
      "Distribution and content calendar management"
    ],
    outcome: "Produce, edit, and launch high-quality commercial short-form video content from your phone.",
    careerPaths: ["Content Creator", "Social Media Manager", "Brand Ambassador"],
    talentCloud: "Graduates get added to our African verified talent database",
    tools: ["CapCut", "Lightroom Mobile", "TikTok Tools", "Canva Mobile"],
    iconName: "Smartphone",
    modules: [
      {
        id: "smcc-m1",
        title: "Module 1: Camera Basics & Framing",
        lessons: [
          {
            id: "smcc-m1-l1",
            title: "Camera Exposure, Rules of Thirds & Sound Isolation",
            type: "video",
            duration: "15 mins",
            videoUrl: "https://www.youtube.com/embed/0B2h4h5vN0E"
          },
          {
            id: "smcc-m1-q1",
            title: "Lighting & Framing Basics Quiz",
            type: "quiz",
            duration: "5 mins",
            quizQuestions: [
              {
                id: "smcc-q1-1",
                question: "What is the rule of thirds in photography/videography framing?",
                options: [
                  { label: "A", text: "Dividing the frame into a 3x3 grid and aligning the subject on intersections." },
                  { label: "B", text: "Making sure only three colors are present." },
                  { label: "C", text: "Recording in exactly three-minute segments." },
                  { label: "D", text: "Using three different cameras at once." }
                ],
                correctAnswerIndex: 0
              }
            ]
          }
        ]
      },
      {
        id: "smcc-m2",
        title: "Module 2: Editing & CapCut Workflow",
        lessons: [
          {
            id: "smcc-m2-l1",
            title: "Adding Dynamic B-Roll, Sound Effects, and Subtitles in CapCut",
            type: "video",
            duration: "18 mins",
            videoUrl: "https://www.youtube.com/embed/hO-g19fX0eU"
          },
          {
            id: "smcc-m2-a1",
            title: "Assignment: Edit a 30-Second Promotional Short",
            type: "assignment",
            duration: "1 hour",
            assignmentPrompt: "Shoot and edit a 30-second product advertisement or bio presentation using CapCut. Apply sound layering, clear captions, and visual zoom effects. Submit your Google Drive or video URL."
          }
        ]
      }
    ]
  }
];
