import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type HeroProps = SliceComponentProps<any>;

const Hero = ({ slice }: HeroProps) => {
  return (
    <section
      id="home"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="hero-section"
    >
      <div className="aurora-background">
        <div className="aurora-gradient aurora-gradient-1"></div>
        <div className="aurora-gradient aurora-gradient-2"></div>
        <div className="aurora-gradient aurora-gradient-3"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          {isFilled.keyText(slice.primary.eyebrow) && (
            <p className="hero-eyebrow">{slice.primary.eyebrow}</p>
          )}

          {isFilled.keyText(slice.primary.name) && (
            <h1 className="hero-name">{slice.primary.name}</h1>
          )}

          {isFilled.richText(slice.primary.headline) && (
            <div className="hero-headline">
              <PrismicRichText field={slice.primary.headline} />
            </div>
          )}

          {isFilled.richText(slice.primary.description) && (
            <div className="hero-description">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}

          <div className="hero-ctas">
            {isFilled.keyText(slice.primary.primaryCtaLabel) && (
              <a
                href={slice.primary.primaryCtaLink || "#contact"}
                className="btn btn-primary"
              >
                {slice.primary.primaryCtaLabel}
              </a>
            )}

            {isFilled.keyText(slice.primary.secondaryCtaLabel) && (
              <PrismicNextLink
                field={slice.primary.secondaryCtaLink}
                className="btn btn-secondary"
              >
                {slice.primary.secondaryCtaLabel}
              </PrismicNextLink>
            )}
          </div>

          {slice.primary.showSocialIcons && (
            <div className="hero-social" id="hero-social-icons"></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
