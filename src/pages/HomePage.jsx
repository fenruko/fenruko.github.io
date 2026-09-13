import React from "react";
import Hero from "../components/home/Hero";
import FAQ from "../components/FAQ";
import Features from "../components/home/Features";
import CommandShowcase from "../components/home/CommandShowcase";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Helmet>
        <title>Rift</title>
      </Helmet>
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[800px] h-[420px] rounded-full bg-blue-600/[0.08] blur-3xl pointer-events-none" />
      <Hero />
      <Features />
      <CommandShowcase />
      <FAQ />
    </div>
  );
}