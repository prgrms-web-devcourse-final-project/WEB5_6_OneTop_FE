import { NodeProps, Handle, Position } from "@xyflow/react";
import tw from "@/share/utils/tw";

const CustomNode = ({ data, selected }: NodeProps) => {
  if (!data || typeof data.ageYear !== "number") {
    return;
  }
  return (
    <div
      className={tw(
        "flex items-center justify-center rounded-full text-center text-sm font-semibold transition-all -translate-x-1/2 -translate-y-1/2",
        selected
          ? "w-24 h-24 bg-[#C4DDF4] text-gray-900 scale-110 shadow-[0_0_20px_rgba(196,221,244,0.8)] hover:shadow-[0_0_30px_rgba(196,221,244,1)]"
          : "w-10 h-10 bg-white text-gray-900 scale-100 shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
      )}
      style={{ transformOrigin: "center" }}
    >
      {data.ageYear}
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        id="left"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        id="right"
      />
    </div>
  );
};

export default CustomNode;
