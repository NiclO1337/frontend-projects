import { Link, useLocation } from "react-router";
import Button from "../Button/Button.jsx";
import TechTag from "../TechTag/TechTag.jsx";
import styles from "./ProjectCard.module.css";

/**
 * Summary of one project: screenshot, title, year and type, a short
 * description, the technologies used and links. It's an <article> because it
 * makes sense on its own.
 * @param {object} props
 * @param {object} props.project one item from data/projects.js. `liveUrl` and
 *   `repoUrl` are optional: without them the matching button is not shown.
 */
export default function ProjectCard({ project }) {
  const {
    slug,
    title,
    year,
    type,
    summary,
    tech,
    image,
    imageAlt,
    liveUrl,
    repoUrl,
  } = project;

  // The search part of the current URL, like "?tech=python". It is passed to
  // the detail page as location state, so its "All projects" link can return
  // to the same filter.
  const { search } = useLocation();
  // The image, the title and the "Details" button all go to the same place.
  const detailsLink = {
    to: `/projects/${slug}`,
    state: { fromSearch: search },
  };

  return (
    <article className={styles.card}>
      {/* The image link repeats the title link for mouse users with a bigger
          click target. aria-hidden and tabIndex={-1} keep it away from screen
          readers and the Tab key, so nobody meets the same link twice. */}
      <Link
        {...detailsLink}
        className={styles.media}
        aria-hidden="true"
        tabIndex={-1}
      >
        {/* width and height let the browser reserve the space before the image
            loads. loading="lazy" delays images that are far down the page. */}
        <img
          className={styles.image}
          src={image}
          alt={imageAlt}
          width="900"
          height="533"
          loading="lazy"
        />
      </Link>

      <div className={styles.body}>
        <p className={styles.meta}>
          {year} · {type}
        </p>
        <h2 className={styles.title}>
          <Link {...detailsLink} className={styles.titleLink}>
            {title}
          </Link>
        </h2>
        <p>{summary}</p>

        <ul className={styles.tags}>
          {tech.map((name) => (
            <li key={name}>
              <TechTag>{name}</TechTag>
            </li>
          ))}
        </ul>

        {/* The visually hidden text makes every link's name unique, because
            a screen reader user may list all the links on the page. */}
        <div className={styles.links}>
          {/* `liveUrl && ...` renders nothing when the project has no live
              demo (or no public repo), so those buttons are simply left out. */}
          {liveUrl && (
            <Button href={liveUrl} variant="ghost" size="small">
              Live <span className="visually-hidden">demo of {title}</span>
              <span aria-hidden="true">↗</span>
            </Button>
          )}
          {repoUrl && (
            <Button href={repoUrl} variant="ghost" size="small">
              GitHub <span className="visually-hidden">code of {title}</span>
              <span aria-hidden="true">↗</span>
            </Button>
          )}
          <Button {...detailsLink} size="small">
            Details <span className="visually-hidden">of {title}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
