import { FaDownload, FaLocationDot } from "react-icons/fa6";
import BentoGrid from "../../components/BentoGrid/BentoGrid.jsx";
import BentoTile from "../../components/BentoTile/BentoTile.jsx";
import Button from "../../components/Button/Button.jsx";
import TechMarquee from "../../components/TechMarquee/TechMarquee.jsx";
import { profile } from "../../data/profile.js";
import { getFeaturedProject } from "../../utils/projects.js";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [firstName] = profile.name.split(" ");
  const featured = getFeaturedProject();

  return (
    <>
      {/* React 19 moves <title> and <meta> to the document <head> for us. */}
      <title>Niclas Hugdahl – Developer Portfolio</title>
      <meta
        name="description"
        content="Portfolio of Niclas Hugdahl, a junior fullstack software developer in Stockholm."
      />

      {/* On a 4-column grid the tiles fill it like this:
          row 1-2: intro (2x2) | photo (1x2) | now + CV
          row 3-4: featured (2x2) | tech stack | location and languages */}
      <BentoGrid>
        <BentoTile size="large">
          <div className={styles.intro}>
            <h1>Hi, I&apos;m {firstName}</h1>
            <p className={styles.jobTitle}>{profile.title}</p>
            <p className={styles.summary}>{profile.summary}</p>
            <div className={styles.actions}>
              <Button to="/projects">View projects</Button>
              <Button to="/contact" variant="ghost">
                Contact me
              </Button>
            </div>
          </div>
        </BentoTile>

        <BentoTile size="tall">
          <img
            className={styles.photo}
            src={profile.photo}
            alt={profile.photoAlt}
            width="160"
            height="160"
          />
        </BentoTile>

        <BentoTile title="Currently">
          <p className={styles.highlight}>{profile.currently}</p>
        </BentoTile>

        <BentoTile>
          <a className={styles.cvLink} href={profile.cvPath} download>
            <FaDownload className={styles.cvIcon} aria-hidden="true" />
            Download CV
          </a>
        </BentoTile>

        {/* A short teaser, not a full ProjectCard: the card is taller than this
            tile, so it would stretch the grid rows. */}
        <BentoTile title="Featured project" size="large">
          <img
            className={styles.featuredImage}
            src={featured.image}
            alt={featured.imageAlt}
            width="900"
            height="533"
          />
          <div className={styles.featuredFooter}>
            <h3 className={styles.featuredTitle}>{featured.title}</h3>
            <Button to={`/projects/${featured.slug}`} size="small">
              Details{" "}
              <span className="visually-hidden">of {featured.title}</span>
            </Button>
          </div>
        </BentoTile>

        <BentoTile title="Tech stack" size="wide">
          <TechMarquee />
        </BentoTile>

        <BentoTile title="Location & languages" size="wide">
          <p className={styles.highlight}>
            <FaLocationDot className={styles.locationIcon} aria-hidden="true" />
            {profile.location}
          </p>
          <ul className={styles.languages}>
            {profile.languages.map(({ name, level }) => (
              <li key={name}>
                {name} – {level}
              </li>
            ))}
          </ul>
        </BentoTile>
      </BentoGrid>
    </>
  );
}
