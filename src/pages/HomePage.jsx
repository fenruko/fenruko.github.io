import { Helmet } from "react-helmet";
import Hero from "../components/home/Hero";
import CommandMarquee from "../components/home/CommandMarquee";
import Showcase from "../components/home/Showcase";
import FAQ from "../components/FAQ";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Rift</title>
      </Helmet>
      <Hero />
      <CommandMarquee />
      <Showcase />
      <FAQ />
    </div>
  );
}
