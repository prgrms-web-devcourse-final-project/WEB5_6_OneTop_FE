"use client";

import Hero from "./Hero";
import Feature from "./Feature";
import Guide from "./Guide";
import Comparison from "./Comparison";
import PinnedBackground from "./PinnedBackground";
import Footer from "@/share/components/Footer";

const MainContainer = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-80px)] overflow-hidden">
        <Hero />
        <PinnedBackground>
          <Feature />
          <Guide />
        </PinnedBackground>
        <Comparison />
      </div>
      <Footer />
    </>
  );
};
export default MainContainer;
