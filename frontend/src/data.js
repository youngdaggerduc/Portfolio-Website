export const projects = [
  {
    id: 1,
    title: 'Lumiere Lounge',
    tag: 'Freelance',
    desc: 'Commercial freelance build — a full booking & web presence for a premium restaurant and club.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    color: 'cyan',
    image: '/lumierelounge.jpg',
    details:
      'Delivered end-to-end as a freelance project. Customer-facing reservation flow, table management dashboard, integrated payments, and automated confirmation emails. Production-deployed for a real client.',
  },
  {
    id: 2,
    title: 'Student Conduct Tracker',
    tag: 'Final Year Project',
    desc: 'Final year CS project — a systematic platform for tracking, reporting, and analyzing student conduct data across a school.',
    stack: ['Python', 'Flask', 'SQL', 'Data Analysis'],
    color: 'red',
    image: '/Studentconducttracker.jpeg',
    details:
      'Built for the UWI Computer Science final year project. Supports admin and staff roles. Features incident logging, escalation workflows, conduct trend analytics, and exportable reports. Earned Second Class Honours recognition.',
  },
  {
    id: 3,
    title: 'AI Image Generator',
    tag: 'AI / Web',
    desc: 'AI-powered image generation system integrated directly into a custom WordPress CMS build.',
    stack: ['PHP', 'WordPress', 'OpenAI API', 'Custom CMS'],
    color: 'mag',
    image: '/AI.jpg',
    details:
      'Built an AI image generation pipeline integrated into a WordPress site. Custom PHP plugin connects to OpenAI image APIs, allowing users to generate, preview, and publish AI images from within the CMS editor.',
  },
  {
    id: 4,
    title: 'Platformer Game',
    tag: 'Game Dev',
    desc: 'Full 2D platformer built in Java — custom physics, game mechanics, UI, and complete gameplay systems.',
    stack: ['Java', 'Swing', 'OOP', 'Game Physics'],
    color: 'cyan',
    image: '/Trinidadisnotarealplace.png',
    details:
      'Java platformer using Swing for rendering. Custom physics engine with gravity and collision detection, animated sprite system, enemy behaviours, level design, and a full in-game UI. All game systems built from scratch.',
  },
  {
    id: 5,
    title: 'Website Manager for Radian',
    tag: 'Corporate',
    desc: 'Led the redesign and ongoing management of Radian H.A. Limited\'s corporate website — coordinated a small dev team from strategy to deployment.',
    stack: ['WordPress', 'PHP', 'Custom CMS', 'Team Lead'],
    color: 'red',
    image: '/Radian.png',
    details:
      'Owned the end-to-end redevelopment of the Radian H.A. Limited corporate website. Managed internal dev work, coordinated a small team, handled content architecture, and shipped ongoing maintenance. Previously stalled for months — delivered to production under a clear operational brief.',
  },
  {
    id: 6,
    title: 'Odoo Custom Module Development',
    tag: 'ERP / Python',
    desc: 'Custom Odoo modules extending Accounting, Sales, CRM, Rental, and Reporting to match real operational workflows at Radian.',
    stack: ['Python', 'Odoo', 'XML', 'PostgreSQL'],
    color: 'mag',
    image: '/odoo.png',
    details:
      'Designed and built custom Odoo modules on top of a full ERP rollout. Tailored Accounting, Sales, CRM, Rental Operations, and Reporting flows to the business, including custom models, views, automated actions, and reports. Trained staff on adoption and maintained the customizations post-go-live.',
  },
]

export const skills = [
  {
    cat: 'Frontend',
    dot: 'cyan',
    pills: [
      { l: 'React', c: 'cyan' },
      { l: 'Next.js', c: 'cyan' },
      { l: 'HTML/CSS', c: 'cyan' },
      { l: 'Framer Motion', c: 'cyan' },
      { l: 'WordPress', c: 'cyan' },
    ],
  },
  {
    cat: 'Backend',
    dot: 'red',
    pills: [
      { l: 'Node.js', c: 'red' },
      { l: 'Express', c: 'red' },
      { l: 'Python', c: 'red' },
      { l: 'FastAPI', c: 'red' },
      { l: 'REST APIs', c: 'red' },
      { l: 'Java', c: 'red' },
    ],
  },
  {
    cat: 'AI / ML',
    dot: 'mag',
    pills: [
      { l: 'LangChain', c: 'mag' },
      { l: 'OpenAI API', c: 'mag' },
      { l: 'Hugging Face', c: 'mag' },
      { l: 'Prompt Engineering', c: 'mag' },
      { l: 'AI Automation', c: 'mag' },
      { l: 'ML Workflows', c: 'mag' },
    ],
  },
  {
    cat: 'Databases',
    dot: 'cyan',
    pills: [
      { l: 'SQL', c: 'cyan' },
      { l: 'MySQL', c: 'cyan' },
      { l: 'PostgreSQL', c: 'cyan' },
    ],
  },
  {
    cat: 'ERP & Business',
    dot: 'red',
    pills: [
      { l: 'Odoo ERP', c: 'red' },
      { l: 'CRM', c: 'red' },
      { l: 'Process Optimization', c: 'red' },
      { l: 'Power Automate', c: 'red' },
      { l: 'PowerShell', c: 'red' },
      { l: 'Agile/Scrum', c: 'red' },
    ],
  },
  {
    cat: 'Languages',
    dot: 'mag',
    pills: [
      { l: 'JavaScript', c: 'mag' },
      { l: 'Python', c: 'mag' },
      { l: 'Java', c: 'mag' },
      { l: 'PHP', c: 'mag' },
      { l: 'C++', c: 'mag' },
      { l: 'SQL', c: 'mag' },
    ],
  },
  {
    cat: 'DevOps / Tools',
    dot: 'cyan',
    pills: [
      { l: 'Git / GitHub', c: 'cyan' },
      { l: 'WordPress (Custom)', c: 'cyan' },
      { l: 'Vercel', c: 'cyan' },
    ],
  },
]
