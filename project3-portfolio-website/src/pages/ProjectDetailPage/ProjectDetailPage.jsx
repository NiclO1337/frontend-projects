import { useParams } from "react-router";

export default function ProjectDetailPage() {
  // The ":slug" part of the route path ("projects/:slug") ends up here.
  const { slug } = useParams();

  return (
    <>
      {/* A template literal gives <title> one string child, as React expects. */}
      <title>{`Project: ${slug} – Niclas Hugdahl`}</title>
      <meta
        name="description"
        content="Details about a project by Niclas Hugdahl."
      />
      <h1>Project: {slug}</h1>
    </>
  );
}
