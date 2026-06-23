import type { Project } from '@/types/projects'

export const SECTIONS = {
  ABOUT: 'about',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
  CERTIFICATIONS: 'certifications',
  ACHIEVEMENTS: 'achievements',
  DASHBOARD: 'dashboard',
  CONTACT: 'contact',
} as const

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Stats', href: '#dashboard' },
  { label: 'Contact', href: '#contact' },
]

export const ROTATING_ROLES = [
  'Backend Engineer',
  'AI Engineer',
  'Systems Designer',
  'Data Engineer',
  'Technical Lead',
  'Full Stack Developer',
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/garvjain7',
  linkedin: 'https://linkedin.com/in/garvjain7',
  email: 'garvjain0035@gmail.com',
  x: 'https://x.com/garvjain_07',
}

export const STATS = [
  { label: 'Projects Built', value: 15, suffix: '+' },
  { label: 'Certifications', value: 10, suffix: '+' },
  { label: 'Technologies', value: 20, suffix: '+' },
  { label: 'GitHub Repos', value: 60, suffix: '+' },
  { label: 'Years Learning', value: 3, suffix: '+' },
  { label: 'Hackathons', value: 4, suffix: '' },
]

export const SKILLS = {
  Languages: [
    { name: 'Python', level: 'production' },
    { name: 'SQL / PostgreSQL', level: 'production' },
    { name: 'JavaScript', level: 'working' },
    { name: 'TypeScript', level: 'working' },
    { name: 'HTML / CSS', level: 'working' },
    { name: 'C++', level: 'surface' },
  ],
  Backend: [
    { name: 'FastAPI', level: 'production' },
    { name: 'Node.js / Express', level: 'working' },
    { name: 'REST API Design', level: 'working' },
    { name: 'WebSockets', level: 'working' },
    { name: 'Pydantic / SQLAlchemy', level: 'working' },
    { name: 'Flask', level: 'surface' },
  ],
  Frontend: [
    { name: 'React', level: 'working' },
    { name: 'Next.js', level: 'working' },
    { name: 'Three.js / R3F', level: 'working' },
    { name: 'Tailwind CSS', level: 'working' },
    { name: 'Framer Motion', level: 'working' },
    { name: 'AR (model-viewer)', level: 'surface' },
  ],
  Databases: [
    { name: 'PostgreSQL', level: 'production' },
    { name: 'MongoDB', level: 'working' },
    { name: 'Redis', level: 'working' },
    { name: 'Supabase / Neon', level: 'working' },
    { name: 'Alembic Migrations', level: 'working' },
  ],
  'AI / ML': [
    { name: 'RAG Systems', level: 'working' },
    { name: 'LangChain', level: 'working' },
    { name: 'Ollama (Local LLMs)', level: 'working' },
    { name: 'OpenAI API', level: 'working' },
    { name: 'FAISS', level: 'surface' },
    { name: 'Scikit-learn', level: 'surface' },
  ],
  'Linux & Systems': [
    { name: 'Linux / RHEL', level: 'production' },
    { name: 'Systemd / Services', level: 'production' },
    { name: 'Ansible', level: 'working' },
    { name: 'Docker', level: 'surface' },
    { name: 'Nginx', level: 'surface' },
    { name: 'Git / GitHub', level: 'working' },
  ],
}

export const CERTIFICATIONS = [
  {
    id: 'rhcsa',
    shortName: 'RHCSA',
    name: 'Red Hat Certified System Administrator',
    issuer: 'Red Hat',
    year: '2025',
    description:
      'Validates ability to perform core system administration skills in Red Hat Enterprise Linux environments.',
    certificateImage: '/certificates/rhcsa-cert.png',
    badgeImage: '/certificates/rhcsa-badge.png',
    verifyUrl: 'https://www.credly.com/badges/904ad1b2-dbf3-4693-af24-e4f63defe163',
    credentialUrl: null,
  },
  // {
  //   id: 'rhce',
  //   shortName: 'RHCE',
  //   name: 'Red Hat Certified Engineer',
  //   issuer: 'Red Hat',
  //   year: '2026',
  //   description:
  //     'Advanced Linux automation and system engineering using Ansible and enterprise RHEL environments.',
  //   certificateImage: '/certificates/rhce-cert.jpg',
  //   badgeImage: null,
  //   verifyUrl: null,
  //   credentialUrl: null,
  // },
  {
    id: 'data-engineer-associate',
    shortName: 'Databricks',
    name: 'Databricks Certified Data Engineer Associate',
    issuer: 'Databricks',
    year: '2026',
    description:
      'Comprehensive understanding of data engineering principles and best practices with the Databricks platform.',
    certificateImage: '/certificates/databricks-cert.png',
    badgeImage: '/certificates/databricks-badge.png',
    verifyUrl: 'https://credentials.databricks.com/894431ca-11f7-495d-a832-75bfde70c268#acc.sINytiO8',
    credentialUrl: null,
  },
  {
    id: 'gate',
    shortName: 'GATE - 2026',
    name: 'GATE 2026 Qualified',
    issuer: 'NTA',
    year: '2026',
    description:
      'Successfully qualified GATE - 2026 examination in Computer Science and Engineering',
    certificateImage: '/certificates/gate-score.jpg',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel1',
    shortName: 'Competitive Programming',
    name: 'Getting Started with Competitive Programming (NPTEL)',
    issuer: 'NPTEL / IIT',
    year: 'July - Oct 2025',
    description:
      'Completed a 12-week NPTEL course mastering advanced algorithm design, graph theory, and dynamic programming techniques for competitive coding and technical interviews.',
    certificateImage: '/certificates/cp-cert.png',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel2',
    shortName: 'Machine Learning',
    name: 'Introduction to Machine Learning (NPTEL)',
    issuer: 'NPTEL / IIT',
    year: 'Jan - Apr 2025',
    description:
      'Completed a 12-week NPTEL course by Prof. Balaraman Ravindran (IIT Madras) covering fundamental machine learning algorithms, statistical decision theory, and neural networks from a mathematical perspective.',
    certificateImage: '/certificates/ml-cert.jpg',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel3',
    shortName: 'Data Science',
    name: 'Data Science using Python',
    issuer: 'SWAYAM',
    year: 'Jan - Apr 2025',
    description:
      'Completed a SWAYAM course mastering data preprocessing, statistical analysis, and machine learning implementation using Python libraries like NumPy, Pandas, and Scikit-learn',
    certificateImage: '/certificates/ds-cert.png',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel4',
    shortName: 'German Language',
    name: 'German - I (NPTEL)',
    issuer: 'NPTEL / IIT',
    year: 'Jan - Apr 2025',
    description:
      'Completed a 12-week IIT Madras course acquiring A1-level proficiency in German, mastering foundational grammar, vocabulary, and conversational skills for daily life situations.',
    certificateImage: '/certificates/german1-cert.jpg',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel5',
    shortName: 'Entrepreneurship',
    name: 'Entrepreneurship and IP - Strategy (NPTEL)',
    issuer: 'NPTEL / IIT',
    year: 'July - Sep 2025',
    description:
      'Completed an 8-week NPTEL course by Prof. Gouri Gargate (IIT Kharagpur) mastering intellectual property strategy, IP lifecycle management, and valuation techniques for startups and MSMEs.',
    certificateImage: '/certificates/eip-cert.png',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel6',
    shortName: 'CyberSecurity',
    name: 'Introduction to Cyber Security',
    issuer: 'SWAYAM',
    year: 'Jan - Apr 2024',
    description:
      'Completed a 12-week SWAYAM course mastering foundational cyber security concepts, including threat landscape analysis, secure browsing practices, social engineering defense, and Indian cyber law compliance.',
    certificateImage: '/certificates/cs1-cert.png',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'nptel7',
    shortName: 'CyberSecurity',
    name: 'Cyber Security Tools, Techniques and Counter Measure',
    issuer: 'SWAYAM',
    year: 'July - Dec 2024',
    description:
      'Completed a 12-week SWAYAM course mastering cyber security tools, threat analysis, firewall configuration, and countermeasures against web vulnerabilities, malware, and social engineering attacks.',
    certificateImage: '/certificates/cs2-cert.jpg',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'upflairs',
    shortName: 'Upflairs',
    name: '5 - Days AI/ML, and Deep Learning Masterclass',
    issuer: 'Upflairs',
    year: '2026',
    description:
      'Completed a 5 day workshop in AI, Ml, and Deep Learning MasterClass conducted by Upflair Company. Learned about Concepts and practical execution of NLP, CNN, Neural Networks etc.',
    certificateImage: '/certificates/upflair-cert.png',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
  {
    id: 'udbhav',
    shortName: 'UDBHAV - 2025',
    name: 'UDBHAV - 2025: 4th National Level Project Exhibition',
    issuer: 'PIET / IEEE',
    year: '2025',
    description:
      'Completed a 5 day workshop in AI, Ml, and Deep Learning MasterClass conducted by Upflair Company. Learned about Concepts and practical execution of NLP, CNN, Neural Networks etc.',
    certificateImage: '/certificates/udbhav-cert.jpg',
    badgeImage: null,
    verifyUrl: null,
    credentialUrl: null,
  },
]

export const ACHIEVEMENTS = [
  {
    id: 'ach1',
    title: 'Smart India Hackathon Participant',
    description:
      'Competed in one of India\'s largest national hackathons, building a full-stack solution under 36 hours.',
    year: '2025',
    tag: 'Hackathon',
  },
  {
    id: 'ach2',
    title: 'Technical Lead at Internship',
    description:
      'Directed architecture and implementation of a GRC SaaS platform as the sole technical lead on a team.',
    year: '2026',
    tag: 'Leadership',
  },
  {
    id: 'ach3',
    title: 'RHCSA + RHCE Dual Certification',
    description:
      'Earned both Red Hat certifications, placing in a small percentile of students with dual enterprise Linux credentials.',
    year: '2024',
    tag: 'Certification',
  },
  {
    id: 'ach4',
    title: 'GATE 2026 Qualified',
    description:
      'Qualified GATE 2026 in Computer Science and Information Technology — representing strong theoretical depth in CS fundamentals.',
    year: '2026',
    tag: 'Achievement',
  },
  {
    id: 'ach5',
    title: 'Red Hat Scholarship — 2× Merit Winner',
    description:
      'Won a 100% scholarship to both RHCSA and RHCE exams through a competitive selection process across consecutive years. Each certification is commercially priced in the thousands and rarely held by undergraduate students.',
    year: '2024–2025',
    tag: 'Scholarship',
  },
  {
    id: 'ach6',
    title: 'Databricks Cert — Industry Sponsored',
    description:
      'Databricks Certified Data Engineer Associate certification was fully sponsored by ThoughtsWin Systems — reflecting professional recognition of data engineering potential.',
    year: '2026',
    tag: 'Sponsored',
  },
]

export const PROJECTS: Project[] = [
  {
    id: 'scanvista',
    name: 'ScanVista',
    description: 'QR-to-3D product visualization platform with AR support.',
    longDescription:
      'A platform where scanning a QR code launches a full 3D product visualization experience in the browser. Built with React Three Fiber, AR via model-viewer, and a Node.js + PostgreSQL backend with Supabase Storage.',
    stack: ['Python', 'FastAPI', 'React', 'Three.js', 'Node.js', 'PostgreSQL (NEON DB)', 'Supabase', 'Redis', 'WebXR'],
    status: 'Completed',
    featured: true,
    githubUrl: 'https://github.com/garvjain7/scanvista',
    highlights: [
      'Full 3D product viewer with corrected zoom system',
      'AR visualization on mobile via model-viewer',
      'Bulk product import with CSV/Excel + two-gate validation',
      'JWT auth with httpOnly refresh token rotation',
      'Analytics system with per-product and per-project views',
    ],
    aiQuery: 'Tell me about ScanVista and what it demonstrates architecturally.',
  },
  {
    id: 'codealive',
    name: 'CodeAlive',
    description: 'Real-time collaborative code snippet sharing platform.',
    longDescription:
      'A full-featured snippet sharing platform with anonymous and authenticated sharing, real-time OT-based collaboration, CM6 editor, inline image embeds, and password-protected snippets.',
    stack: ['Python', 'FastAPI', 'HTML', 'CSS', 'JS', 'PostgreSQL (NEON DB)', 'Redis', 'MongoDB', 'WebSockets'],
    status: 'Live',
    featured: true,
    liveUrl: 'https://codealive.onrender.com/',
    githubUrl: 'https://github.com/garvjain7/codealive',
    highlights: [
      'Operational Transformation engine for real-time collaboration',
      'CodeMirror 6 as sole editor — compartment-based language swapping',
      'Inline image embeds via deferred upload + LRU eviction',
      'Host disconnect grace period with cohost role support',
      'Password-protected snippets with expiry control',
    ],
    aiQuery: 'Tell me about CodeAlive and the most complex parts of building it.',
  },
  {
    id: 'datainsights',
    name: 'DataInsights.ai',
    description: 'Multi-tenant AI-driven enterprise data intelligence platform.',
    longDescription:
      'Companies onboard employees who query uploaded datasets via natural language. A compute-first cognitive engine ensures the LLM never sees raw data — only pre-computed reports.',
    stack: ['Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Ollama', 'Redis', 'LangChain'],
    status: 'Completed',
    featured: false,
    githubUrl: '',
    highlights: [
      'Compute-first cognitive engine — LLM formats results, never generates them',
      'Progressive data report built silently in background post-upload',
      'Multi-tenant row-level isolation across 19+ tables',
      'Natural language to SQL pipeline with server-side execution',
      'Cleaning wizard with verification screen before report finalization',
    ],
    aiQuery: 'Explain the DataInsights.ai architecture and the privacy design decisions.',
  },
  {
    id: 'complysense',
    name: 'ComplySense',
    description: 'GRC SaaS platform for Indian universities.',
    longDescription:
      'ComplySense is an AI-powered compliance and risk management platform that helps institutions streamline regulatory compliance, security audits, risk assessments, evidence management, and policy governance. By combining workflow automation, role-based access control, reporting, and AI-driven decision support, ComplySense enables organizations to monitor compliance posture, identify risks, and generate actionable recommendations across multiple regulatory frameworks.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Ollama', 'Redis'],
    status: 'In Progress',
    featured: false,
    githubUrl: 'https://github.com/garvjain7/complysense-clean',
    highlights: [
      'AI-Powered Compliance Assistant for instant regulatory guidance and compliance insights.',
      'Multi-Framework Compliance Management to handle multiple standards from a single platform.',
      'Risk Assessment & Mitigation Tracking with automated workflows and ownership assignment.',
      'Audit & Evidence Management for centralized documentation and audit readiness.',
      'Role-Based Access Control (RBAC) ensuring secure and accountable governance across teams.'
    ],
    aiQuery: 'Tell me about ComplySense and the compliance framework architecture.',
  },
  {
    id: 'apnaev',
    name: 'ApnaEV',
    description: 'EV route planning platform for the Jaipur region.',
    longDescription:
      'A map-based EV route planner built for Jaipur with Leaflet maps, dark utilitarian design, step-locking, slide-in station drawer, and a floating route info strip.',
    stack: ['Python', 'Flask', 'PostgreSQL (PostGIS)', 'Pandas', 'Scikit-learn', 'HTML', 'CSS', 'JavaScript', 'Leaflet', 'Web Scraping', 'OSM'],
    status: 'Live',
    featured: false,
    githubUrl: 'https://github.com/garvjain7/scale-apnaev',
    highlights: [
      'Leaflet-based interactive map with EV station markers',
      'Step-locking UI with visual states and toast notifications',
      'Slide-in station drawer with route info strip',
      'Dark utilitarian design with CSS custom properties',
    ],
    aiQuery: 'Tell me about ApnaEV and the design decisions behind it.',
  },
  {
    id: 'uiaudit',
    name: 'UIAudit',
    description: 'Agentic UI/UX auditing tool using Vision AI and Nielsen heuristics.',
    longDescription:
      'Evaluates web interfaces against Nielsen\'s 10 Usability Heuristics using Playwright screenshots, Claude Vision API, and SSE streaming results. Built as a research tool.',
    stack: ['Next.js', 'Express', 'Playwright', 'Anthropic API', 'BullMQ', 'Redis'],
    status: 'In Progress',
    featured: false,
    highlights: [
      'Playwright stealth plugin for screenshot capture',
      'Claude Vision API for heuristic assessment',
      'SSE streaming for real-time audit progress',
      'Model routing: Haiku for fast checks, Sonnet/Opus for deep analysis',
      'Context-aware heuristic weighting model',
    ],
    aiQuery: 'Tell me about UIAudit and the research contribution behind it.',
  },
  {
    id: 'typingmoodai',
    name: 'TypingMood AI',
    description: 'Typing Mood AI is a machine learning-powered web application that predicts a user\'s emotional state from their typing behavior using keystroke dynamics and real-time behavioral analysis.',
    longDescription:
      'TypingMood AI is an intelligent behavioral analytics platform that analyzes keystroke dynamics to predict a user mood in real time. Instead of relying on the content being typed, the system examines how users type—including typing speed, error frequency, pause patterns, and rhythm—to classify emotional states such as Happy, Neutral, and Stressed.',
    stack: ['Python', 'React', 'Node.js', 'WebSockets', 'MongoDB', 'Pandas', 'Scikit-learn'],
    status: 'Live',
    featured: false,
    liveUrl: 'https://typingmoodai.onrender.com/',
    githubUrl: 'https://github.com/garvjain7/typing-based-sentimental-analysis',
    highlights: [
      'Real-Time Keystroke Analysis for capturing and processing typing behavior as users interact with the application.',
      'Behavior-Based Mood Prediction that classifies emotional states without analyzing the actual text content.',
      'Machine Learning Inference Engine built using a Random Forest model trained on engineered keystroke features.',
      'Explainable AI Insights showing the top factors that influenced each mood prediction.',
      'Privacy-Preserving Design that focuses on typing patterns rather than the semantic meaning of user input.',
    ],
    aiQuery: 'Tell me about TypingMood AI and how it works.',
  },
]