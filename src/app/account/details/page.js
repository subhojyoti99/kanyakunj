"use client";
import { useState } from "react";
import useAuthStore from "../../../store/authStore";

export default function AccountDetailsPage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/wc/customers?wcId=${user.wcId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim(),
          billing: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            email: form.email.trim(),
          },
        }),
      });

      if (res.ok) {
        setUser({ ...user, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim() });
        setMessage({ type: "success", text: "Account details saved successfully ✓" });
      } else {
        setMessage({ type: "error", text: "Failed to update. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: "var(--maroon)", marginBottom: 8 }}>
        Account Details
      </h2>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginBottom: 32 }}>
        Update your name and email address below.
      </p>

      {/* Phone — read-only identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "var(--ivory-dark)", border: "1px solid var(--border)", borderRadius: 4, marginBottom: 32, maxWidth: 520 }}>
        <span style={{ fontSize: 20 }}>📱</span>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", margin: "0 0 4px" }}>
            Mobile Number (Login)
          </p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: "var(--maroon)", margin: 0, letterSpacing: 1 }}>
            {user?.phone || "—"}
          </p>
        </div>
        <span style={{ marginLeft: "auto", fontFamily: "'Jost', sans-serif", fontSize: 10, color: "var(--gold)", letterSpacing: 1, background: "#fff8e6", padding: "4px 10px", borderRadius: 50, border: "1px solid #f0d060" }}>
          Verified ✓
        </span>
      </div>

      {/* Alert */}
      {message && (
        <div style={{
          background: message.type === "success" ? "#f0faf0" : "#fff0f0",
          border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#ffd0d0"}`,
          borderRadius: 4, padding: "12px 16px", marginBottom: 24, maxWidth: 520,
          fontFamily: "'Jost', sans-serif", fontSize: 13,
          color: message.type === "success" ? "#2d7a2d" : "#c0392b",
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>First Name</label>
            <input style={inputStyle} value={form.firstName} onChange={update("firstName")} required
              onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
              suppressHydrationWarning />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Last Name</label>
            <input style={inputStyle} value={form.lastName} onChange={update("lastName")}
              onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
              suppressHydrationWarning />
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Email Address</label>
          <input style={inputStyle} type="email" value={form.email} onChange={update("email")}
            placeholder="priya@example.com"
            onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
            suppressHydrationWarning />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: "var(--warm-gray)", marginTop: 6 }}>
            Used for order confirmations and receipts.
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ fontSize: 11, letterSpacing: 2, padding: "14px 32px" }}
          disabled={saving}
          suppressHydrationWarning
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontFamily: "'Jost', sans-serif",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--warm-gray)",
  marginBottom: 8,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
  border: "1.5px solid var(--border)",
  borderRadius: 4,
  padding: "12px 14px",
  fontFamily: "'Jost', sans-serif",
  fontSize: 13,
  color: "var(--maroon)",
  outline: "none",
  transition: "border-color 0.2s",
};
