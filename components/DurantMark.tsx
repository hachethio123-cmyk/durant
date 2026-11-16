"use client";

import { useState } from "react";

export default function DurantMark() {
  const [energized, setEnergized] = useState(false);

  return (
    <button
      type="button"
      aria-label="DURANT interactive logo"
      aria-pressed={energized}
      title="DURANT"
      onClick={() => setEnergized((value) => !value)}
      className={`durant-mark ${energized ? "is-energized" : ""}`}
    >
      <span className="durant-mark-letter">D</span>
      <span className="durant-mark-ring" aria-hidden="true" />
      <span className="durant-mark-spark" aria-hidden="true">✦</span>
    </button>
  );
}