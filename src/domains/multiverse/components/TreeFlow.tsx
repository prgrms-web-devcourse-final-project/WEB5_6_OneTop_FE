"use client";

import { ReactFlowProvider } from "@xyflow/react";
import TreeFlowContent from "./TreeFlowContent";
import "@xyflow/react/dist/style.css";
import ParticleBackground from "./ParticleBackground";
interface TreeFlowProps {
  baselineId: number;
}
const TreeFlow = ({ baselineId }: TreeFlowProps) => {
  return (
    <div
      className="relative w-full h-screen"
      style={{
        background: "linear-gradient(270deg, #0F1A2B 0%, #111 100%)",
      }}
    >
      <ParticleBackground />

      <ReactFlowProvider>
        <TreeFlowContent baselineId={baselineId} />
      </ReactFlowProvider>
    </div>
  );
};

export default TreeFlow;
