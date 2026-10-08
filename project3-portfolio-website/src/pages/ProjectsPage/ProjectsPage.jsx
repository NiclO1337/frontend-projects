import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import { projects } from "../../data/projects.js";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  return (
    <>
      <title>Projects – Niclas Hugdahl</title>
      <meta
        name="description"
        content="Projects by Niclas Hugdahl, with the technologies used, live demos and source code."
      />

      <h1>Projects</h1>
      <p className={styles.intro}>
        {projects.length} projects from my studies and spare time. I started with HTML and CSS, moved on to JavaScript and Python, and later built full-stack apps with Django, React, and Next.js, plus a neural network. Most of them have a link to a live demo and the source code, so you can try them out and see how they are built.
      </p>

      {/* A list of cards: screen readers announce "list, 8 items". */}
      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}
