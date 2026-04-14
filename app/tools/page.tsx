import { createClient } from "@/prismicio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ElectricalToolsApp from "@/components/Tools/ElectricalToolsApp";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "BNBC Electrical Pro Tools - Sahin Alom",
    description: "Interactive tools and calculators for electrical engineers, featuring load calculation, voltage drop, substation sizing, and power factor correction.",
};

export default async function ToolsPage() {
    const client = createClient();

    // Fetch settings for header
    const settings: any = await client.getSingle("settings" as any).catch(() => ({
        data: {
            siteName: "Sahin Alom",
            navigationItems: [
                { label: "Home", link: "/" },
                { label: "About", link: "/#about" },
                { label: "Tools", link: "/tools" },
                { label: "Blog", link: "/blog" },
            ],
            linkedinUrl: { url: "" },
            behanceUrl: { url: "" },
            dribbbleUrl: { url: "" },
            githubUrl: { url: "" },
            instagramUrl: { url: "" },
            footerText: [{ type: "paragraph", text: "© 2026 Sahin Alom. All rights reserved.", spans: [] }],
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
        <div className="min-h-screen bg-[#0A0A0A]">
            <Header
                siteName={settings.data.siteName || "Sahin Alom"}
                navigationItems={settings.data.navigationItems || []}
                socialLinks={socialLinks}
            />

            <ElectricalToolsApp />

            <div className="hidden md:block">
                <Footer footerText={settings.data.footerText} />
            </div>
        </div>
    );
}
