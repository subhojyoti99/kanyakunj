"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../../store/authStore";

// Dynamically import Firebase client-side only
let firebasePhoneAuth = null;

async function getFirebasePhoneAuth() {
  if (firebasePhoneAuth) return firebasePhoneAuth;
  const { auth } = await import("../../../lib/firebase");
  const { RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");
  firebasePhoneAuth = { auth, RecaptchaVerifier, signInWithPhoneNumber };
  return firebasePhoneAuth;
}

/* ─── Step indicator ─────────────────────────────────────────── */
function Steps({ current }) {
  const steps = ["Phone", "OTP", "Profile"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 40 }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "var(--gold)" : active ? "var(--charcoal)" : "transparent",
                border: `2px solid ${done || active ? "transparent" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: done || active ? "#fff" : "var(--warm-gray)",
                fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: active ? "var(--charcoal)" : done ? "var(--gold)" : "var(--warm-gray)" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 48, height: 1, background: i < current ? "var(--gold)" : "var(--border)", margin: "0 8px", marginBottom: 22 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function Header({ label, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
        {label}
      </span>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: "var(--charcoal)", margin: "8px 0 4px", lineHeight: 1.1 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginTop: 8, lineHeight: 1.7 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1.5px solid var(--border)", borderRadius: 4, padding: "13px 14px", fontFamily: "'Jost', sans-serif", fontSize: 14, color: "var(--charcoal)", outline: "none", transition: "border-color 0.2s" }}
      onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
      onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
      suppressHydrationWarning
      {...props}
    />
  );
}

function SubmitBtn({ children, disabled, loading }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="btn-primary"
      style={{ width: "100%", marginTop: 24, fontSize: 11, letterSpacing: 2, padding: "14px", opacity: (disabled || loading) ? 0.6 : 1 }}
      suppressHydrationWarning
    >
      {children}
    </button>
  );
}

function Alert({ type, children }) {
  const styles = {
    error: { bg: "#fff0f0", border: "#ffd0d0", color: "#c0392b" },
    success: { bg: "#f0faf0", border: "#c3e6cb", color: "#2d7a2d" },
  };
  const s = styles[type] || styles.error;
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 4, padding: "12px 16px", marginTop: 16, fontFamily: "'Jost', sans-serif", fontSize: 13, color: s.color, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

/* ─── Main Login Page ─────────────────────────────────────────── */
export default function LoginPage() {
  const [step, setStep] = useState(0); // 0=phone, 1=otp, 2=register
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase state (set after OTP verified)
  const [firebaseData, setFirebaseData] = useState(null); // { uid, idToken, phone }

  // Registration form
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });

  // Firebase refs
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  const { setUser } = useAuthStore();
  const router = useRouter();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── Step 0: Send OTP ─────────────────────────────────────── */
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const phoneE164 = `+91${phone.replace(/\D/g, "")}`;
      const { auth, RecaptchaVerifier, signInWithPhoneNumber } = await getFirebasePhoneAuth();

      // Re-create if previous attempt failed
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => { },
        });
        await recaptchaRef.current.render();
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneE164, recaptchaRef.current);
      confirmationRef.current = confirmation;
      setStep(1);
      setCountdown(30);
    } catch (err) {
      console.error("Send OTP error:", err);
      const msg = err.code === "auth/too-many-requests"
        ? "Too many requests. Please wait a few minutes and try again."
        : err.code === "auth/invalid-phone-number"
          ? "Invalid phone number. Please enter a valid 10-digit number."
          : "Failed to send OTP. Please try again.";
      setError(msg);
      recaptchaRef.current = null; // reset for next attempt
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 1: Verify OTP ───────────────────────────────────── */
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await confirmationRef.current.confirm(otp);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Check if WC customer exists
      const res = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        return;
      }

      if (data.needsRegistration) {
        // New user — go to profile step
        setFirebaseData({ uid: data.uid, idToken, phone: data.phone || `+91${phone}` });
        setStep(2);
      } else {
        // Returning user — log in directly
        setUser(data);
        router.push("/account");
      }
    } catch (err) {
      const msg = err.code === "auth/invalid-verification-code"
        ? "Incorrect OTP. Please check and try again."
        : err.code === "auth/code-expired"
          ? "OTP has expired. Please request a new one."
          : "Verification failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Register ─────────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/firebase-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...firebaseData, ...profile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      setUser(data);
      router.push("/account");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ───────────────────────────────────────────── */
  const resendOTP = () => {
    setStep(0);
    setOtp("");
    setError("");
    confirmationRef.current = null;
  };

  return (
    <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", background: "var(--ivory)" }}>
      {/* Firebase invisible recaptcha mount point */}
      <div id="recaptcha-container" />

      <div style={{ width: "100%", maxWidth: 440 }}>
        <Steps current={step} />

        {/* ── STEP 0: PHONE ── */}
        {step === 0 && (
          <>
            <Header
              label="Kanyakunj"
              title="Sign In"
              subtitle="Enter your mobile number to receive a one-time password"
            />
            <form onSubmit={sendOTP}>
              <Field label="Mobile Number">
                <div style={{ display: "flex", border: "1.5px solid var(--border)", borderRadius: 4, overflow: "hidden", transition: "border-color 0.2s" }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = "var(--gold)"}
                  onBlurCapture={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ padding: "13px 14px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--charcoal)", background: "var(--ivory-dark)", borderRight: "1px solid var(--border)", flexShrink: 0, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    pattern="\d{10}"
                    title="Enter 10-digit mobile number"
                    style={{ flex: 1, border: "none", outline: "none", padding: "13px 14px", fontFamily: "'Jost', sans-serif", fontSize: 16, color: "var(--charcoal)", letterSpacing: 2, background: "transparent" }}
                    suppressHydrationWarning
                  />
                </div>
              </Field>
              <SubmitBtn disabled={phone.length < 10} loading={loading}>
                {loading ? "Sending OTP…" : "Send OTP →"}
              </SubmitBtn>
            </form>
            {error && <Alert type="error">{error}</Alert>}
          </>
        )}

        {/* ── STEP 1: OTP ── */}
        {step === 1 && (
          <>
            <Header
              label="Verification"
              title="Enter OTP"
              subtitle={<>We sent a 6-digit code to <strong style={{ color: "var(--charcoal)" }}>+91 {phone}</strong></>}
            />
            <form onSubmit={verifyOTP}>
              <Field label="One-Time Password">
                <input
                  type="tel"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength={6}
                  required
                  autoFocus
                  style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1.5px solid var(--border)", borderRadius: 4, padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: 28, letterSpacing: 16, textAlign: "center", outline: "none", color: "var(--charcoal)", transition: "border-color 0.2s" }}
                  onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
                  suppressHydrationWarning
                />
              </Field>
              <SubmitBtn disabled={otp.length < 6} loading={loading}>
                {loading ? "Verifying…" : "Verify OTP →"}
              </SubmitBtn>
            </form>

            {error && <Alert type="error">{error}</Alert>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
              <button onClick={resendOTP} style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", fontSize: 11, color: countdown > 0 ? "var(--warm-gray)" : "var(--gold)", cursor: countdown > 0 ? "default" : "pointer", letterSpacing: 0.5 }} disabled={countdown > 0}>
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "← Resend OTP"}
              </button>
              <button onClick={() => { setStep(0); setOtp(""); setError(""); }} style={{ background: "none", border: "none", fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", cursor: "pointer" }}>
                Change number
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: REGISTER ── */}
        {step === 2 && (
          <>
            <Header
              label="Welcome!"
              title="Almost There"
              subtitle="This is your first visit. Please complete your profile."
            />
            <form onSubmit={handleRegister}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="First Name">
                  <Input value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} required placeholder="Priya" />
                </Field>
                <Field label="Last Name">
                  <Input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} placeholder="Sharma" />
                </Field>
              </div>
              <Field label={<>Email <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(optional)</span></>}>
                <Input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="priya@example.com" />
              </Field>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginTop: 12, lineHeight: 1.7 }}>
                By continuing, you agree to our{" "}
                <a href="/terms" style={{ color: "var(--gold)", textDecoration: "none" }}>Terms</a>
                {" & "}
                <a href="/privacy" style={{ color: "var(--gold)", textDecoration: "none" }}>Privacy Policy</a>.
              </p>
              <SubmitBtn disabled={!profile.firstName} loading={loading}>
                {loading ? "Creating account…" : "Complete Registration →"}
              </SubmitBtn>
            </form>
            {error && <Alert type="error">{error}</Alert>}
          </>
        )}
      </div>
    </div>
  );
}
