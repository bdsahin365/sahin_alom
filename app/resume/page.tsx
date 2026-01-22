import Link from "next/link";
import { ArrowLeft, Download, FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeContact from "@/components/ResumeContact";
import SocialIcons from "@/components/SocialIcons";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function ResumePage() {
    const client = createClient();

    // Fetch settings data for Header
    const settings: any = await client.getSingle("settings" as any).catch(() => ({
        data: {
            siteName: "Sahin Alom",
            contactEmail: "hello@sahinalom.com",
            phoneNumber: "+1 234 567 890",
            navigationItems: [
                { label: "Home", link: "/#home" },
                { label: "About", link: "/#about" },
                { label: "Skills", link: "/#skills" },
                { label: "Resume", link: "/resume" },
                { label: "Contact", link: "/#contact" },
            ],
            linkedinUrl: { url: "" },
            behanceUrl: { url: "" },
            dribbbleUrl: { url: "" },
            githubUrl: { url: "" },
            instagramUrl: { url: "" },
            footerText: [{ type: "paragraph", text: "© 2026 Sahin Alom. All rights reserved.", spans: [] }]
        },
    }));

    const socialLinks = {
        linkedinUrl: settings.data.linkedinUrl,
        behanceUrl: settings.data.behanceUrl,
        dribbbleUrl: settings.data.dribbbleUrl,
        githubUrl: settings.data.githubUrl,
        instagramUrl: settings.data.instagramUrl,
    };

    // Fetch resume page data
    const resume = await client.getSingle("resume").catch(() => null);

    return (
        <>
            <Header
                siteName={settings.data.siteName || "Sahin Alom"}
                navigationItems={settings.data.navigationItems || []}
                socialLinks={socialLinks}
            />

            <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-indigo-500/30 pt-24 md:pt-32">
                {/* Aurora Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="aurora-background">
                        <div className="aurora-gradient aurora-gradient-1"></div>
                        <div className="aurora-gradient aurora-gradient-2"></div>
                        <div className="aurora-gradient aurora-gradient-3"></div>
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20">
                    <div className="max-w-6xl mx-auto w-full flex flex-col items-start gap-2 mb-0 md:mb-12 mt-0 md:mt-8 pb-12 border-b border-white/10">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm text-white/80 transition-all hover:pr-6"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-xs font-medium uppercase tracking-wider">Back to Home</span>
                        </Link>

                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Resume
                            </h1>
                            <p className="text-white/50 text-base">Professional Experience & Education</p>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto space-y-24 mb-16 mt-12">
                        {resume ? (
                            <SliceZone slices={resume.data.slices} components={components} />
                        ) : (
                            <div className="text-center py-20 text-white/50">
                                <p>Content is being updated. Please check back soon.</p>
                            </div>
                        )}
                    </div>

                    {/* Download Section - Redesigned */}
                    <div className="max-w-6xl mx-auto mb-20">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-8 md:p-12 text-center">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-white mb-3">Download Resume</h3>
                                <p className="text-white/60 mb-8 max-w-lg mx-auto">Get a copy of my resume in PDF format for offline viewing or printing.</p>

                                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <a
                                        href="/Resume.pdf"
                                        download
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>Download Resume</span>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </a>
                                    <a
                                        href="/MdSahinAlom_CV_BSc_EEE.pdf"
                                        download
                                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium backdrop-blur-sm border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>Download CV</span>
                                    </a>
                                </div>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        </div>
                    </div>
                </div>
                {/* Let's Connect Section */}
                <ResumeContact email={settings.data.contactEmail} phone={settings.data.phoneNumber} socialLinks={socialLinks} />
            </div>

            <Footer footerText={settings.data.footerText} />

            {/* Inject social icons */}
            <SocialIcons socialLinks={socialLinks} targetId="resume-social-icons" />
        </>
    );
}

export async function generateMetadata() {
    const client = createClient();
    const page = await client.getSingle("resume").catch(() => null);

    return {
        title: page?.data?.meta_title || "Resume - Sahin Alom",
        description: page?.data?.meta_description || "Professional Experience, Education, and Skills",
        openGraph: {
            images: [page?.data?.meta_image?.url || ""],
        },
    };
}
