"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-white/5 hover:bg-white/10 active:bg-white/10 text-gray-300 rounded-xl md:rounded-full text-base md:text-sm font-medium transition-all hover:text-white border border-white/10 hover:border-indigo-500/50 active:scale-95 touch-manipulation w-full md:w-auto shadow-lg shadow-black/10"
        >
            <Printer size={18} />
            <span>Print / Save as PDF</span>
        </button>
    );
}
