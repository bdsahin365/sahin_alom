
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
            <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
                    <p className="text-gray-400">Feel free to reach out for professional inquiries.</p>
                </div>

                <div className="flex flex-col gap-3 min-w-[300px]">
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Email Me &rarr;
                        </a>
                    )}

                    {showGuardian && guardianInfo && (
                        <div className="text-center mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">
                                {guardianLabel || "Guardian Contact"}
                            </span>
                            <span className="block text-white font-medium select-all">
                                {guardianInfo}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
