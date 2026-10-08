import bananaPalaceImg from "../assets/projects/banana-palace.webp";
import bunIntendedImg from "../assets/projects/bun-intended.webp";
import dreamAchieverImg from "../assets/projects/dream-achiever.webp";
import modernCvImg from "../assets/projects/modern-cv.webp";
import purrfectPawsImg from "../assets/projects/purrfect-paws-predictor.webp";
import rpsBattleArenaImg from "../assets/projects/rps-battle-arena.webp";
import strawberryLoversImg from "../assets/projects/strawberry-lovers.webp";
import weightliftingCalculatorImg from "../assets/projects/weightlifting-calculator.webp";

// All projects, newest first. `featured` marks the one shown on the Home page
// (only one project should have it). The screenshots are 900x533 WebP images
// of the site on several devices.
export const projects = [
  {
    slug: "bun-intended",
    title: "Bun Intended",
    year: 2026,
    type: "Lexicon – Project 2",
    featured: false,
    summary:
      'Multi-page website for a fictional Stockholm burger restaurant with a dark "ketchup & mustard" theme, menu filter, live open-now badge and a validated booking form.',
    description: [
      "A website for a fictional burger restaurant on Södermalm in Stockholm. It has to make people hungry, answer the practical questions (menu, prices, opening hours, where it is) and make it easy to book a table.",
      "Built as Project 2 of the frontend part of the C# course at Lexicon, to practise multi-page layouts, Bootstrap, responsive design, UI/UX and JavaScript interaction.",
    ],
    highlights: [
      "Menu page with a category filter",
      "Image slider on the home page",
      'A live "open now" badge on the Hours & Location page',
      "Validated table booking form",
      "Allergens page, so every guest knows what is in the food",
    ],
    tech: ["HTML", "CSS", "Bootstrap", "JavaScript"],
    image: bunIntendedImg,
    imageAlt:
      "Bun Intended website on a monitor, laptop, tablet and phone, showing the Our Story and Hours & Location pages",
    liveUrl: "https://frontend-projects-project2-modern-b.vercel.app/",
    repoUrl:
      "https://github.com/NiclO1337/frontend-projects/tree/main/project2-modern-business-website",
  },
  {
    slug: "modern-cv",
    title: "Modern CV",
    year: 2026,
    type: "Lexicon – Project 1",
    featured: false,
    summary:
      "One-page responsive CV in the style of a modern Canva template, with dark mode and a PDF download.",
    description: [
      "A one-page CV website in a clean, modern and professional style. The design is inspired by modern Canva CV templates, with a dark navy sidebar and a light main column.",
      "Built as Project 1 of the frontend part of the C# course at Lexicon, to practise semantic HTML, CSS layout (Flexbox and Grid), UI design and responsive design.",
    ],
    highlights: [
      "Single column on mobile, two columns on desktop",
      "Experience and education timeline",
      "Dark mode",
      "CV available as a PDF download",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    image: modernCvImg,
    imageAlt:
      "Modern CV website in light and dark mode on a monitor, laptop, tablet and phone",
    liveUrl: "https://frontend-projects-project1-modern-c.vercel.app/",
    repoUrl:
      "https://github.com/NiclO1337/frontend-projects/tree/main/project1-modern-cv-webpage",
  },
  {
    slug: "weightlifting-calculator",
    title: "Weightlifting Calculator",
    year: 2025,
    type: "Personal project",
    featured: false,
    summary:
      'Calculates training weights from a 1RM, shows which plates to load, and has a "Free Calc" bar builder. Settings are saved locally and it can be installed as a PWA.',
    description: [
      'Calculates training weights as percentages of a one-rep max (1RM) and shows which plates to load on the bar. A "Free Calc" mode lets you build a bar plate by plate.',
      "Settings are saved locally in the browser, and the app can be installed on a phone as a progressive web app (PWA).",
    ],
    highlights: [
      "1RM calculator with a table of percentages",
      "Shows which plates to load for each weight",
      "Free Calc bar builder",
      "Settings saved locally",
      "Installable as a PWA",
      "Tests written with Vitest",
    ],
    tech: ["React", "JavaScript", "Vite", "Vitest", "PWA"],
    image: weightliftingCalculatorImg,
    imageAlt:
      "Weightlifting Calculator app on a monitor, laptop, tablet and phone, showing the 1RM table and a loaded bar",
    liveUrl: "https://niclo1337.github.io/weightlifting-calculator",
    repoUrl: "https://github.com/NiclO1337/weightlifting-calculator",
  },
  {
    slug: "purrfect-paws-predictor",
    title: "Purrfect Paws Predictor",
    year: 2024,
    type: "Code Institute – PP5",
    featured: false,
    summary:
      "A convolutional neural network trained on 25,000 images to tell cats from dogs, with a Streamlit dashboard for the data study and live predictions.",
    description: [
      "A convolutional neural network trained on 25,000 images to tell cats from dogs. A Streamlit dashboard presents the project summary, the image study, the hypotheses and the model's performance metrics, and lets you try live predictions.",
      "To be honest about the result: the deployed model struggles with live images, as the project's README notes. Built as Portfolio Project 5 of the Code Institute Diploma in Fullstack Software Development, specialising in Data Engineering, Predictive Analytics and AI.",
    ],
    highlights: [
      "Neural network trained on 25,000 images",
      "Streamlit dashboard with an image study, hypotheses and performance metrics",
      "Live predictions in the dashboard",
      "Open about its limits: the deployed model struggles with live images",
    ],
    tech: ["Python", "TensorFlow", "Streamlit", "Pandas", "Jupyter"],
    image: purrfectPawsImg,
    imageAlt:
      "Purrfect Paws Predictor dashboard on a monitor, laptop, tablet and phone, showing the image study and performance metrics",
    liveUrl: "https://purrfect-paws-predictor-ab2bd8b45a44.herokuapp.com/",
    repoUrl: "https://github.com/NiclO1337/pp5-cats-vs-dogs",
  },
  {
    slug: "banana-palace",
    title: "Banana Palace",
    year: 2024,
    type: "Code Institute – PP4",
    featured: true,
    summary:
      "Full-stack Django restaurant site with user accounts, table reservations (create/edit/cancel), menu and discounts. Planned with agile user stories on GitHub Projects.",
    description: [
      "A full-stack Django website for a restaurant. Visitors can create an account, look at the menu and discounts, and reserve a table by picking it on a floor plan. Reservations can be edited and cancelled later.",
      "Planned with agile user stories on GitHub Projects. Built as Portfolio Project 4 of the Code Institute Diploma in Fullstack Software Development.",
    ],
    highlights: [
      "User accounts with Allauth",
      "Table reservations: create, edit and cancel",
      "Pick a table on a floor plan",
      "Menu and discounts",
      "Planned with agile user stories on GitHub Projects",
    ],
    tech: ["Python", "Django", "JavaScript", "Bootstrap", "PostgreSQL"],
    image: bananaPalaceImg,
    imageAlt:
      "Banana Palace website on a monitor, laptop, tablet and phone, showing the reservation floor plan and the Hours & Location page",
    liveUrl: "https://banana-palace-9ad263ab8cf3.herokuapp.com/",
    repoUrl: "https://github.com/NiclO1337/pp4-banana-palace",
  },
  {
    slug: "dream-achiever",
    title: "Dream Achiever",
    year: 2023,
    type: "Code Institute – PP3",
    featured: false,
    summary:
      "Python command-line budget calculator that works out how long it takes to reach a savings goal and gives money-saving tips.",
    description: [
      "A Python command-line program that works out how long it takes to reach a savings goal and gives tips for saving money. It runs in a terminal embedded in the web page.",
      "Built as Portfolio Project 3 of the Code Institute Diploma in Fullstack Software Development.",
    ],
    highlights: [
      "Calculates how long it takes to reach a savings goal",
      "Gives money-saving tips",
      "Runs in a terminal in the browser",
    ],
    tech: ["Python"],
    image: dreamAchieverImg,
    imageAlt:
      "Dream Achiever program in a terminal on a monitor, laptop, tablet and phone, over a sky background",
    liveUrl: "https://dream-achiever-3a6af54c4f68.herokuapp.com/",
    repoUrl: "https://github.com/NiclO1337/pp3-dream-achiever",
  },
  {
    slug: "rps-battle-arena",
    title: "RPS Battle Arena",
    year: 2023,
    type: "Code Institute – PP2",
    featured: false,
    summary:
      "Rock-paper-scissors game in JavaScript against the character Arnold, with score tracking and smooth screen transitions.",
    description: [
      "A rock-paper-scissors game written in JavaScript. You play against a character called Arnold, the score is tracked round by round, and the screens change with smooth transitions.",
      "Built as Portfolio Project 2 of the Code Institute Diploma in Fullstack Software Development.",
    ],
    highlights: [
      "Play against Arnold",
      "Score tracking",
      "Smooth screen transitions",
      "Choose a colour theme",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    image: rpsBattleArenaImg,
    imageAlt:
      "RPS Battle Arena game on a monitor, laptop, tablet and phone, shown in different colour themes",
    liveUrl: "https://niclo1337.github.io/pp2-playtime/",
    repoUrl: "https://github.com/NiclO1337/pp2-playtime",
  },
  {
    slug: "strawberry-lovers",
    title: "Strawberry Lovers",
    year: 2023,
    type: "Code Institute – PP1",
    featured: false,
    summary:
      "Static multi-page community site about growing strawberries, with recipes, a gallery and a sign-up form.",
    description: [
      "A static multi-page website for a community of strawberry lovers, with tips for growing strawberries, recipes, a photo gallery and a sign-up form.",
      "Built as Portfolio Project 1 of the Code Institute Diploma in Fullstack Software Development.",
    ],
    highlights: [
      "Tips for growing strawberries",
      "Recipes",
      "Photo gallery",
      "Sign-up form",
    ],
    tech: ["HTML", "CSS"],
    image: strawberryLoversImg,
    imageAlt:
      "Strawberry Lovers website on a monitor, laptop, tablet and phone, showing the home page and the sign-up form",
    liveUrl: "https://niclo1337.github.io/pp1-strawberry-lovers/index.html",
    repoUrl: "https://github.com/NiclO1337/pp1-strawberry-lovers",
  },
];
