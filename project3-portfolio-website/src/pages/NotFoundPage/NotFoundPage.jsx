import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <>
      <title>Page not found – Niclas Hugdahl</title>
      <meta name="description" content="This page doesn't exist." />
      <h1>404 – Lost in the void</h1>
      <p>This page doesn&apos;t exist.</p>
      <Link to="/">Back to home</Link>
      <Link to="/projects">See my projects</Link>
    </>
  );
}
