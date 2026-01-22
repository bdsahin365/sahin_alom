import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Education`.
 */
export type EducationProps = SliceComponentProps<Content.EducationSlice>;

/**
 * Component for "Education" Slices.
 */
const Education = ({ slice }: EducationProps): JSX.Element => {
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

                <div className="space-y-4 md:space-y-8">
                    {slice.items.map((item, index) => (
                        <div key={index} className="group relative pl-8 border-l border-white/10 hover:border-indigo-500/50 transition-colors">
                            {/* Timeline Dot */}
                            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/20 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors shadow-[0_0_10px_rgba(79,70,229,0)] group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>

                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                        {item.institution}
                                    </h3>
                                    <div className="text-lg text-white/80 font-medium">
                                        {item.degree}
                                    </div>
                                </div>
                                <div className="text-sm text-white/50 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5 self-start whitespace-nowrap">
                                    {item.year}
                                </div>
                            </div>

                            {item.details && (
                                <p className="text-white/60 text-base leading-relaxed max-w-3xl">
                                    {item.details}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
