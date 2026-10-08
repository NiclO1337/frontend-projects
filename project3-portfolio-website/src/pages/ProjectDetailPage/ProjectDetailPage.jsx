import { Link, useLoaderData, useLocation } from "react-router";
import Button from "../../components/Button/Button.jsx";
import TechTag from "../../components/TechTag/TechTag.jsx";
import { getAdjacentProjects } from "../../utils/projects.js";
import styles from "./ProjectDetailPage.module.css";

export default function ProjectDetailPage() {
  // Whatever projectLoader returned for this URL. The loader already handled
  // an unknown slug, so there is always a project here.
  const project = useLoaderData();
  const { previous, next } = getAdjacentProjects(project.slug);

  // Location state is data attached to a navigation, not shown in the URL.
  // The project cards put the list's "?tech=..." in it, so the back link
  // returns to the same filter. Opening this page directly has no state.
  const location = useLocation();
  const backSearch = location.state?.fromSearch ?? "";

  return (
    <>
      {/* A template literal gives <title> one string child, as React expects. */}
      <title>{`${project.title} – Niclas Hugdahl`}</title>
      <meta name="description" content={project.summary} />

      <Link
        to={{ pathname: "/projects", search: backSearch }}
        className={styles.back}
      >
        <span aria-hidden="true">←</span> All projects
      </Link>

      <h1>{project.title}</h1>
      <p className={styles.meta}>
        {project.year} · {project.type}
      </p>

      <div className={styles.media}>
        <img
          className={styles.image}
          src={project.image}
          alt={project.imageAlt}
          width="900"
          height="533"
        />
      </div>

      <div className={styles.description}>
        {project.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h2 className={styles.heading}>Highlights</h2>
      <ul className={styles.highlights}>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <h2 className={styles.heading}>Technologies</h2>
      <ul className={styles.tags}>
        {project.tech.map((name) => (
          <li key={name}>
            <TechTag>{name}</TechTag>
          </li>
        ))}
      </ul>

      {/* Not every project is deployed or has a public repository. */}
      {(project.liveUrl || project.repoUrl) && (
        <div className={styles.actions}>
          {project.liveUrl && (
            <Button href={project.liveUrl}>
              Live demo <span aria-hidden="true">↗</span>
            </Button>
          )}
          {project.repoUrl && (
            <Button href={project.repoUrl} variant="ghost">
              Source code <span aria-hidden="true">↗</span>
            </Button>
          )}
        </div>
      )}

      {/* The links pass the same state on, so the back link above keeps the
          filter after moving between projects. */}
      <nav aria-label="More projects" className={styles.pager}>
        <Link
          to={`/projects/${previous.slug}`}
          state={location.state}
          className={styles.pagerLink}
        >
          <span className={styles.pagerLabel}>
            <span aria-hidden="true">←</span> Previous project
          </span>
          {previous.title}
        </Link>
        <Link
          to={`/projects/${next.slug}`}
          state={location.state}
          className={`${styles.pagerLink} ${styles.pagerNext}`}
        >
          <span className={styles.pagerLabel}>
            Next project <span aria-hidden="true">→</span>
          </span>
          {next.title}
        </Link>
      </nav>
    </>
  );
}
