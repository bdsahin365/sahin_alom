
import { createClient } from "@/prismicio";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BiodataHeader from "@/components/Biodata/BiodataHeader";
import ProfessionalOverview from "@/components/Biodata/ProfessionalOverview";
import PersonalDetails from "@/components/Biodata/PersonalDetails";
import MarriageSection from "@/components/Biodata/MarriageSection";
import ContactSection from "@/components/Biodata/ContactSection";
import PrintButton from "@/components/Biodata/PrintButton";

export async function generateMetadata(): Promise<Metadata> {
    const client = createClient();
    const biodata = await client.getSingle("biodata_page" as any).catch(() => null);

    return {
        title: (biodata?.data as any)?.meta_title || "Sahin Alom - Professional Biodata",
        description: (biodata?.data as any)?.meta_description || "Professional Biodata of Sahin Alom",
        openGraph: {
            images: [(biodata?.data as any)?.meta_image?.url || ""],
        },
    };
}

export default async function BiodataPage() {
    const client = createClient();

    // Fetch data with fallback to mock data if not found (during dev before Prismic sync)
    // Cast to any because the type isn't generated yet
    const biodata = await client.getSingle("biodata_page" as any).catch(() => null);
    const settings = await client.getSingle("settings").catch(() => null);

    // Mock data for development if Prismic doc doesn't exist yet
    const data = (biodata?.data as any) || {
        name: "Sahin Alom",
        professional_headline: "UX Designer with Engineering Systems Thinking",
        summary: [
            { type: "paragraph", text: "I combine design thinking with systems engineering principles to create intuitive, scalable digital experiences. My background in Electrical Engineering allows me to bridge the gap between technical constraints and user needs.", spans: [] }
        ],
        profile_photo: { url: "" }, // Placeholder will be shown
        core_skills: "UX Research, Systems Design, React, Next.js, AI Workflows",
        education: "BSc in Electrical & Electronic Engineering (EEE)",
        work_type: "Freelance / Remote",
        current_focus: "UX Systems, AI-driven Design",
        show_personal_details: true,
        nationality: "Bangladeshi",
        current_location: "Sylhet, Bangladesh",
        languages: "English, Bengali",
        show_marriage_section: true, // Enabled for preview
        religion: "Islam (Sunni)",
        marital_status: "Single",
        date_of_birth: "1998-01-01",
        height: "5' 8\"",
        family_information: [{ type: "paragraph", text: "Father: Retired Govt Officer. Mother: Homemaker. 1 Brother (Engineer), 1 Sister (Doctor).", spans: [] }],
        partner_preference: [{ type: "paragraph", text: "Looking for someone educated, pious, and family-oriented.", spans: [] }],
        blood_group: "B+",
        additional_information: [{ type: "paragraph", text: "Hobbies include photography and traveling.", spans: [] }],
        contact_email: "hello@sahinalom.com",
        show_guardian_contact: false,
        guardian_contact_label: "Father's Mobile",
        guardian_contact_info: "+880 1711 XXXXXX"
    };

    const socialLinks = {
        linkedinUrl: settings?.data?.linkedinUrl || { url: "https://linkedin.com" },
        behanceUrl: settings?.data?.behanceUrl || { url: "https://behance.net" },
        dribbbleUrl: settings?.data?.dribbbleUrl || { url: "https://dribbble.com" },
        githubUrl: settings?.data?.githubUrl || { url: "https://github.com" },
        instagramUrl: settings?.data?.instagramUrl || { url: "https://instagram.com" },
    };

    const navItems = (settings?.data?.navigationItems as any) || [
        { label: "Home", link: "/" },
        { label: "Biodata", link: "/biodata" },
    ];

    return (
        <>
            <div className="print:hidden">
                <Header
                    siteName={settings?.data?.siteName || "Sahin Alom"}
                    navigationItems={navItems}
                    socialLinks={socialLinks as any}
                />
            </div>

            <main className="min-h-screen bg-[#0A0A0A] text-white pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 print:bg-white print:text-black print:pt-0 print:pb-0 print:h-auto print:overflow-visible">
                <div className="max-w-4xl mx-auto bg-[#111111] border border-white/5 rounded-xl md:rounded-2xl p-5 md:p-8 lg:p-12 shadow-2xl print:shadow-none print:border-none print:bg-white print:text-black print:p-0 print:m-0 print:w-full print:max-w-none print:rounded-none">

                    <BiodataHeader
                        name={data.name}
                        headline={data.professional_headline}
                        summary={data.summary}
                        profileImage={data.profile_photo}
                        socialLinks={{
                            linkedin: (socialLinks.linkedinUrl as any)?.url,
                            behance: (socialLinks.behanceUrl as any)?.url,
                            dribbble: (socialLinks.dribbbleUrl as any)?.url,
                            github: (socialLinks.githubUrl as any)?.url,
                            instagram: (socialLinks.instagramUrl as any)?.url,
                        }}
                    />

                    <ProfessionalOverview
                        coreSkills={data.core_skills}
                        education={data.education}
                        workType={data.work_type}
                        currentFocus={data.current_focus}
                    />

                    <PersonalDetails
                        nationality={data.nationality}
                        location={data.current_location}
                        languages={data.languages}
                        show={data.show_personal_details}
                    />

                    <MarriageSection
                        show={data.show_marriage_section}
                        religion={data.religion}
                        maritalStatus={data.marital_status}
                        dateOfBirth={data.date_of_birth}
                        height={data.height}
                        bloodGroup={data.blood_group}
                        familyInfo={data.family_information}
                        partnerPreference={data.partner_preference}
                        additionalInfo={data.additional_information}
                    />



                    <ContactSection
                        email={data.contact_email}
                        showGuardian={data.show_guardian_contact}
                        guardianLabel={data.guardian_contact_label}
                        guardianInfo={data.guardian_contact_info}
                    />

                    <div className="mt-12 text-center print:hidden border-t border-white/5 pt-8">
                        <p className="text-gray-500 mb-4 text-sm">Need a hard copy?</p>
                        <PrintButton />
                    </div>
                </div>
            </main>


            <div className="print:hidden">
                <Footer footerText={settings?.data?.footerText} />
            </div>
        </>
    );
}
