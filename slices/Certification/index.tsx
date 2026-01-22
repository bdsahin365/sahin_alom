import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ExternalLink, Award } from "lucide-react";

/**
 * Props for `Certification`.
 */
export type CertificationProps = SliceComponentProps<Content.CertificationSlice>;

/**
 * Component for "Certification" Slices.
 */
const Certification = ({ slice }: CertificationProps): JSX.Element => {
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="py-12 relative"
        >
            <div className="container mx-auto px-6">
                {slice.primary.sectionTitle && (
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {slice.primary.sectionTitle}
                        </h2>
                        <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slice.items.map((item, index) => (
                        <a
                            key={index}
                            href={item.credentialLink || "#"}
                            target={item.credentialLink ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className={`group flex items-center p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-indigo-500/30 transition-all ${!item.credentialLink ? 'pointer-events-none' : ''}`}
                        >
                            <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                                <Award size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate group-hover:text-indigo-200 transition-colors">
                                    {item.name}
                                </h3>
                                <div className="flex justify-between items-center text-xs text-white/50 mt-1">
                                    <span>{item.issuer}</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            {item.credentialLink && (
                                <ExternalLink size={14} className="text-white/20 ml-3 group-hover:text-indigo-400 transition-colors" />
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certification;
