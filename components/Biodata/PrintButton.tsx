"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-full text-sm font-medium transition-all hover:text-white border border-white/10 hover:border-indigo-500/50"
        >
            <Printer size={16} />
            <span>Print / Save as PDF</span>
        </button>
    );
}
