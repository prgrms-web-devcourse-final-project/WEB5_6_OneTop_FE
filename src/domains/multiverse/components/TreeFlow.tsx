"use client";

import { ReactFlowProvider } from "@xyflow/react";
import TreeFlowContent from "./TreeFlowContent";
import "@xyflow/react/dist/style.css";

const TreeFlow = () => {
  return (
    <div className="w-full h-screen bg-[linear-gradient(246deg,rgba(217,217,217,0)_41.66%,rgba(130,79,147,0.15)_98.25%)]">
      {/* <ParticleBackground /> */}

      <ReactFlowProvider>
        <TreeFlowContent />
      </ReactFlowProvider>
    </div>
  );
};

export default TreeFlow;
