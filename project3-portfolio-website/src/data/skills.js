import {
  FaArrowsRotate,
  FaDiagramProject,
  FaPenRuler,
  FaTableColumns,
} from "react-icons/fa6";
import { DiMsqlServer, DiVisualstudio } from "react-icons/di";
import { RiOpenaiFill } from "react-icons/ri";
import {
  SiBootstrap,
  SiClaudecode,
  SiCss,
  SiDjango,
  SiDotnet,
  SiFigma,
  SiGit,
  SiGithub,
  SiGithubcopilot,
  SiGitpod,
  SiHtml5,
  SiJavascript,
  SiMiro,
  SiNextdotjs,
  SiPostgresql,
  SiPycharm,
  SiPython,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

// Skill groups from Project 1. `icon` is the icon component to render.
// Brands without an icon in the library get a generic one (Scrum, Kanban,
// Balsamiq, Lucidchart), and Entity Framework shares the .NET logo.
export const skillGroups = [
  {
    id: "technologies",
    name: "Technologies",
    items: [
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Python", icon: SiPython },
      { name: "TypeScript", icon: SiTypescript },
      { name: "C#", icon: SiSharp },
    ],
  },
  {
    id: "frameworks",
    name: "Frameworks",
    items: [
      { name: "Django", icon: SiDjango },
      { name: "Bootstrap", icon: SiBootstrap },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "ASP.NET", icon: SiDotnet },
      { name: "Entity Framework", icon: SiDotnet },
    ],
  },
  {
    id: "databases",
    name: "Databases",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "SQL Server", icon: DiMsqlServer },
    ],
  },
  {
    id: "version-control",
    name: "Version control",
    items: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    id: "agile",
    name: "Agile",
    items: [
      { name: "Scrum", icon: FaArrowsRotate },
      { name: "Kanban", icon: FaTableColumns },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    items: [
      { name: "VS Code", icon: VscVscode },
      { name: "Visual Studio", icon: DiVisualstudio },
      { name: "Gitpod", icon: SiGitpod },
      { name: "PyCharm", icon: SiPycharm },
      { name: "Balsamiq", icon: FaPenRuler },
      { name: "Lucidchart", icon: FaDiagramProject },
      { name: "Miro", icon: SiMiro },
      { name: "Figma", icon: SiFigma },
    ],
  },
  {
    id: "ai-tools",
    name: "AI tools",
    items: [
      { name: "GitHub Copilot", icon: SiGithubcopilot },
      { name: "Claude Code", icon: SiClaudecode },
      { name: "ChatGPT", icon: RiOpenaiFill },
    ],
  },
];
