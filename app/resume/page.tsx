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

            <div className="min-h-screen relative overflow-hidden bg-[var(--background)] text-[var(--foreground)] pt-24 md:pt-36">
                {/* Re-introduced Aurora Background */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
                    <div className="aurora-background">
                        <div className="aurora-gradient aurora-gradient-1 bg-amber-500/30 blur-[120px]"></div>
                        <div className="aurora-gradient aurora-gradient-2 bg-orange-600/20 blur-[120px]"></div>
                        <div className="aurora-gradient aurora-gradient-3 bg-yellow-400/20 blur-[120px]"></div>
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6">
                    {/* Minimal Header */}
                    <div className="max-w-6xl mx-auto mb-16 md:mb-24">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 mb-8 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>BACK TO HOME</span>
                        </Link>

                        <div className="border-l-8 border-[var(--accent)] pl-8 md:pl-12">
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-[var(--foreground)] mb-4 tracking-tighter uppercase leading-[0.85]">
                                Resume
                            </h1>
                            <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium max-w-3xl leading-relaxed">
                                Professional Experience & Academic Foundation.
                            </p>
                        </div>
                    </div>

                    {/* Slices Grid / Layout */}
                    <div className="max-w-6xl mx-auto space-y-32 mb-32">
                        {resume ? (
                            <SliceZone slices={resume.data.slices} components={components} />
                        ) : (
                            <div className="text-center py-20 text-[var(--text-secondary)]">
                                <p>Content is being updated. Please check back soon.</p>
                            </div>
                        )}
                    </div>

                    {/* Download Section - Redesigned & Vibrant */}
                    <div className="max-w-6xl mx-auto mb-32">
                        <div className="p-8 md:p-20 rounded-[3rem] bg-gradient-to-br from-[var(--surface)] to-[var(--background)] border border-[var(--card-border)] relative overflow-hidden group shadow-2xl">
                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                                <div className="max-w-2xl">
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black tracking-widest uppercase mb-6 border border-[var(--accent)]/20">
                                        RESOURCES
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-6 tracking-tighter leading-none">Need a hard copy?</h3>
                                    <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed font-medium">Download a professional PDF version of my resume or full CV for offline review.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                                    <a
                                        href="/Resume.pdf"
                                        download
                                        className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-black text-sm font-black hover:scale-[1.05] active:scale-[0.98] transition-all shadow-xl shadow-[var(--accent)]/20 uppercase tracking-widest"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>RESUME</span>
                                    </a>
                                    <a
                                        href="/MdSahinAlom_CV_BSc_EEE.pdf"
                                        download
                                        className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-white dark:bg-black/40 border-2 border-[var(--card-border)] text-[var(--foreground)] text-sm font-black hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all shadow-lg uppercase tracking-widest"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>CV</span>
                                    </a>
                                </div>
                            </div>
                            
                            {/* Visual Richness: Decorative Accents */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-[var(--accent)]/20 transition-colors duration-700" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px] -ml-24 -mb-24 group-hover:bg-yellow-400/10 transition-colors duration-700" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
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
