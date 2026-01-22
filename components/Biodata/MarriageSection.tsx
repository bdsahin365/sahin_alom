import { PrismicRichText } from "@prismicio/react";

interface MarriageSectionProps {
    show: boolean;
    religion: string;
    maritalStatus: string;
    dateOfBirth: string | null;
    height: string;
    bloodGroup: string;
    familyInfo: any; // RichTextField
    partnerPreference: any; // RichTextField
    additionalInfo: any; // RichTextField
}

export default function MarriageSection({
    show,
    religion,
    maritalStatus,
    dateOfBirth,
    height,
    bloodGroup,
    familyInfo,
    partnerPreference,
    additionalInfo,
}: MarriageSectionProps) {
    if (!show) return null;

    // Calculate age if DOB exists
    let age = "";
    if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        age = Math.abs(age_dt.getUTCFullYear() - 1970).toString();
    }

    return (
        <section className="mb-12 pt-12 border-t border-white/10 print:border-gray-200 print:pt-8 print:mb-0">
            <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4 print:text-black print:border-black print:mb-6">
                Personal Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:gap-x-8 print:gap-y-4">
                <div className="space-y-4">
                    <InfoRow label="Religion" value={religion} />
                    <InfoRow label="Marital Status" value={maritalStatus} />
                    <InfoRow label="Blood Group" value={bloodGroup} />
                </div>
                <div className="space-y-4">
                    <InfoRow label="Height" value={height} />
                    <InfoRow label="Age" value={dateOfBirth ? `${age} years (${dateOfBirth})` : ""} />
                </div>
            </div>

            <div className="space-y-8 print:space-y-6">
                {/* Family Information */}
                <div className="bg-white/5 rounded-xl p-6 md:p-8 print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 print:text-black">
                        Family Information
                    </h3>
                    <div className="prose prose-invert prose-p:text-gray-300 max-w-none print:prose print:text-black print:prose-p:text-black">
                        <PrismicRichText field={familyInfo} />
                    </div>
                </div>

                {/* Partner Preference */}
                <div className="bg-white/5 rounded-xl p-6 md:p-8 print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 print:text-black">
                        Partner Preference
                    </h3>
                    <div className="prose prose-invert prose-p:text-gray-300 max-w-none print:prose print:text-black print:prose-p:text-black">
                        <PrismicRichText field={partnerPreference} />
                    </div>
                </div>

                {/* Additional Information */}
                {additionalInfo && additionalInfo.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-6 md:p-8 print:bg-transparent print:border print:border-gray-200 print:p-6 print:rounded-md">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 print:text-black">
                            Additional Information
                        </h3>
                        <div className="prose prose-invert prose-p:text-gray-300 max-w-none print:prose print:text-black print:prose-p:text-black">
                            <PrismicRichText field={additionalInfo} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    if (!value) return null;
    return (
        <div className="flex border-b border-white/5 pb-2 print:border-gray-200">
            <span className="w-1/3 text-gray-500 text-sm font-medium print:text-slate-600 print:font-semibold">{label}</span>
            <span className="flex-1 text-gray-200 print:text-black">{value}</span>
        </div>
    );
}
