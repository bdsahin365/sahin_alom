import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";

/**
 * Props for `Experience`.
 */
export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/**
 * Component for "Experience" Slices.
 */
const Experience = ({ slice }: ExperienceProps) => {
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

                <div className="space-y-12">
                    {slice.items.map((item, index) => (
                        <div key={index} className="group relative pl-10">
                            {/* Vertical Line */}
                            <div className="absolute left-0 top-2 bottom-0 w-[2px] bg-[var(--divider)] group-hover:bg-[var(--accent)] transition-colors duration-500"></div>
                            
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--background)] border-2 border-[var(--divider)] group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-300 shadow-sm"></div>

                            <div className="p-6 rounded-3xl bg-[var(--surface)]/50 border border-[var(--card-border)] hover:border-[var(--accent)]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--accent)]/5">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight leading-tight group-hover:text-[var(--accent)] transition-colors mb-1">
                                            {item.title}
                                        </h3>
                                        <div className="text-lg font-bold text-[var(--text-secondary)]">
                                            {item.company}
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black text-[var(--text-secondary)] tracking-widest uppercase bg-white dark:bg-black/20 px-4 py-2 rounded-full border border-[var(--card-border)] self-start shadow-sm">
                                        {item.duration}
                                    </div>
                                </div>

                                <div className="text-[var(--text-secondary)] mb-6 max-w-3xl prose prose-sm dark:prose-invert font-medium leading-relaxed">
                                    <PrismicRichText field={item.description} />
                                </div>

                                {item.skills && (
                                    <div className="flex flex-wrap gap-2">
                                        {item.skills.split(',').map((skill, i) => (
                                            <span key={i} className="text-[10px] font-bold px-3 py-1 rounded-lg bg-white dark:bg-black/20 border border-[var(--card-border)] text-[var(--text-secondary)] uppercase tracking-wider group-hover:border-[var(--accent)]/30 transition-colors">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
