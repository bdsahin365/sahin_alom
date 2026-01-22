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
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 inline-block">
                            {slice.primary.sectionTitle}
                        </h2>
                    </div>
                )}

                <div className="space-y-4 md:space-y-8">
                    {slice.items.map((item, index) => (
                        <div key={index} className="group relative pl-8 border-l border-white/10 hover:border-indigo-500/50 transition-colors">
                            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/20 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors shadow-[0_0_10px_rgba(79,70,229,0)] group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>

                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="text-lg text-white/80 font-medium">
                                        {item.company}
                                    </div>
                                </div>
                                <div className="text-sm text-white/50 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5 self-start">
                                    {item.duration}
                                </div>
                            </div>

                            <div className="text-white/60 mb-6 max-w-3xl prose prose-invert prose-sm">
                                <PrismicRichText field={item.description} />
                            </div>

                            {item.skills && (
                                <div className="flex flex-wrap gap-2">
                                    {item.skills.split(',').map((skill, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
