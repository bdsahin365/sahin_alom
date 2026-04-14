"use client";

import { PrismicNextImage } from "@prismicio/next";
import { useState } from "react";
import { Send, Mail, Phone, MessageCircle } from "lucide-react";

interface ResumeContactProps {
    email: string;
    phone?: string;
    socialLinks: any;
}

export default function ResumeContact({ email, phone, socialLinks }: ResumeContactProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        // Simulator for demo purposes
        setTimeout(() => {
            setStatus("sent");
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setStatus("idle"), 3000);
        }, 1000);
    };

    return (
        <section className="py-12 md:py-20 relative border-t-2 border-[var(--divider)] mt-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Info */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Let's Connect</h2>

                        <div className="text-text-secondary mb-8 max-w-md text-lg leading-relaxed">
                            <p>Have a project or opportunity? I'm always open to discussing new ideas and how we can work together.</p>
                        </div>

                        {/* Contact Info Card */}
                        <div className="rounded-3xl bg-card-bg border-2 border-[var(--divider)] overflow-hidden shadow-lg">
                            {email && (
                                <div className="p-6 border-b-2 border-[var(--divider)] hover:bg-[var(--card-hover-bg)] transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail className="w-5 h-5 text-[var(--accent)]" />
                                        <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Email</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <a href={`mailto:${email}`} className="text-xl md:text-2xl text-[var(--foreground)] hover:text-[var(--accent)] transition-colors font-black truncate tracking-tight">
                                            {email}
                                        </a>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={`mailto:${email}`}
                                                className="p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-secondary)] transition-all shadow-sm"
                                                title="Send Email"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {phone && (
                                <div className="p-6 border-b-2 border-[var(--divider)] hover:bg-[var(--card-hover-bg)] transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Phone className="w-5 h-5 text-[var(--accent)]" />
                                        <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Phone</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-xl md:text-2xl text-[var(--foreground)] font-black truncate tracking-tight">
                                            {phone}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                className="p-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-secondary)] transition-all shadow-sm"
                                                title="Call"
                                            >
                                                <Phone className="w-5 h-5" />
                                            </a>
                                            <a
                                                href={`https://wa.me/${phone.replace(/\+/g, '').replace(/\s+/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 rounded-xl bg-[var(--surface)] hover:bg-green-500 hover:text-white text-[var(--text-secondary)] transition-all shadow-sm"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <span className="text-xs font-black text-[var(--text-secondary)] block mb-4 uppercase tracking-widest">Connect Digitally</span>
                                <div id="resume-social-icons" className="flex flex-wrap gap-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-[var(--surface)] border-2 border-[var(--divider)] rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-black/5">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <label htmlFor="name" className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Your Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Sahin Alom"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--accent)] transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="email" className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="hello@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-5 py-4 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--accent)] transition-all font-bold"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="message" className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Tell me about your project or opportunity..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full px-5 py-4 rounded-xl bg-[var(--background)] border-2 border-[var(--divider)] text-[var(--foreground)] placeholder:text-[var(--text-secondary)]/30 focus:outline-none focus:border-[var(--accent)] transition-all font-bold resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-black transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-xl shadow-[var(--accent)]/30 active:scale-[0.98]"
                                disabled={status === "sending"}
                            >
                                {status === "sending" ? (
                                    "Dispatching..."
                                ) : status === "sent" ? (
                                    "Sent Successfully"
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
