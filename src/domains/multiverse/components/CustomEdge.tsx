import { EdgeProps } from "@xyflow/react";

const getCustomCurvedPath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number
) => {
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const curveDepth = Math.min(distance * 0.3, 80);

  const controlPointX = midX - curveDepth;
  return `M ${sourceX},${sourceY} Q ${controlPointX},${midY} ${targetX},${targetY}`;
};

const CustomEdge = ({ sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  return (
    <path
      d={getCustomCurvedPath(sourceX, sourceY, targetX, targetY)}
      fill="none"
      stroke="#ffffff"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

export default CustomEdge;
