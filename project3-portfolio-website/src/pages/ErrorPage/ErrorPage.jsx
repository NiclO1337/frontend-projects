import { Link } from "react-router";

/** Standalone page for unexpected crashes. It doesn't rely on RootLayout. */
export default function ErrorPage() {
  return (
    <main id="main">
      <title>Something went wrong – Niclas Hugdahl</title>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred.</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}
