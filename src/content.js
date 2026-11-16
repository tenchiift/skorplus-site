export const REPO_URL = "https://github.com/tenchiift/ProjectSkorPlus-web";

// Live app link for the primary CTA. Replace with the deployed URL when ready.
export const APP_URL = REPO_URL;

export const SITE = {
  wordmark: "skorplus",
  subtitle: "study companion",
  tagline: "Student study companion",
};

export const CTA = {
  title: "Bring your whole semester into one place.",
  body: "Track progress, practise with real papers, and keep your people close. SkorPlus is open source and free to run.",
  button: "Open SkorPlus",
};

export const WHY = {
  heading: "Why it was created",
  lead: "Students juggle a dozen tabs: the timetable here, past papers there, notes somewhere else.",
  body: "SkorPlus was built to fold that into one place. Progress, practice, help and community sit in a single semester view, so the next thing to do is always clear. The goal is simple: less time deciding where to look, more time studying.",
};

// Real student quotes go here. Do not fabricate people or claims.
export const REVIEWS = [];

// Shown in the features section. Honest label: these are artwork, not app screenshots.
export const FEATURE_SHOT = {
  src: "/shots/onboarding-1.png",
  alt: "SkorPlus illustration of the AI study buddy",
  label: "Study buddy",
};

export const CATEGORIES = [
  { id: "ai", label: "AI" },
  { id: "practice", label: "Practice" },
  { id: "planning", label: "Planning" },
  { id: "social", label: "Social" },
];

export const FEATURES = [
  {
    name: "Scan and Solve",
    category: "ai",
    detail:
      "Photograph or upload a question image and get a worked solution. Runs through a server-side proxy, so the API key never ships in the client bundle.",
    shot: "/shots/onboarding-2.png",
  },
  {
    name: "AI Study Buddy",
    category: "ai",
    detail:
      "A chat assistant built for studying: explanations, practice prompts, and help, with history kept per account.",
    shot: "/shots/onboarding-1.png",
  },
  {
    name: "Past Papers",
    category: "practice",
    detail:
      "Browse past-year papers and sit final exams. Lecturers manage papers and PDF uploads, and students see changes instantly.",
    shot: "/shots/login.png",
  },
  {
    name: "Modules",
    category: "practice",
    detail:
      "Module pages with questions and per-module progress tracking, managed from a modules manager.",
  },
  {
    name: "Semester Pulse",
    category: "planning",
    detail:
      "Set your semester start date once. The dashboard counts Week 1 through Study Week to Exam Week, with an animated progress bar.",
    shot: "/shots/get-started.png",
  },
  {
    name: "Tasks",
    category: "planning",
    detail: "A study checklist with priorities, so the next thing to do is always visible.",
  },
  {
    name: "Friends",
    category: "social",
    detail: "Add friends and follow their profiles and progress.",
  },
  {
    name: "Send Work",
    category: "social",
    detail:
      "Submit work to lecturers and track reviewed status, while lecturers get an inbox to review submissions.",
  },
];

export const PILLARS = [
  {
    name: "Practice",
    detail:
      "Past papers, module questions, and quizzes. The material students already revise from, organised in one place.",
  },
  {
    name: "AI help",
    detail:
      "Scan and Solve plus the AI Study Buddy. Explanations on demand, served through a server-side proxy so keys stay off the client.",
  },
  {
    name: "Progress",
    detail:
      "Semester Pulse, tasks with priorities, and daily streaks. The dashboard always shows where the semester stands.",
  },
  {
    name: "People",
    detail:
      "Friends, submissions, and a lecturer inbox with verified signup. Studying stays social and accountable.",
  },
];

export const STACK = [
  ["Framework", "React 19 with Vite 6 and React Router 7"],
  ["Backend", "Supabase for auth and database"],
  ["AI", "Vercel serverless functions proxying OpenRouter"],
  ["Themes", "Light, Dark, and Soft Pink, switched from Settings"],
  ["License", "MIT"],
];

// The project ships flat vector illustrations (not UI screenshots). Label them as artwork.
export const ARTWORK = [
  { src: "/shots/onboarding-1.png", label: "Study buddy" },
  { src: "/shots/onboarding-2.png", label: "Maths" },
  { src: "/shots/login.png", label: "Sign in" },
  { src: "/shots/get-started.png", label: "Get started" },
];

export const STATEMENT =
  "SkorPlus brings the whole semester into one place. Track progress week by week, practise with real past papers, scan and solve questions, talk to an AI study buddy, and keep your people close. Built for students, with a lecturer and admin side so the material stays current.";

export const INTRO =
  "SkorPlus is a student study companion web app. It tracks semester progress, practises with past papers, scans and solves questions, chats with an AI study buddy, submits work to lecturers, and keeps friends connected.";

// Scripted assistant panel. No fabricated person, email, or claim (R-23, R-38).
export const CHAT = {
  start: {
    messages: [
      "Hi. This is the SkorPlus assistant, an automated helper, not a person.",
      "I can explain the project. What would you like to know?",
    ],
    options: [
      { label: "What is SkorPlus?", to: "about" },
      { label: "What can it do?", to: "features" },
      { label: "What is it built with?", to: "stack" },
      { label: "Where is the code?", to: "code" },
    ],
  },
  about: {
    messages: [INTRO],
    options: [
      { label: "What can it do?", to: "features" },
      { label: "Where is the code?", to: "code" },
      { label: "Back to start", to: "start" },
    ],
  },
  features: {
    messages: [
      "Eight tools across four areas:",
      "AI: Scan and Solve, AI Study Buddy.",
      "Practice: Past Papers, Modules.",
      "Planning: Semester Pulse, Tasks.",
      "Social: Friends, Send Work.",
    ],
    options: [
      { label: "Open the features page", to: "/features" },
      { label: "What is it built with?", to: "stack" },
      { label: "Back to start", to: "start" },
    ],
  },
  stack: {
    messages: [
      "React 19 with Vite 6, React Router 7, and Supabase for auth and database.",
      "AI runs through Vercel serverless functions proxying OpenRouter, so keys stay on the server.",
    ],
    options: [
      { label: "Where is the code?", to: "code" },
      { label: "Back to start", to: "start" },
    ],
  },
  code: {
    messages: [
      "SkorPlus is open source under the MIT license.",
      "The full source and setup guide are on GitHub.",
    ],
    options: [
      { label: "Open GitHub", href: REPO_URL },
      { label: "Back to start", to: "start" },
    ],
  },
};
