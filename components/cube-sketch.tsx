"use client";

/**
 * 3D Rubik's cube with classic colors and a solving-style rotation animation.
 */
const FACE_SIZE = 56;

const FACE_COLORS = {
  front: "#22c55e",  /* green */
  back: "#3b82f6",   /* blue */
  right: "#ef4444",  /* red */
  left: "#f97316",   /* orange */
  top: "#eab308",    /* yellow */
  bottom: "#f8fafc", /* white */
} as const;

function Face({
  transform,
  fill,
}: {
  transform: string;
  fill: string;
}) {
  return (
    <div
      className="absolute grid grid-cols-3 grid-rows-3 gap-px"
      style={{
        width: FACE_SIZE,
        height: FACE_SIZE,
        transformStyle: "preserve-3d",
        transform,
        backfaceVisibility: "hidden",
        backgroundColor: "rgba(0,0,0,0.15)",
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="border border-neutral-800/80"
          style={{ backgroundColor: fill }}
        />
      ))}
    </div>
  );
}

export function CubeSketch({ className }: { className?: string }) {
  const half = FACE_SIZE / 2;

  return (
    <div
      className={`flex items-center justify-center [perspective:320px] ${className ?? ""}`}
      aria-hidden
    >
      <div
        className="cube-3d relative"
        style={{
          width: FACE_SIZE,
          height: FACE_SIZE,
          transformStyle: "preserve-3d",
        }}
      >
        <Face transform={`translateZ(${half}px)`} fill={FACE_COLORS.front} />
        <Face transform={`rotateY(180deg) translateZ(${half}px)`} fill={FACE_COLORS.back} />
        <Face transform={`rotateY(90deg) translateZ(${half}px)`} fill={FACE_COLORS.right} />
        <Face transform={`rotateY(-90deg) translateZ(${half}px)`} fill={FACE_COLORS.left} />
        <Face transform={`rotateX(-90deg) translateZ(${half}px)`} fill={FACE_COLORS.top} />
        <Face transform={`rotateX(90deg) translateZ(${half}px)`} fill={FACE_COLORS.bottom} />
      </div>
    </div>
  );
}
