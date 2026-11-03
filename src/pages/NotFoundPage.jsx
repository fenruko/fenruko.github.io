import { Link } from "react-router-dom";
import useTitle from "../useTitle";

export default function NotFoundPage() {
  useTitle("Page Not Found - Rift");

  return (
    <section className="page notfound">
      <div className="wrap narrow">
        <p className="eyebrow">404</p>
        <h1 className="h2">This page does not exist.</h1>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
