import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { ExternalLink, Award } from "lucide-react";

import { PrismicNextImage } from "@prismicio/next";

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
            className="py-0 md:py-4 relative"
        >
            <div className="container mx-auto px-4 md:px-6">
                {slice.primary.sectionTitle && (
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {slice.primary.sectionTitle}
                        </h2>
                        <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {slice.items.map((item, index) => (
                        <a
                            key={index}
                            href={item.credentialLink || "#"}
                            target={item.credentialLink ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className={`group flex items-start p-3 md:p-5 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-indigo-500/30 transition-all ${!item.credentialLink ? 'pointer-events-none' : ''}`}
                        >
                            <div className={`rounded-lg md:rounded-xl mr-3 md:mr-5 group-hover:scale-110 transition-transform shrink-0 mt-0.5 relative overflow-hidden flex items-center justify-center w-8 h-8 md:w-12 md:h-12 ${item.issuerLogo?.url ? 'bg-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                {item.issuerLogo?.url ? (
                                    <PrismicNextImage
                                        field={item.issuerLogo}
                                        className="w-full h-full object-cover"
                                        fallbackAlt=""
                                    />
                                ) : (
                                    <Award className="w-5 h-5 md:w-6 md:h-6" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors leading-snug mb-1 md:mb-2">
                                    {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-y-1 gap-x-3 items-center text-sm text-white/50">
                                    <span className="font-medium text-white/70">{item.issuer}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            {item.credentialLink && (
                                <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ml-4 self-center text-indigo-400">
                                    <ExternalLink size={18} />
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certification;
