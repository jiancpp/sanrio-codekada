import { useState } from "react";

export default function NudgeButton({ memberName, medName, onNudge }) {
  const [nudged, setNudged] = useState(false);

  const handle = () => {
    setNudged(true);

    if (onNudge) {
      onNudge(memberName, medName);
    }

    setTimeout(() => {
      setNudged(false);
    }, 3000);
  };

  const showMedName = Boolean(medName);

  return (
    <button
      onClick={() => handle()}
      className={`
        flex-shrink-0
        flex items-center gap-1.5
        px-3 py-1
        rounded-full
        text-[11px]
        font-semibold
        border
        transition-all duration-200
        cursor-pointer
        whitespace-nowrap

        ${
          nudged
            ? "bg-olive-light text-olive-dark border-sage"
            : "bg-transparent text-mauve border-[#D8D4C8] hover:border-olive hover:text-olive"
        }
      `}
    >
      <span className="text-sm">
        {nudged ? "✓" : "🔔"}
      </span>

      {nudged ? "Nudged!" : "Nudge"}
    </button>
  );
}