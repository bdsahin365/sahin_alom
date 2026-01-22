
interface ContactSectionProps {
    email: string;
    showGuardian: boolean;
    guardianLabel: string;
    guardianInfo: string;
}

export default function ContactSection({
    email,
    showGuardian,
    guardianLabel,
    guardianInfo,
}: ContactSectionProps) {
    return (
        <section className="print:hidden">
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col items-stretch md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Get in Touch</h2>
                    <p className="text-sm md:text-base text-gray-400">Feel free to reach out for professional inquiries.</p>
                </div>

                <div className="flex flex-col gap-3 w-full md:min-w-[300px] md:w-auto">
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 hover:bg-indigo-700 text-white font-semibold py-4 md:py-3 px-6 rounded-xl md:rounded-lg transition-all active:scale-95 touch-manipulation text-base md:text-sm shadow-lg shadow-indigo-500/20"
                        >
                            Email Me &rarr;
                        </a>
                    )}

                    {showGuardian && guardianInfo && (
                        <div className="text-center p-4 md:p-3 bg-white/5 rounded-xl md:rounded-lg border border-white/10">
                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                                {guardianLabel || "Guardian Contact"}
                            </span>
                            <span className="block text-white font-medium select-all text-sm md:text-base">
                                {guardianInfo}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
