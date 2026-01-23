import { PrismicRichText } from "@prismicio/react";
import { Users, HeartHandshake, Sparkles } from "lucide-react";

interface MarriageSectionProps {
    show: boolean;
    fatherName: string;
    fatherProfession: string;
    motherName: string;
    motherProfession: string;
    familyMembers: any[]; // Group field
    partnerPreference: any; // RichTextField
    additionalInfo: any; // RichTextField
}

export default function MarriageSection({
    show,
    fatherName,
    fatherProfession,
    motherName,
    motherProfession,
    familyMembers,
    partnerPreference,
    additionalInfo,
}: MarriageSectionProps) {
    if (!show) return null;

    return (
        <section className="mb-12 border-t border-white/5 pt-12 print:border-gray-200 print:pt-8 print:mb-0">
            <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4 print:text-black print:border-black print:mb-6 hidden">
                Extended Details
            </h2>

            <div className="space-y-6 print:space-y-6">
                {/* Family Information */}
                <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 print:hidden">
                            <Users size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 print:text-black">
                            Family Information
                        </h3>
                    </div>

                    <div className="space-y-4 pl-0 md:pl-[52px]">
                        {/* Parents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Father</span>
                                <span className="block text-gray-200 font-medium">{fatherName}</span>
                                <span className="block text-gray-400 text-sm">{fatherProfession}</span>
                            </div>
                            <div className="bg-white/5 md:bg-transparent rounded-lg p-3 md:p-0">
                                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Mother</span>
                                <span className="block text-gray-200 font-medium">{motherName}</span>
                                <span className="block text-gray-400 text-sm">{motherProfession}</span>
                            </div>
                        </div>

                        {/* Siblings / Members */}
                        {familyMembers && familyMembers.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-3">Family Members</span>
                                <div className="space-y-3">
                                    {familyMembers.map((member, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-sm">
                                            <span className="text-indigo-300 font-medium min-w-[80px]">{member.relation}</span>
                                            <span className="text-gray-300">
                                                {member.name && <span className="text-gray-200 font-medium mr-2">{member.name}</span>}
                                                <span className="text-gray-400">({member.profession})</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Partner Preference */}
                <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 print:hidden">
                            <HeartHandshake size={20} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-pink-400 print:text-black">
                            Partner Preference
                        </h3>
                    </div>
                    <div className="prose prose-invert prose-p:text-gray-300 max-w-none print:prose print:text-black print:prose-p:text-black pl-0 md:pl-[52px]">
                        <PrismicRichText field={partnerPreference} />
                    </div>
                </div>

                {/* Additional Information */}
                {additionalInfo && additionalInfo.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/5 hover:border-white/10 transition-colors print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 print:hidden">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 print:text-black">
                                Additional Information
                            </h3>
                        </div>
                        <div className="prose prose-invert prose-p:text-gray-300 max-w-none print:prose print:text-black print:prose-p:text-black pl-0 md:pl-[52px]">
                            <PrismicRichText field={additionalInfo} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
