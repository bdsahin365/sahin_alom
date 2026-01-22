import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { createClient } from "@/prismicio";
import Header from "@/components/Header";
import ResumePDFWrapper from "@/components/ResumePDFWrapper";

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
                    {/* Controls Box */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 lg:mb-12 shadow-2xl">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <Link
                                    href="/"
                                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95 border border-white/5 group"
                                    aria-label="Back to Home"
                                >
                                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </Link>
                                <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Resume
                                </h1>
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
                                <a
                                    href="/MdSahinAlom_CV_BSc_EEE.pdf"
                                    download
                                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium backdrop-blur-sm border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download CV
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* PDF Viewer */}
                    <div className="w-full max-w-5xl mx-auto bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl h-[85vh]">
                        <ResumePDFWrapper file="/Resume.pdf" />
                    </div>
                </div>
            </div>
        </>
    );
}
