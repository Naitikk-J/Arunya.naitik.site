export interface Event {
  id: string;
  title: string;
  club: string;
  type: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  duration?: string;
  prizePool?: string;
  status: 'upcoming' | 'live' | 'completed' | 'registration';
  tags: string[];
}

export const events: Event[] = [
  {
    id: 'ev-001',
    club: 'Analytics Club',
    title: 'CASE 001: REOPENED',
    type: 'Competition',
    venue: 'SAC',
    date: '2026-02-22',
    time: '10:00 AM - 1:00 PM',
    duration: '3-4 hrs',
    description: 'A two-round forensic case study competition. Round 1: Teams analyze a crime narrative and complete a competitive quiz. Round 2: Teams solve a plot twist to find the true mastermind and create a visual crime board for peer evaluation.',
    status: 'registration',
    tags: ['Forensic', 'Case Study', 'Mystery']
  },
  {
    id: 'ev-002',
    club: 'Bhagwat Club',
    title: 'Essay Writing Competition',
    type: 'Competition',
    venue: 'SH 4',
    date: '2026-02-21',
    time: '2:00 PM - 4:00 PM',
    prizePool: '3000',
    description: 'Aksharvanta is an on-the-spot essay writing competition that tests participants’ clarity of thought, language proficiency, and analytical expression on contemporary themes. The event encourages critical thinking, originality, and disciplined writing without the use of reference material or prior preparation.',
    status: 'registration',
    tags: ['Literary', 'Essay', 'Writing']
  },
  {
    id: 'ev-003',
    club: 'HackerRank Campus Crew',
    title: 'Code Carnival 2026',
    type: 'Technical',
    venue: 'SH 12',
    date: '2026-02-21',
    time: '2:00 PM - 5:00 PM',
    duration: '3 Hrs',
    description: '3-day gamified coding fest with logic wall, debugging sprint, blind coding, binary sprint, AI games, and finals.',
    status: 'registration',
    tags: ['Coding', 'Hackathon', 'Technical']
  },
  {
    id: 'ev-004',
    club: 'Hindi Samiti',
    title: 'अशुभाषण प्रतियोगिता (Extempore Speech)',
    type: 'Competition',
    venue: 'Conclave Center',
    date: '2026-02-22',
    time: '11:00 AM - 1:00 PM',
    duration: '2 hrs',
    prizePool: '4000',
    description: 'The Hindi Samiti MITS-DU is organizing an Extempore Speech Competition to enhance students’ spontaneous thinking, communication skills, and stage confidence.',
    status: 'registration',
    tags: ['Speech', 'Hindi', 'Public Speaking']
  },
  {
    id: 'ev-005',
    club: 'IEI Socity',
    title: 'Beyond the Problems',
    type: 'Technical Competition',
    venue: 'SH 2',
    date: '2026-02-22',
    time: '10:00 AM - 12:00 PM',
    prizePool: '3500',
    description: 'IEI - The event is based on the theme “Problem of India.” Students will choose one real problem of the country and present a simple, practical solution. The focus is on thinking beyond complaints and showing how youth can take responsibility and bring change through action.',
    status: 'registration',
    tags: ['Social Impact', 'Problem Solving', 'Idea Presentation']
  },
  {
    id: 'ev-006',
    club: 'IOT EDGE CLUB',
    title: 'Goblet Of Fire',
    type: 'Adventure Game • Puzzle Hunt',
    venue: 'SH 1',
    date: '2026-02-22',
    time: '1:00 PM - 4:00 PM',
    duration: '4 hrs',
    description: 'Harry Potter themed team event with decoding, blindfold puzzle, and Horcrux treasure hunt.',
    status: 'registration',
    tags: ['Adventure', 'Puzzle', 'Team']
  },
  {
    id: 'ev-007',
    club: 'Lafz-e-Bayan',
    title: 'Phehel-e-Hunar',
    type: 'POETRY/SHAYARI',
    venue: 'Conclave Centre',
    date: '2026-02-23',
    time: '11:00 AM - 3:00 PM',
    duration: '2 hrs',
    prizePool: '12000',
    description: 'Lafz-e-Bayan club is pleased to propose a poetry and shayari-based cultural event titled "Pehel-e-Hunar." This event aims to provide a creative platform for students to express their literary talent by presenting poetry or shayari inspired by their favourite mythological or movie characters or any poet they admire.',
    status: 'registration',
    tags: ['Poetry', 'Shayari', 'Cultural']
  },
  {
    id: 'ev-008',
    club: 'Mathematics Club',
    title: 'Trade Mark',
    type: 'Analytical Completion',
    venue: 'SH 12',
    date: '2026-02-23',
    time: '9:00 AM - 4:00 PM',
    description: 'Trade Matrix is a virtual share market competition where participants engage in a simulated trading environment to apply mathematical logic, analytical thinking, and risk management strategies. The event challenges teams to make smart investment decisions under dynamic market conditions, testing their problem-solving and decision-making skills.',
    status: 'registration',
    tags: ['Finance', 'Trading', 'Analytics']
  },
  {
    id: 'ev-009',
    club: 'Nutrition Ninja Club',
    title: 'PlayFit Arena',
    type: 'Wellness-Based Team Event',
    venue: 'Directors lawn',
    date: '2026-02-23',
    time: '10:00 AM - 2:00 PM',
    duration: '4 hrs',
    prizePool: '6000',
    description: '3-round team game: fruit/property match, balloon cup knockout, and stack-and-run challenge.',
    status: 'registration',
    tags: ['Wellness', 'Games', 'Team']
  },
  {
    id: 'ev-010',
    club: 'RASHTRAAY',
    title: 'RASHTRAAY Event',
    type: 'Cultural',
    venue: 'SAC',
    date: '2026-02-21',
    time: '2:00 PM - 4:00 PM',
    duration: '2 hrs',
    description: 'A flagship cultural event celebrating national heritage and talent.',
    status: 'registration',
    tags: ['Cultural', 'Heritage']
  },
  {
    id: 'ev-011',
    club: 'Soft Computing + Startup cell',
    title: 'CREATE-X',
    type: 'Technical & Research',
    venue: 'NR2',
    date: '2026-02-21',
    time: '2:00 PM - 5:00 PM',
    description: 'A three-round project expo featuring research, software, and hardware projects. It includes a registration screening, an online idea explanation (if participation is high), and a final offline physical exhibition of working models or prototypes.',
    status: 'registration',
    tags: ['Project Expo', 'Innovation', 'Research']
  },
  {
    id: 'ev-012',
    club: 'StopNot',
    title: 'Comic Clash',
    type: 'Session',
    venue: 'Colloquoum',
    date: '2026-02-22',
    time: '2:00 PM - 3:00 PM',
    duration: '1 hr',
    description: 'A Standup comedy event where a local Comic will be performing.',
    status: 'registration',
    tags: ['Comedy', 'Entertainment']
  },
  {
    id: 'ev-013',
    club: 'VIDYUT',
    title: 'Logic & Laughs',
    type: 'Technical',
    venue: 'SAC',
    date: '2026-02-22',
    time: '2:00 PM - 5:00 PM',
    duration: '3 hrs',
    description: 'A one-day event blending technical logic with creative expression and physical simulations of computing principles. It consists of two rounds: Round 1 - Technical Meme-O-Mania: Participants create engaging memes (photos, videos, or stickers) based on technical phrases or coding scenarios. Round 2 - Binary Musical Chairs: A rhythmic game using logic gates where participants must identify if their chair\'s state (0 or 1) satisfies a shouted "Logic Gate" condition (e.g., AND gate) to stay in the game.',
    status: 'registration',
    tags: ['Fun', 'Logic', 'Technical']
  },
  {
    id: 'ev-014',
    club: 'Team Scavengers',
    title: 'Drift Show & Apex Pass',
    type: 'Drift Show+ Stall+ workshop',
    venue: 'old Basketball Court',
    date: '2026-02-21',
    time: '4:00 PM - 6:00 PM',
    duration: '2 hrs',
    description: 'A motorsport event featuring: Live Drift Show: Professional driving demonstrations showcasing kart control and drifting techniques. Apex Pass: A paid, supervised driving experience allowing participants to drive go-karts on a controlled track.',
    status: 'registration',
    tags: ['Motorsport', 'Drifting', 'Go-Kart']
  },
  {
    id: 'ev-015',
    club: 'GFG Campus Body',
    title: 'Interactive Challenge Zone',
    type: 'Technical',
    venue: 'SH 12',
    date: '2026-02-21, 22, 23',
    time: 'All Day',
    description: 'Booth with puzzles, logic games, deduction challenges, and mini-tournaments for all students.',
    status: 'registration',
    tags: ['Games', 'Puzzles', 'Interactive']
  },
  {
    id: 'ev-016',
    club: 'ELECTRONICS CLUB',
    title: 'AI MEETS ELECTRONIC: AN INTERACTIVE WORKSHOP',
    type: 'WORKSHOP',
    venue: 'SH 12',
    date: '2026-02-22',
    time: '1:00 PM - 2:00 PM',
    duration: '1 hr',
    description: 'An interactive workshop exploring the intersection of AI and Electronics.',
    status: 'registration',
    tags: ['AI', 'Electronics', 'Workshop']
  }
];
