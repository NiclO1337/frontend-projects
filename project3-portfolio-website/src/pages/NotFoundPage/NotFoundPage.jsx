import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <>
      <h1>404 – Lost in the void</h1>
      <p>This page doesn&apos;t exist.</p>
      <Link to="/">Back to home</Link>
      <Link to="/projects">See my projects</Link>
    </>
  );
}
