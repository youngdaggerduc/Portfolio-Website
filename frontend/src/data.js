export const projects = [
  {
    id: 1,
    title: 'Lumiere Lounge',
    tag: 'Full Stack',
    desc: 'A fully-featured booking system for a premium restaurant & club. Handles reservations, table management, VIP flows, and real-time availability.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    color: 'cyan',
    icon: '🍸',
    details:
      'End-to-end booking platform with customer-facing reservation flow, admin dashboard for table management, integrated payment processing, and automated confirmation emails. Built with a React frontend, Express backend, and PostgreSQL database.',
  },
  {
    id: 2,
    title: 'Student Conduct Tracker',
    tag: 'SaaS',
    desc: 'A systematic platform for schools to log, track, and manage student conduct records with role-based access and reporting.',
    stack: ['Next.js', 'Prisma', 'MySQL', 'Auth.js'],
    color: 'red',
    icon: '📋',
    details:
      'Full-featured conduct management system for educational institutions. Supports admin, teacher, and student roles. Includes incident logging, escalation workflows, parent notifications, and analytics dashboards for trend analysis.',
  },
  {
    id: 3,
    title: 'Platformer Game',
    tag: 'Game Dev',
    desc: 'A Java-based 2D platformer with custom physics, enemy AI, sprite animation, and procedurally generated levels.',
    stack: ['Java', 'Swing', 'OOP', 'Game Physics'],
    color: 'mag',
    icon: '🎮',
    details:
      'Classic 2D platformer built in Java using Swing for rendering. Features custom physics engine with gravity and collision detection, animated sprite system, enemy AI with patrol and chase behaviors, and a level editor.',
  },
];

export const skills = [
  {
    cat: 'Frontend',
    dot: 'cyan',
    pills: [
      { l: 'React', c: 'cyan' },
      { l: 'Next.js', c: 'cyan' },
      { l: 'TypeScript', c: 'cyan' },
      { l: 'Tailwind', c: 'cyan' },
      { l: 'HTML/CSS', c: 'cyan' },
      { l: 'Framer Motion', c: 'cyan' },
    ],
  },
  {
    cat: 'Backend',
    dot: 'red',
    pills: [
      { l: 'Node.js', c: 'red' },
      { l: 'Express', c: 'red' },
      { l: 'Python', c: 'red' },
      { l: 'REST APIs', c: 'red' },
      { l: 'GraphQL', c: 'red' },
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
      { l: 'RAG Pipelines', c: 'mag' },
      { l: 'Prompt Eng.', c: 'mag' },
      { l: 'Fine-tuning', c: 'mag' },
    ],
  },
  {
    cat: 'Databases',
    dot: 'cyan',
    pills: [
      { l: 'PostgreSQL', c: 'cyan' },
      { l: 'MySQL', c: 'cyan' },
      { l: 'MongoDB', c: 'cyan' },
      { l: 'Prisma', c: 'cyan' },
      { l: 'Redis', c: 'cyan' },
    ],
  },
  {
    cat: 'DevOps / Tools',
    dot: 'red',
    pills: [
      { l: 'Git', c: 'red' },
      { l: 'Docker', c: 'red' },
      { l: 'Vercel', c: 'red' },
      { l: 'CI/CD', c: 'red' },
      { l: 'Linux', c: 'red' },
      { l: 'AWS', c: 'red' },
    ],
  },
  {
    cat: 'Languages',
    dot: 'mag',
    pills: [
      { l: 'JavaScript', c: 'mag' },
      { l: 'TypeScript', c: 'mag' },
      { l: 'Python', c: 'mag' },
      { l: 'Java', c: 'mag' },
      { l: 'SQL', c: 'mag' },
    ],
  },
];
