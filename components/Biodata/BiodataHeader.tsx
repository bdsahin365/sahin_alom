import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import { Linkedin, Github, Instagram, Dribbble, Globe } from "lucide-react";

interface BiodataHeaderProps {
    name: string;
    headline: string;
    summary: any; // RichTextField
    profileImage: any; // ImageField
    socialLinks: {
        linkedin?: string;
        behance?: string;
        dribbble?: string;
        github?: string;
        instagram?: string;
    };
}

export default function BiodataHeader({
    name,
    headline,
    summary,
    profileImage,
    socialLinks,
}: BiodataHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-12 border-b border-white/10 print:border-gray-200 print:mb-8 print:pb-8">
            {/* Profile Image */}
            <div className="shrink-0 w-32 h-32 md:w-48 md:h-48 relative rounded-full overflow-hidden bg-white/5 border border-white/10 print:border-gray-200 print:w-32 print:h-32">
                {profileImage?.url ? (
                    <PrismicNextImage
                        field={profileImage}
                        className="w-full h-full object-cover"
                        imgixParams={{ ar: "1:1", fit: "crop" }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 print:text-gray-300">
                        <span className="text-4xl">?</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 print:text-black print:text-3xl">{name}</h1>
                <p className="text-xl text-indigo-400 font-medium mb-6 print:text-slate-700 print:text-lg print:mb-4">{headline}</p>

                <div className="prose prose-invert prose-p:text-gray-400 prose-p:leading-relaxed max-w-2xl mb-6 print:prose print:prose-p:text-black print:max-w-none">
                    <PrismicRichText field={summary} />
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-4 print:gap-2">
                    {socialLinks.linkedin && (
                        <SocialLink href={socialLinks.linkedin} icon={<Linkedin size={18} />} label="LinkedIn" />
                    )}
                    {socialLinks.github && (
                        <SocialLink href={socialLinks.github} icon={<Github size={18} />} label="GitHub" />
                    )}
                    {socialLinks.dribbble && (
                        <SocialLink href={socialLinks.dribbble} icon={<Dribbble size={18} />} label="Dribbble" />
                    )}
                    {socialLinks.instagram && (
                        <SocialLink href={socialLinks.instagram} icon={<Instagram size={18} />} label="Instagram" />
                    )}
                    {socialLinks.behance && (
                        <SocialLink href={socialLinks.behance} icon={<Globe size={18} />} label="Behance" />
                    )}
                </div>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    // Ensure href is a string needed for Link
    if (!href) return null;

    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all text-sm text-gray-300 hover:text-white print:bg-transparent print:border-gray-300 print:text-black print:px-3 print:py-1"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}
