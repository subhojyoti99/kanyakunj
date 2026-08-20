"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../../store/authStore";
import Link from "next/link";

const sidebarLinks = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Account Details", href: "/account/details" },
  { label: "Log Out", href: null, isLogout: true },
];

export default function AccountLayout({ children }) {
  const { user, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect after Zustand has finished reading from localStorage
    if (!_hasHydrated) return;
    if (!user && pathname !== "/account/login") {
      router.push("/account/login");
    }
  }, [_hasHydrated, user, pathname, router]);

  // Login page always renders without sidebar
  if (pathname === "/account/login") return <>{children}</>;

  // While localStorage is being read, render nothing (no flash, no redirect)
  if (!_hasHydrated) return null;

  // After hydration, not logged in → redirect is already queued above
  if (!user) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px", minHeight: "70vh" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 48, borderBottom: "1px solid var(--border)", paddingBottom: 24 }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: 8 }}>
          My Account
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 500, color: "var(--maroon)", margin: 0 }}>
          Hello, {user.firstName}
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 48, alignItems: "start" }}>
        {/* Sidebar */}
        <aside>
          <nav>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {sidebarLinks.map((link) => {
                const isActive = !link.isLogout && pathname === link.href;
                if (link.isLogout) {
                  return (
                    <li key="logout" style={{ borderTop: "1px solid var(--border)", marginTop: 16, paddingTop: 16 }}>
                      <button
                        onClick={() => { logout(); router.push("/"); }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 400,
                          letterSpacing: 1, color: "var(--warm-gray)", textAlign: "left",
                          width: "100%", padding: "8px 0", transition: "color 0.2s",
                        }}
                      >
                        Log Out
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={link.href} style={{ borderBottom: "1px solid var(--border)" }}>
                    <Link
                      href={link.href}
                      style={{
                        display: "block",
                        padding: "14px 0",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 13,
                        fontWeight: isActive ? 500 : 300,
                        color: isActive ? "var(--gold)" : "var(--maroon)",
                        textDecoration: "none",
                        letterSpacing: 0.5,
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
