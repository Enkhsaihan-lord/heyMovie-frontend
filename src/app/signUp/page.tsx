"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    subscription: "NORMAL",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const createUser = async () => {
    setError("");
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      setError("Бүх талбарыг бөглөнө үү");
      return;
    }
    if (userInfo.password !== confirmPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/signUp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            password: userInfo.password,
            role: userInfo.role,
            subscription: userInfo.subscription,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Алдаа гарлаа");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/signIn"), 2000);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
 
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
        .su-root {
          min-height: 100vh;
          background: #020c18;
          display: flex;
          align-items: stretch;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }
 
        /* ── Left decorative panel ── */
        .su-left {
          display: none;
          flex: 1;
          position: relative;
          background: linear-gradient(160deg, #041628 0%, #020c18 100%);
          border-right: 1px solid rgba(6,182,212,0.1);
          overflow: hidden;
        }
        @media (min-width: 860px) { .su-left { display: flex; align-items: center; justify-content: center; } }
 
        .su-left-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
 
        .su-left-content {
          position: relative;
          z-index: 1;
          padding: 48px;
          max-width: 400px;
        }
 
        .su-left-logo {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #22d3ee;
          letter-spacing: -0.04em;
          text-shadow: 0 0 20px rgba(34,211,238,0.4);
          margin-bottom: 56px;
        }
 
        .su-left-heading {
          font-family: 'Syne', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #e0f7ff;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
        }
 
        .su-left-heading span {
          background: linear-gradient(120deg, #22d3ee, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
 
        .su-left-sub {
          font-size: 15px;
          color: #2d6a82;
          line-height: 1.6;
          font-weight: 300;
        }
 
        .su-left-dots {
          display: flex;
          gap: 8px;
          margin-top: 48px;
        }
 
        .su-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(34,211,238,0.2);
        }
        .su-dot.active {
          background: #22d3ee;
          box-shadow: 0 0 8px #22d3ee;
        }
 
        /* ── Right form panel ── */
        .su-right {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background: #020c18;
          position: relative;
        }
        @media (min-width: 860px) {
          .su-right { flex: 0 0 480px; }
        }
 
        .su-right::before {
          content: '';
          position: fixed;
          top: -20%;
          right: -10%;
          width: 50vw; height: 50vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
 
        .su-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }
 
        .su-form-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 360px;
        }
 
        .su-form-header {
          margin-bottom: 36px;
        }
 
        .su-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(6,182,212,0.08);
          border: 1px solid rgba(6,182,212,0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 10px;
          font-weight: 600;
          color: #67e8f9;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
 
        .su-badge::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px #22d3ee, 0 0 16px rgba(34,211,238,0.5);
        }
 
        .su-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #e0f7ff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
 
        .su-form-sub {
          font-size: 13px;
          color: #1e4a5e;
          font-weight: 300;
        }
 
        /* ── Fields stacked full-width ── */
        .su-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
 
        .su-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
 
        .su-label {
          font-size: 11px;
          font-weight: 600;
          color: #2d6a82;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }
 
        /* Input — black text on near-white bg */
        .su-input {
          background: #f0f9ff;
          border: 1.5px solid rgba(6,182,212,0.2);
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 15px;
          color: #000000;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
          height: 52px;
        }
 
        .su-input::placeholder { color: #94a3b8; }
 
        .su-input:focus {
          border-color: #22d3ee;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(34,211,238,0.12), 0 0 20px rgba(34,211,238,0.08);
        }
 
        /* ── Error ── */
        .su-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fca5a5;
          margin-bottom: 16px;
        }
        .su-error::before { content: '⚠'; font-size: 13px; }
 
        /* ── Button row: outline + filled side by side ── */
        .su-btn-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 10px;
          margin-bottom: 20px;
        }
 
        .su-btn-outline {
          padding: 14px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(34,211,238,0.3);
          background: transparent;
          color: #22d3ee;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .su-btn-outline:hover {
          background: rgba(34,211,238,0.06);
          border-color: rgba(34,211,238,0.5);
        }
 
        .su-btn {
          padding: 14px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #0e7490 0%, #06b6d4 100%);
          color: #ffffff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.14s, box-shadow 0.18s;
          box-shadow: 0 4px 20px rgba(6,182,212,0.3);
        }
        .su-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(6,182,212,0.45);
        }
        .su-btn:active:not(:disabled) { transform: translateY(0); }
        .su-btn:disabled { opacity: 0.4; cursor: not-allowed; }
 
        .su-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
 
        .su-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
 
        /* ── Divider ── */
        .su-or {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .su-or-line { flex: 1; height: 1px; background: rgba(6,182,212,0.1); }
        .su-or-text { font-size: 11px; color: #1e4a5e; letter-spacing: 0.06em; }
 
        /* ── Footer ── */
        .su-footer {
          text-align: center;
          font-size: 13px;
          color: #1e4a5e;
        }
        .su-footer a {
          color: #22d3ee;
          text-decoration: none;
          font-weight: 500;
        }
        .su-footer a:hover {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(34,211,238,0.5);
        }
 
        /* ── Success ── */
        .su-success {
          text-align: center;
          padding: 32px 0;
        }
        .su-success-icon {
          font-size: 52px;
          margin-bottom: 14px;
          filter: drop-shadow(0 0 18px rgba(34,211,238,0.7));
        }
        .su-success-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #e0f7ff;
          margin-bottom: 6px;
        }
        .su-success-sub { font-size: 13px; color: #2d6a82; }
      `}</style>

      <div className="su-root">
        <div className="su-grid-bg" />

        {/* Left panel */}
        <div className="su-left">
          <div className="su-left-glow" />
          <div className="su-left-content">
            <div className="su-left-logo">◈ platform</div>
            <h2 className="su-left-heading">
              Start your
              <br />
              <span>journey today</span>
            </h2>
            <p className="su-left-sub">
              Join thousands of users building with our platform. Fast, secure,
              and built for scale.
            </p>
            <div className="su-left-dots">
              <div className="su-dot active" />
              <div className="su-dot" />
              <div className="su-dot" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="su-right">
          <div className="su-form-wrap">
            <div className="su-form-header">
              <div className="su-badge">New Account</div>
              <h1 className="su-form-title">Create your account</h1>
              <p className="su-form-sub">
                Fill in the details below to get started
              </p>
            </div>

            {success ? (
              <div className="su-success">
                <div className="su-success-icon">✦</div>
                <div className="su-success-title">Account created!</div>
                <p className="su-success-sub">Redirecting you to sign in…</p>
              </div>
            ) : (
              <>
                {error && <div className="su-error">{error}</div>}

                <div className="su-fields">
                  <div className="su-field">
                    <label className="su-label">Full Name</label>
                    <input
                      className="su-input"
                      name="name"
                      placeholder="John Doe"
                      value={userInfo.name}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="su-field">
                    <label className="su-label">Email Address</label>
                    <input
                      className="su-input"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={userInfo.email}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="su-field">
                    <label className="su-label">Password</label>
                    <input
                      className="su-input"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={userInfo.password}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="su-field">
                    <label className="su-label">Confirm Password</label>
                    <input
                      className="su-input"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="su-btn-row">
                  <button
                    className="su-btn-outline"
                    onClick={() => (window.location.href = "/signIn")}
                  >
                    Sign in
                  </button>
                  <button
                    className="su-btn"
                    onClick={createUser}
                    disabled={loading}
                  >
                    <span className="su-btn-inner">
                      {loading ? (
                        <>
                          <span className="su-spinner" />
                          Creating…
                        </>
                      ) : (
                        "Create Account →"
                      )}
                    </span>
                  </button>
                </div>

                <div className="su-or">
                  <div className="su-or-line" />
                  <span className="su-or-text">OR</span>
                  <div className="su-or-line" />
                </div>

                <p className="su-footer">
                  Already have an account? <a href="/signIn">Sign in here</a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
