import { Helmet } from "react-helmet";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Helmet>
        <title>Page Not Found - Rift</title>
      </Helmet>
      <p className="cmd mb-3 text-[12px] tracking-[0.2em] text-white/30">404</p>
      <h1 className="mb-8 text-2xl font-semibold text-white">This page does not exist.</h1>
      <Button to="/">Back to Home</Button>
    </div>
  );
}
