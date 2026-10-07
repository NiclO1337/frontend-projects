import { FaGithub, FaLinkedin } from "react-icons/fa6";

// Personal details, copied from Project 1. Components only render this data.
export const profile = {
  name: "Niclas Hugdahl",
  title: "Junior Fullstack Software Developer",
  tagline: "I build practical, accessible applications.",
  summary: "Backend & frontend developer. Problem-solver at heart.",
  currently: "Full Stack C# .NET at Lexicon (2026)",
  location: "Stockholm, Sweden",
  languages: [
    { name: "Swedish", level: "Native" },
    { name: "English", level: "Fluent" },
  ],
  about: [
    "I build practical applications that solve real problems. With experience across the full stack—from backend systems to responsive frontends—and a background in supporting users and coordinating complex workflows, I understand both the technical and human side of software development.",
    "I bring 10 years of diverse back-office experience, including purchasing, sales support, graphic design, and customer service. I’m a quick learner, detail-oriented, and passionate about problem-solving.",
    "Outside of work, I enjoy yoga, cycling, CrossFit, nature walks, and gaming.",
  ],
  // No email or phone number on purpose: visitors use the contact form.
  social: [
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com/NiclO1337",
      icon: FaGithub,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/niclas-hugdahl",
      icon: FaLinkedin,
    },
  ],
  // File in public/, so the URL starts at the site root.
  cvPath: "/cv/niclas-hugdahl-cv.pdf",
};
