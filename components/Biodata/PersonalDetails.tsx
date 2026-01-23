import { MapPin, Globe, Languages, Calendar, Heart, Ruler, Droplet, User, Home } from "lucide-react";

interface PersonalDetailsProps {
    nationality: string;
    location: string;
    permanentAddress?: string;
    languages: string;
    religion?: string;
    maritalStatus?: string;
    dateOfBirth?: string | null;
    height?: string;
    bloodGroup?: string;
    show: boolean;
}

export default function PersonalDetails({
    nationality,
    location,
    permanentAddress,
    languages,
    religion,
    maritalStatus,
    dateOfBirth,
    height,
    bloodGroup,
    show,
}: PersonalDetailsProps) {
    if (!show) return null;

    // Calculate age if DOB exists
    let age = "";
    if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        age = Math.abs(age_dt.getUTCFullYear() - 1970).toString();
    }

    const details = [
        { label: "Nationality", value: nationality, icon: Globe },
        { label: "Present Address", value: location, icon: MapPin },
        { label: "Permanent Address", value: permanentAddress, icon: Home },
        { label: "Languages", value: languages, icon: Languages },
        { label: "Religion", value: religion, icon: User }, // Using User as generic for now, or Star/Moon if preferred
        { label: "Marital Status", value: maritalStatus, icon: Heart },
        { label: "Age / DOB", value: dateOfBirth ? `${age} yrs (${dateOfBirth})` : null, icon: Calendar },
        { label: "Height", value: height, icon: Ruler },
        { label: "Blood Group", value: bloodGroup, icon: Droplet },
    ].filter(item => item.value); // Only show items with values

    return (
        <section className="mb-12 print:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2 print:text-slate-600">
                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:gap-4">
                {details.map((item, index) => (
                    <div key={index} className="flex items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors print:border-gray-200 print:bg-transparent print:p-3">
                        <div className="p-2 rounded-lg bg-white/5 text-gray-400 mr-4 print:hidden">
                            <item.icon size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 print:text-slate-600 print:font-semibold">{item.label}</span>
                            <span className="text-gray-200 font-medium print:text-black">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
