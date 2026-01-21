import { PrismicRichText } from "@prismicio/react";

interface FooterProps {
    footerText: any;
}

export default function Footer({ footerText }: FooterProps) {
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    <PrismicRichText field={footerText} />
                </div>
            </div>
        </footer>
    );
}
