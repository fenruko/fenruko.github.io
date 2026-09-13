import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#08090c] text-center px-4">
      <Helmet>
        <title>Page Not Found - Rift</title>
      </Helmet>
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-white/40 mb-8">This page doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-[#5865f2] hover:bg-[#5865f2]/70 text-white text-[16px] font-medium transition-colors duration-150"
      >
        Back to Home
      </Link>
    </div>
  );
}
