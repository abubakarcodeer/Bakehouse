"use client";

import { useEffect, useState } from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import { isDemoMode } from "../../lib/demo";
import { resetDemoData } from "../../lib/demoStore";

// Floating reminder that local demo mode is on, with a one-click reset of the sample data.
export default function DemoBadge() {
  const [demo, setDemo] = useState(false);
  useEffect(() => setDemo(isDemoMode()), []);
  if (!demo) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full bg-ink/90 py-1.5 pl-3 pr-1.5 text-xs text-white shadow-lg backdrop-blur">
      <FlaskConical size={14} className="text-honey" />
      <span>
        <b>Demo mode</b> · data stays in this browser
      </span>
      <button
        onClick={() => window.confirm("Reset all demo orders, products, bookings and messages?") && resetDemoData()}
        className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-semibold hover:bg-white/20"
      >
        <RotateCcw size={12} /> Reset
      </button>
    </div>
  );
}
