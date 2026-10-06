import { useParams } from "react-router";

export default function ProjectDetailPage() {
  // The ":slug" part of the route path ("projects/:slug") ends up here.
  const { slug } = useParams();

  return <h1>Project: {slug}</h1>;
}
