
interface PersonalDetailsProps {
    nationality: string;
    location: string;
    languages: string;
    show: boolean;
}

export default function PersonalDetails({
    nationality,
    location,
    languages,
    show,
}: PersonalDetailsProps) {
    if (!show) return null;

    return (
        <section className="mb-12 print:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2 print:text-slate-600">
                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 print:gap-4">
                {nationality && (
                    <div className="flex flex-col p-4 rounded-lg bg-transparent border-none print:border print:border-gray-200 print:p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-slate-600 print:font-semibold">Nationality</span>
                        <span className="text-gray-300 print:text-black font-medium">{nationality}</span>
                    </div>
                )}
                {location && (
                    <div className="flex flex-col p-4 rounded-lg bg-transparent border-none print:border print:border-gray-200 print:p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-slate-600 print:font-semibold">Location</span>
                        <span className="text-gray-300 print:text-black font-medium">{location}</span>
                    </div>
                )}
                {languages && (
                    <div className="flex flex-col p-4 rounded-lg bg-transparent border-none print:border print:border-gray-200 print:p-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-slate-600 print:font-semibold">Languages</span>
                        <span className="text-gray-300 print:text-black font-medium">{languages}</span>
                    </div>
                )}
            </div>
        </section>
    );
}
