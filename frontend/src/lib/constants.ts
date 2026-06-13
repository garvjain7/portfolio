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
  'Systems Builder',
  'Data Engineer',
  'Technical Lead',
  'Full Stack Developer',
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/garvjain7',
  linkedin: 'https://linkedin.com/in/garvjain7',
  email: 'mailto:garv@example.com', // replace
}

export const STATS = [
  { label: 'Projects Built', value: 12, suffix: '+' },
  { label: 'Certifications', value: 2, suffix: '' },
  { label: 'Technologies', value: 20, suffix: '+' },
  { label: 'GitHub Repos', value: 15, suffix: '+' },
  { label: 'Years Learning', value: 3, suffix: '+' },
  { label: 'Hackathons', value: 4, suffix: '' },
]

export const SKILLS = {
  Backend: [
    { name: 'Node.js', level: 'production' },
    { name: 'FastAPI', level: 'production' },
    { name: 'Express.js', level: 'production' },
    { name: 'Python', level: 'production' },
    { name: 'REST APIs', level: 'production' },
    { name: 'WebSockets', level: 'working' },
  ],
  Frontend: [
    { name: 'React', level: 'production' },
    { name: 'Next.js', level: 'working' },
    { name: 'Three.js / R3F', level: 'working' },
    { name: 'Tailwind CSS', level: 'production' },
    { name: 'Framer Motion', level: 'working' },
    { name: 'TypeScript', level: 'working' },
  ],
  Databases: [
    { name: 'PostgreSQL', level: 'production' },
    { name: 'MongoDB', level: 'production' },
    { name: 'Redis', level: 'working' },
    { name: 'Supabase', level: 'working' },
    { name: 'Neon', level: 'working' },
  ],
  'AI / ML': [
    { name: 'LangChain', level: 'working' },
    { name: 'OpenAI API', level: 'working' },
    { name: 'Ollama', level: 'working' },
    { name: 'MediaPipe', level: 'working' },
    { name: 'FAISS', level: 'surface' },
    { name: 'RAG Systems', level: 'working' },
  ],
  DevOps: [
    { name: 'Linux / RHEL', level: 'production' },
    { name: 'Docker', level: 'working' },
    { name: 'Render', level: 'working' },
    { name: 'Vercel', level: 'working' },
    { name: 'Git / GitHub', level: 'production' },
    { name: 'Nginx', level: 'surface' },
  ],
}

export const CERTIFICATIONS = [
  {
    id: 'rhcsa',
    name: 'Red Hat Certified System Administrator',
    shortName: 'RHCSA',
    issuer: 'Red Hat',
    year: '2024',
    description:
      'Validates ability to perform core system administration skills in Red Hat Enterprise Linux environments.',
    hasBadge: true,
    badgeUrl: null,
  },
  {
    id: 'rhce',
    name: 'Red Hat Certified Engineer',
    shortName: 'RHCE',
    issuer: 'Red Hat',
    year: '2024',
    description:
      'Advanced Linux automation and system engineering using Ansible and enterprise RHEL environments.',
    hasBadge: true,
    badgeUrl: null,
  },
]

export const ACHIEVEMENTS = [
  {
    id: 'ach1',
    title: 'Smart India Hackathon Participant',
    description:
      'Competed in one of India\'s largest national hackathons, building a full-stack solution under 36 hours.',
    year: '2024',
    tag: 'Hackathon',
  },
  {
    id: 'ach2',
    title: 'Technical Lead at Internship',
    description:
      'Directed architecture and implementation of a GRC SaaS platform as the sole technical lead on a team.',
    year: '2025',
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
]

export const PROJECTS: Project[] = [
  {
    id: 'scanvista',
    name: 'ScanVista',
    description: 'QR-to-3D product visualization platform with AR support.',
    longDescription:
      'A platform where scanning a QR code launches a full 3D product visualization experience in the browser. Built with React Three Fiber, AR via model-viewer, and a Node.js + PostgreSQL backend with Supabase Storage.',
    stack: ['React', 'Three.js', 'Node.js', 'PostgreSQL', 'Supabase', 'Redis'],
    status: 'In Progress',
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
    stack: ['FastAPI', 'React', 'PostgreSQL', 'Redis', 'MongoDB', 'WebSockets'],
    status: 'In Progress',
    featured: true,
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
    stack: ['Node.js', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Ollama', 'Redis'],
    status: 'In Progress',
    featured: false,
    githubUrl: 'https://github.com/garvjain7/datainsights',
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
      'A compliance management platform mapping Indian regulatory frameworks (DPDP, IT Act, ISO 27001, NIST CSF) to a unified control library. Built with 9 RBAC roles and a 28-table PostgreSQL schema.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Ollama', 'Redis'],
    status: 'In Progress',
    featured: false,
    highlights: [
      '28-table normalized PostgreSQL schema with async SQLAlchemy ORM',
      'Nine RBAC roles with dependency injection',
      'Control library mapping 6 frameworks simultaneously in MongoDB',
      'Local Ollama LLM — zero external API calls for data sovereignty',
      'Super Admin UI for DB ops and control library management',
    ],
    aiQuery: 'Tell me about ComplySense and the compliance framework architecture.',
  },
  {
    id: 'apnaev',
    name: 'ApnaEV',
    description: 'EV route planning platform for the Jaipur region.',
    longDescription:
      'A map-based EV route planner built for Jaipur with Leaflet maps, dark utilitarian design, step-locking, slide-in station drawer, and a floating route info strip.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Leaflet'],
    status: 'In Progress',
    featured: false,
    githubUrl: 'https://github.com/garvjain7/apnaev',
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
    githubUrl: 'https://github.com/garvjain7/uiaudit',
    highlights: [
      'Playwright stealth plugin for screenshot capture',
      'Claude Vision API for heuristic assessment',
      'SSE streaming for real-time audit progress',
      'Model routing: Haiku for fast checks, Sonnet/Opus for deep analysis',
      'Context-aware heuristic weighting model',
    ],
    aiQuery: 'Tell me about UIAudit and the research contribution behind it.',
  },
]