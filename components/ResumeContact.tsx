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
        <section className="py-12 md:py-20 relative border-t border-white/5 mt-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Info */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Connect</h2>

                        <div className="text-white/60 mb-8 max-w-md text-lg leading-relaxed">
                            <p>Have a project or opportunity? I'm always open to discussing new ideas and how we can work together.</p>
                        </div>

                        {/* Contact Info Card */}
                        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                            {email && (
                                <div className="p-6 border-b border-white/10 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail className="w-5 h-5 text-indigo-400" />
                                        <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Email</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <a href={`mailto:${email}`} className="text-lg md:text-2xl text-white hover:text-indigo-400 transition-colors font-medium truncate">
                                            {email}
                                        </a>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={`mailto:${email}`}
                                                className="p-2 rounded-lg bg-white/10 hover:bg-indigo-500 hover:text-white text-white/70 transition-all"
                                                title="Send Email"
                                            >
                                                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {phone && (
                                <div className="p-6 border-b border-white/10 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Phone className="w-5 h-5 text-indigo-400" />
                                        <span className="text-sm font-medium text-white/50 uppercase tracking-wider">Phone</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-lg md:text-2xl text-white font-medium truncate">
                                            {phone}
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                className="p-2 rounded-lg bg-white/10 hover:bg-indigo-500 hover:text-white text-white/70 transition-all"
                                                title="Call"
                                            >
                                                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                                            </a>
                                            <a
                                                href={`https://wa.me/${phone.replace(/\+/g, '').replace(/\s+/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg bg-white/10 hover:bg-green-500 hover:text-white text-white/70 transition-all"
                                                title="WhatsApp"
                                            >
                                                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <span className="text-sm font-medium text-white/50 block mb-4 uppercase tracking-wider">Socials</span>
                                <div id="resume-social-icons" className="flex flex-wrap gap-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-white/70">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-white/70">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-white/70">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Tell me about your project..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={status === "sending"}
                            >
                                {status === "sending" ? (
                                    "Sending..."
                                ) : status === "sent" ? (
                                    "Message Sent!"
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
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
