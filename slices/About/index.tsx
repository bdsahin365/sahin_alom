import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";

export type AboutProps = SliceComponentProps<any>;

const About = ({ slice }: AboutProps) => {
    return (
        <section
            id="about"
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="about-section-redesign"
        >
            <div className="container">
                <div className="about-split-layout">
                    {/* Left Column: Eyebrow + Headline + Image */}
                    <div className="about-left-col">
                        {isFilled.keyText(slice.primary.sectionTitle) && (
                            <div className="about-eyebrow-line">
                                <span className="about-eyebrow-text">{slice.primary.sectionTitle}</span>
                            </div>
                        )}

                        {isFilled.richText(slice.primary.headline) && (
                            <div className="about-headline">
                                <PrismicRichText field={slice.primary.headline} />
                            </div>
                        )}

                        <div className="about-accent-line"></div>

                        {/* Image under headline */}
                        <div className="about-left-image-container">
                            {isFilled.image(slice.primary.image) && slice.primary.image.url ? (
                                <div className="about-image-wrapper-wide">
                                    {slice.primary.image.url.startsWith('/') ? (
                                        <Image
                                            src={slice.primary.image.url}
                                            alt={slice.primary.image.alt || ""}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="about-image"
                                        />
                                    ) : (
                                        <PrismicNextImage
                                            field={slice.primary.image}
                                            className="about-image"
                                            imgixParams={{ w: 800, h: 400, fit: "crop" }}
                                            fallbackAlt=""
                                        />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Right Column: Descriptions & Features */}
                    <div className="about-right-col">
                        {isFilled.richText(slice.primary.bioTitle) && (
                            <div className="about-description-block">
                                <PrismicRichText field={slice.primary.bioTitle} />
                            </div>
                        )}
                        {isFilled.richText(slice.primary.description) && (
                            <div className="about-description-block">
                                <PrismicRichText field={slice.primary.description} />
                            </div>
                        )}

                        {slice.primary.features && slice.primary.features.length > 0 && (
                            <div className="about-features-grid">
                                {slice.primary.features.map((item: any, index: number) => (
                                    <div key={index} className="about-feature-item">
                                        <h4 className="about-feature-title">{item.title}</h4>
                                        <p className="about-feature-desc">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
