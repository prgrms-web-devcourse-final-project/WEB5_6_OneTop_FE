import { NodeProps, Handle, Position } from "@xyflow/react";
import tw from "@/share/utils/tw";

const CustomNode = ({ data, selected }: NodeProps) => {
  const isSelected = selected || data.isSelected;

  return (
    <div
      className={tw(
        "flex items-center justify-center rounded-full text-center text-sm font-semibold transition-all -translate-x-1/2 -translate-y-1/2",
        isSelected
          ? "w-24 h-24 bg-[#C4DDF4] text-gray-900 shadow-[0_0_12px_rgba(197, 197, 197, 0.16))] scale-110"
          : "w-10 h-10 bg-white text-gray-900 shadow-[0_0_12px_rgba(197, 197, 197, 0.25] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-100"
      )}
      style={{ transformOrigin: "center" }}
    >
      {typeof data.label === "string" ? data.label : ""}
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
