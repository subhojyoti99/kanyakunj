export const metadata = {
    title: "Size Guide - Kanyakunj",
    description: "Find the perfect fit with our comprehensive size guide for Kurtis and Bottoms.",
};

export default function SizeGuidePage() {
    return (
        <div style={{ background: "var(--ivory)", minHeight: "100vh", padding: "60px 24px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", background: "#fff", padding: "48px", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 500, color: "var(--maroon)", marginBottom: 24, textAlign: "center" }}>
                    Size Chart
                </h1>
                <div style={{ width: 60, height: 2, background: "var(--gold)", margin: "0 auto 40px" }} />

                {/* Kurtis Size Chart Section */}
                <div style={{ marginBottom: "60px" }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--maroon)", marginBottom: 24, textAlign: "center" }}>
                        Kurtis Size Chart
                    </h2>
                    
                    <div style={{ marginBottom: "32px", textAlign: "center" }}>
                        <img 
                            src="https://kanyakunj.com/wp-content/uploads/2025/09/Screenshot-2025-09-06-033114.png" 
                            alt="Kurtis Size Chart" 
                            style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "800px", height: "auto", borderRadius: 4 }} 
                        />
                    </div>

                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "var(--charcoal)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto" }}>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Bust</strong>: Measure around the fullest part of your bust, keeping the tape straight across your back.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Waist</strong>: Measure around the natural waistline, just above the navel.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Hip</strong>: Measure around the fullest part of your hips.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Sleeve Length</strong>: Measure from the shoulder joint down to your wrist or the length you prefer.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Shoulder</strong>: Measure from the edge of one shoulder to the other, across your back.
                        </p>
                    </div>
                </div>

                <div style={{ width: "100%", height: 1, background: "var(--border)", margin: "40px 0" }} />

                {/* Bottom Size Chart Section */}
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--maroon)", marginBottom: 24, textAlign: "center" }}>
                        Bottom Size Chart
                    </h2>

                    <div style={{ marginBottom: "32px", textAlign: "center" }}>
                        <img 
                            src="https://kanyakunj.com/wp-content/uploads/2025/09/Screenshot-2025-09-06-034515.png" 
                            alt="Bottom Size Chart" 
                            style={{ display: "block", margin: "0 auto", width: "100%", maxWidth: "800px", height: "auto", borderRadius: 4 }} 
                        />
                    </div>

                    <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 16, color: "var(--charcoal)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto" }}>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Waist</strong>: Measure around your natural waistline, not too tight.
                        </p>
                        <p style={{ marginBottom: 12 }}>
                            <strong>Hip</strong>: Measure around the fullest part of your hips and rear.
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
