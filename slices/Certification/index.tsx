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
const Certification = ({ slice }: CertificationProps) => {
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="py-0 md:py-4 relative"
        >
            <div className="container mx-auto px-4 md:px-6">
                {slice.primary.sectionTitle && (
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight uppercase">
                            {slice.primary.sectionTitle}
                        </h2>
                        <div className="h-1.5 w-12 bg-[var(--accent)] mt-2"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slice.items.map((item, index) => (
                        <a
                            key={index}
                            href={item.credentialLink || "#"}
                            target={item.credentialLink ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className={`group flex items-start p-6 rounded-[2rem] border border-[var(--card-border)] bg-[var(--surface)]/50 hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent)]/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[var(--accent)]/5 ${!item.credentialLink ? 'pointer-events-none' : ''}`}
                        >
                            <div className={`rounded-2xl mr-5 group-hover:scale-110 transition-transform shrink-0 mt-0.5 relative overflow-hidden flex items-center justify-center w-14 h-14 shadow-inner ${item.issuerLogo?.url ? 'bg-white' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
                                {item.issuerLogo?.url ? (
                                    <PrismicNextImage
                                        field={item.issuerLogo}
                                        className="w-full h-full object-cover p-2"
                                        fallbackAlt=""
                                    />
                                ) : (
                                    <Award className="w-6 h-6" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-black text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-none mb-3 tracking-tight">
                                    {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-y-1 gap-x-3 items-center text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.15em]">
                                    <span>{item.issuer}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30"></span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            {item.credentialLink && (
                                <div className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ml-4 self-center text-[var(--accent)]">
                                    <ExternalLink size={20} />
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
