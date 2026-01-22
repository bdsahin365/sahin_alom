
interface ProfessionalOverviewProps {
    coreSkills: string;
    education: string;
    workType: string;
    currentFocus: string;
}

export default function ProfessionalOverview({
    coreSkills,
    education,
    workType,
    currentFocus,
}: ProfessionalOverviewProps) {
    return (
        <section className="mb-12 print:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2 print:text-black">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] print:bg-black print:shadow-none"></span>
                Professional Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
                <OverviewItem label="Core Skills" value={coreSkills} />
                <OverviewItem label="Education" value={education} />
                <OverviewItem label="Work Type" value={workType} />
                <OverviewItem label="Current Focus" value={currentFocus} />
            </div>
        </section>
    );
}

function OverviewItem({ label, value }: { label: string; value: string }) {
    if (!value) return null;
    return (
        <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors print:bg-transparent print:border-gray-200 print:p-3 print:rounded-md">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-slate-600 print:font-semibold">{label}</div>
            <div className="text-base text-gray-200 font-medium print:text-black">{value}</div>
        </div>
    );
}
