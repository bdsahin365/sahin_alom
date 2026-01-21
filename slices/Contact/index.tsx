"use client";

import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { useState } from "react";

export type ContactProps = SliceComponentProps<any>;

const Contact = ({ slice }: ContactProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        if (!slice.primary.formEndpoint) {
            // Simulator for demo purposes if no endpoint set
            setTimeout(() => {
                setStatus("sent");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 3000);
            }, 1000);
            return;
        }

        try {
            const response = await fetch(slice.primary.formEndpoint, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                setStatus("sent");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                console.error("Form submission failed");
                setStatus("idle");
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setStatus("idle");
            alert("Error sending message.");
        }
    };

    return (
        <section
            id="contact"
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
            className="contact-section"
        >
            <div className="container">
                <div className="contact-grid">
                    {/* Left Column: Info */}
                    <div className="contact-info">
                        {isFilled.keyText(slice.primary.sectionTitle) && (
                            <h2 className="contact-title">{slice.primary.sectionTitle}</h2>
                        )}

                        {isFilled.richText(slice.primary.description) && (
                            <div className="contact-description">
                                <PrismicRichText field={slice.primary.description} />
                            </div>
                        )}

                        {/* Wide Image */}
                        {(isFilled.image(slice.primary.contactImage)) && (
                            <div className="contact-wide-image-wrapper">
                                <PrismicNextImage
                                    field={slice.primary.contactImage}
                                    className="contact-wide-image"
                                    fallbackAlt=""
                                />
                            </div>
                        )}

                        {/* manual contact info */}
                        <div className="contact-card-container">
                            {isFilled.keyText(slice.primary.email) && (
                                <div className="contact-card-row">
                                    <span className="contact-card-label">Email</span>
                                    <a href={`mailto:${slice.primary.email}`} className="contact-card-value">{slice.primary.email}</a>
                                </div>
                            )}
                            <div className="contact-card-row">
                                <span className="contact-card-label">Socials</span>
                                {/* The social icon component injects here via portal/id or we can just leave a placeholder if using the previous method */}
                                <div id="contact-social-icons" className="contact-social-inline"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-form-wrapper">
                        {slice.primary.showContactForm !== false ? (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        id="message"
                                        placeholder="Tell me about your project..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={4}
                                        className="form-input form-textarea"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={status === "sending"}
                                >
                                    {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent!" : "Send Message"}
                                </button>
                            </form>
                        ) : (
                            <div className="contact-placeholder">
                                <p>Form is disabled</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
