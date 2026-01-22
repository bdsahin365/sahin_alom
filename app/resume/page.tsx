import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { createClient } from "@/prismicio";
import Header from "@/components/Header";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function ResumePage() {
    const client = createClient();

    // Fetch settings data for Header
    const settings: any = await client.getSingle("settings" as any).catch(() => ({
        data: {
            siteName: "Sahin Alom",
            contactEmail: "hello@sahinalom.com",
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
        },
    }));

    const socialLinks = {
        linkedinUrl: settings.data.linkedinUrl,
        behanceUrl: settings.data.behanceUrl,
        dribbbleUrl: settings.data.dribbbleUrl,
        githubUrl: settings.data.githubUrl,
        instagramUrl: settings.data.instagramUrl,
    };

    // Mock Resume Data
    const resumeData = {
        slices: [
            {
                slice_type: "experience",
                variation: "default",
                primary: {
                    sectionTitle: "Experience"
                },
                items: [
                    {
                        title: "Lead UX Designer",
                        company: "TechFlow Solutions",
                        duration: "2023 - Present",
                        location: "San Francisco, CA (Remote)",
                        description: [
                            { type: "paragraph", text: "Leading the redesign of the core SaaS platform, improving user retention by 25%. Established a comprehensive design system used across 4 product lines. Mentoring a team of 3 junior designers.", spans: [] }
                        ],
                        skills: "Figma, React, Design Systems, Leadership"
                    },
                    {
                        title: "Senior Product Designer",
                        company: "Innovate Corp",
                        duration: "2021 - 2023",
                        location: "Austin, TX",
                        description: [
                            { type: "paragraph", text: "Spearheaded the mobile app experience for the consumer-facing product. Conducted extensive user research and usability testing iterations. Collaborated closely with engineering to ensure pixel-perfect implementation.", spans: [] }
                        ],
                        skills: "Mobile Design, Prototyping, User Research, Agile"
                    },
                    {
                        title: "UI/UX Designer",
                        company: "Creative Studio",
                        duration: "2019 - 2021",
                        location: "New York, NY",
                        description: [
                            { type: "paragraph", text: "Designed responsive websites and branding for diverse clients. optimized landing pages for conversion, achieving a 15% uplift in signup rates.", spans: [] }
                        ],
                        skills: "Web Design, Branding, HTML/CSS"
                    }
                ]
            },
            {
                slice_type: "education",
                variation: "default",
                primary: {
                    sectionTitle: "Education"
                },
                items: [
                    {
                        degree: "Bachelor of Science in Electrical Engineering",
                        institution: "University of Engineering & Technology",
                        year: "2015 - 2019",
                        details: "Focused on Embedded Systems and Human-Computer Interaction. Capstone project involved designing an accessible interface for smart home devices."
                    }
                ]
            },
            {
                slice_type: "certification",
                variation: "default",
                primary: {
                    sectionTitle: "Certifications"
                },
                items: [
                    {
                        name: "Google UX Design Professional Certificate",
                        issuer: "Coursera",
                        date: "2022",
                        credentialLink: "https://coursera.org"
                    },
                    {
                        name: "Certified ScrumMaster (CSM)",
                        issuer: "Scrum Alliance",
                        date: "2021",
                        credentialLink: "https://scrumalliance.org"
                    },
                    {
                        name: "AWS Certified Cloud Practitioner",
                        issuer: "Amazon Web Services",
                        date: "2023",
                        credentialLink: "https://aws.amazon.com"
                    }
                ]
            }
        ]
    };

    return (
        <>
            <Header
                siteName={settings.data.siteName || "Sahin Alom"}
                navigationItems={settings.data.navigationItems || []}
                socialLinks={socialLinks}
            />

            <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-indigo-500/30 pt-20">
                {/* Aurora Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="aurora-background">
                        <div className="aurora-gradient aurora-gradient-1"></div>
                        <div className="aurora-gradient aurora-gradient-2"></div>
                        <div className="aurora-gradient aurora-gradient-3"></div>
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-6 py-12 md:py-20">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-16">
                        <div className="flex items-center gap-6 w-full lg:w-auto">
                            <Link
                                href="/"
                                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 border border-white/5 group"
                                aria-label="Back to Home"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </Link>
                            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neutral-500 mb-2">
                                    Resume
                                </h1>
                                <p className="text-white/60">Professional Experience & Education</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <a
                                href="/Resume.pdf"
                                download
                                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Download Resume
                            </a>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        <SliceZone slices={resumeData.slices as any} components={components} />
                    </div>
                </div>
            </div>
        </>
    );
}
