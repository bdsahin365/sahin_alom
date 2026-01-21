import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type SkillsProps = SliceComponentProps<Content.SkillsSlice>;

const Skills = ({ slice }: SkillsProps) => {
    return (
        <section
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="skills-section"
            id="skills"
        >
            <div className="container">
                <div className="skills-header">
                    {isFilled.keyText(slice.primary.sectionTitle) && (
                        <h2 className="skills-title">{slice.primary.sectionTitle}</h2>
                    )}
                    {/* Intro text if present, although model update might take a moment to propagate types, we use generic access if needed */}
                    {isFilled.keyText((slice.primary as any).intro) && (
                        <p className="skills-intro">{(slice.primary as any).intro}</p>
                    )}
                </div>

                <div className="skills-grid">
                    {slice.items && slice.items.map((item, index) => {
                        const skillsList = item.skills ? item.skills.split(',').map(s => s.trim()) : [];

                        return (
                            <div key={index} className="skills-group">
                                <h3 className="skills-group-title">{item.groupTitle}</h3>
                                <div className="skills-tags">
                                    {skillsList.map((skill, i) => (
                                        <span key={i} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;
