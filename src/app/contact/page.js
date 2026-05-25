export const metadata = {
    title: "Contact Us - Kanyakunj",
    description: "Get in touch with Kanyakunj for any queries.",
};

export default function ContactPage() {
    return (
        <div style={{
            backgroundColor: "#fdfcfb",
            backgroundImage: "radial-gradient(#e5e5e5 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            minHeight: "100vh",
            padding: "100px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "60px", position: "relative" }}>
                <h1 className="highlight-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                    Have Any Queries?
                </h1>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "#666", margin: 0 }}>
                    Our experts will clarify your doubts
                </p>
            </div>

            {/* Form */}
            <div style={{ width: "100%", maxWidth: 600, marginBottom: "100px" }}>
                <form>
                    <div style={{ marginBottom: "32px" }}>
                        <input
                            suppressHydrationWarning
                            type="text"
                            placeholder="Your name *"
                            required
                            style={{
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid #b8d0d5",
                                padding: "12px 0",
                                fontFamily: "'Jost', sans-serif",
                                fontSize: 15,
                                color: "#333",
                                outline: "none"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "32px" }}>
                        <input
                            suppressHydrationWarning
                            type="email"
                            placeholder="Your email *"
                            required
                            style={{
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid #b8d0d5",
                                padding: "12px 0",
                                fontFamily: "'Jost', sans-serif",
                                fontSize: 15,
                                color: "#333",
                                outline: "none"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "32px" }}>
                        <input
                            suppressHydrationWarning
                            type="tel"
                            placeholder="Phone *"
                            required
                            style={{
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid #b8d0d5",
                                padding: "12px 0",
                                fontFamily: "'Jost', sans-serif",
                                fontSize: 15,
                                color: "#333",
                                outline: "none"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "40px" }}>
                        <textarea
                            suppressHydrationWarning
                            placeholder="Message"
                            rows={4}
                            style={{
                                width: "100%",
                                background: "transparent",
                                border: "none",
                                borderBottom: "1px solid #b8d0d5",
                                padding: "12px 0",
                                fontFamily: "'Jost', sans-serif",
                                fontSize: 15,
                                color: "#333",
                                outline: "none",
                                resize: "vertical"
                            }}
                        />
                    </div>
                    <button
                        suppressHydrationWarning
                        type="submit"
                        style={{
                            background: "#d8a3a9",
                            color: "#111",
                            border: "none",
                            padding: "12px 32px",
                            fontFamily: "'Jost', sans-serif",
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: "pointer",
                            borderRadius: "2px",
                            transition: "background 0.3s ease"
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Contact Info Footer */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "120px", width: "100%", maxWidth: 800 }}>
                {/* Call Us */}
                <div style={{ textAlign: "center", flex: "1 1 200px" }}>
                    <div style={{ marginBottom: 24, color: "#d8a3a9", display: "flex", justifyContent: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
                            <path d="M14.05 6A5 5 0 0 1 18 10"></path>
                        </svg>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#111", margin: "0 0 16px" }}>Call Us</h3>
                    <div style={{ width: 40, height: 1, background: "#d8a3a9", margin: "0 auto 20px" }} />
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "#111" }}>+91-6290101921</p>
                </div>

                {/* Email Us */}
                <div style={{ textAlign: "center", flex: "1 1 200px" }}>
                    <div style={{ marginBottom: 24, color: "#d8a3a9", display: "flex", justifyContent: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#111", margin: "0 0 16px" }}>Email Us</h3>
                    <div style={{ width: 40, height: 1, background: "#d8a3a9", margin: "0 auto 20px" }} />
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "#111" }}>info@kanyakunj.com</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                input::placeholder, textarea::placeholder {
                    color: #777;
                    font-weight: 400;
                }
                .highlight-heading {
                    position: relative;
                    display: inline-block;
                    z-index: 1;
                }
                .highlight-heading::after {
                    content: '';
                    position: absolute;
                    bottom: 8px;
                    left: 0;
                    right: 0;
                    height: 10px;
                    background: rgba(166, 219, 226, 0.5); /* Light blue highlight */
                    z-index: -1;
                }
                input:focus, textarea:focus {
                    border-bottom: 1px solid #666 !important;
                }
                button:hover {
                    opacity: 0.9;
                }
            `}} />
        </div>
    );
}
