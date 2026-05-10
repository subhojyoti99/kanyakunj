"use client";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";

function AddressForm({ title, data, onSave, saving }) {
  const [form, setForm] = useState(data || {});
  const fields = [
    { key: "first_name", label: "First Name", half: true },
    { key: "last_name", label: "Last Name", half: true },
    { key: "address_1", label: "Street Address", half: false },
    { key: "address_2", label: "Apartment, suite, etc. (optional)", half: false },
    { key: "city", label: "City", half: true },
    { key: "state", label: "State", half: true },
    { key: "postcode", label: "Postcode / ZIP", half: true },
    { key: "phone", label: "Phone", half: true },
  ];

  useEffect(() => { setForm(data || {}); }, [data]);

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 4, padding: "28px 28px 20px", marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: "var(--maroon)", marginBottom: 24 }}>{title}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 24 }}>
        {fields.map(f => (
          <div key={f.key} style={{ gridColumn: f.half ? "span 1" : "span 2" }}>
            <label style={{ display: "block", fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--warm-gray)", marginBottom: 6 }}>
              {f.label}
            </label>
            <input
              value={form[f.key] || ""}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1.5px solid var(--border)", borderRadius: 4, padding: "11px 14px", fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--maroon)", outline: "none" }}
              onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
            />
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        style={{ fontSize: 11, letterSpacing: 1.5, padding: "12px 24px" }}
        onClick={() => onSave(form)}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Address"}
      </button>
    </div>
  );
}

export default function AddressesPage() {
  const { user, setUser } = useAuthStore();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!user?.wcId) { setLoading(false); return; }
    fetch(`/api/wc/customers?wcId=${user.wcId}`)
      .then(r => r.json())
      .then(data => setCustomer(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.wcId]);

  const handleSave = async (type, addr) => {
    setSaving(type);
    try {
      const res = await fetch(`/api/wc/customers?wcId=${user.wcId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: addr }),
      });
      if (res.ok) {
        setCustomer(prev => ({ ...prev, [type]: addr }));
        setSaved(type);
        setTimeout(() => setSaved(null), 3000);
      }
    } catch {/* */} finally {
      setSaving(null);
    }
  };

  if (loading) return <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)" }}>Loading addresses…</p>;

  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: "var(--maroon)", marginBottom: 8 }}>
        My Addresses
      </h2>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: "var(--warm-gray)", marginBottom: 32 }}>
        The following addresses will be used on the checkout page by default.
      </p>

      {saved && (
        <div style={{ background: "#f0faf0", border: "1px solid #c3e6cb", borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontFamily: "'Jost', sans-serif", fontSize: 13, color: "#2d7a2d" }}>
          {saved === "billing" ? "Billing" : "Shipping"} address saved successfully ✓
        </div>
      )}

      <AddressForm
        title="Shipping Address"
        data={customer?.shipping}
        onSave={(addr) => handleSave("shipping", addr)}
        saving={saving === "shipping"}
      />
      <AddressForm
        title="Billing Address"
        data={customer?.billing}
        onSave={(addr) => handleSave("billing", addr)}
        saving={saving === "billing"}
      />
    </div>
  );
}
