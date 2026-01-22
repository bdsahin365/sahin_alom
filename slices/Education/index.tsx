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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {slice.items.map((item, index) => (
                        <div key={index} className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl hover:bg-zinc-800/50 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white">
                                    {item.institution}
                                </h3>
                                <span className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                                    {item.year}
                                </span>
                            </div>
                            <div className="text-white/80 font-medium mb-3">
                                {item.degree}
                            </div>
                            {item.details && (
                                <p className="text-sm text-white/60 leading-relaxed">
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
