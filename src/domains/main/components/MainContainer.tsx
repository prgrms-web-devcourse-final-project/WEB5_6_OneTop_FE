"use client";

import Hero from "./Hero";
import Feature from "./Feature";
import Guide from "./Guide";
import Comparison from "./Comparison";
import PinnedBackground from "./PinnedBackground";

const MainContainer = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden">
      <Hero />
      <PinnedBackground>
        <Feature />
        <Guide />
      </PinnedBackground>
      <Comparison />
    </div>
  );
};
export default MainContainer;
