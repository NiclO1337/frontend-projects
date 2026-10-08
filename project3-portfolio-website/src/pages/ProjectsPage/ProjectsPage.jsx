import { useSearchParams } from "react-router";
import Button from "../../components/Button/Button.jsx";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import ProjectFilter from "../../components/ProjectFilter/ProjectFilter.jsx";
import Reveal from "../../components/Reveal/Reveal.jsx";
import { projects } from "../../data/projects.js";
import { filterProjectsByTech, getTechList } from "../../utils/projects.js";
import styles from "./ProjectsPage.module.css";

// The data never changes while the app runs, so work this out once.
const technologies = getTechList(projects);

export default function ProjectsPage() {
  // The chosen technology lives in the URL (/projects?tech=python), not in
  // component state. A refresh, the back button and a shared link then all
  // show the same list. useSearchParams reads and writes that "?tech=..." part.
  const [searchParams, setSearchParams] = useSearchParams();
  const tech = searchParams.get("tech") || null;

  const visibleProjects = filterProjectsByTech(projects, tech);

  // An empty object clears the search params, which removes "?tech=...".
  function selectTech(slug) {
    setSearchParams(slug ? { tech: slug } : {});
  }

  return (
    <>
      <title>Projects – Niclas Hugdahl</title>
      <meta
        name="description"
        content="Projects by Niclas Hugdahl, with the technologies used, live demos and source code."
      />

      <h1>Projects</h1>
      <p className={styles.intro}>
        {projects.length} projects from my studies and spare time. I started
        with HTML and CSS, moved on to JavaScript and Python, and later built
        full-stack apps with Django, React, and Next.js, plus a neural network.
        Most of them have a link to a live demo and the source code, so you can
        try them out and see how they are built.
      </p>

      <div className={styles.filter}>
        <ProjectFilter
          technologies={technologies}
          selected={tech}
          onChange={selectTech}
        />
        {/* aria-live="polite": a screen reader announces the new count after
            the user's current speech, without interrupting it. The element is
            always on the page, because only changes to an existing live
            region are announced. */}
        <p className={styles.count} aria-live="polite">
          Showing {visibleProjects.length} of {projects.length} projects
        </p>
      </div>

      {visibleProjects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects use that technology.</p>
          <Button variant="ghost" onClick={() => selectTech(null)}>
            Show all projects
          </Button>
        </div>
      ) : (
        // A list of cards: screen readers announce "list, 8 items".
        <ul className={styles.grid}>
          {visibleProjects.map((project) => (
            <Reveal as="li" key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}
