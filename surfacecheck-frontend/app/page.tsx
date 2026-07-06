"use client";

import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";

/* ================================================================ */
/*  Types                                                            */
/* ================================================================ */

interface Vulnerability {
  header?: string;
  port?: number;
  service?: string;
  severity: string;
  description: string;
  remediation: string;
}

interface PassedCheck {
  header?: string;
  value?: string;
  port?: number;
  service?: string;
  state?: string;
}

interface ScannerResult {
  scanner: string;
  vulnerabilities: Vulnerability[];
  passed: PassedCheck[];
}

interface ScanResponse {
  findings: ScannerResult[];
}

interface RecentScan {
  url: string;
  score: number;
  timestamp: string;
}

/* ================================================================ */
/*  Sleek Professional SVG Icon Library                              */
/* ================================================================ */

type IconProps = React.SVGProps<SVGSVGElement>;

function ShieldIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function DocumentReportIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function ServerIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008H15v-.008Zm0-6h.008v.008H15v-.008Z" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function InfoCircleIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  );
}

function FunnelIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ArrowUpIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg className={className} {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

/* ── Custom Target Brand SVGs ── */
function VercelLogo() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  );
}

function CloudLogo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

function CreditCardLogo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  );
}

function CodeBracketLogo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  );
}

/* ================================================================ */
/*  Severity Badges                                                  */
/* ================================================================ */

const SEV: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  Critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/40", dot: "bg-red-500", label: "CRITICAL" },
  High: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/40", dot: "bg-orange-400", label: "HIGH" },
  Medium: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/40", dot: "bg-amber-400", label: "MEDIUM" },
  Low: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/40", dot: "bg-blue-400", label: "LOW" },
};

function Badge({ severity }: { severity: string }) {
  const s = SEV[severity] ?? SEV.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border ${s.bg} ${s.text} ${s.border} select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ================================================================ */
/*  Animated Number Counter                                          */
/* ================================================================ */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to === 0) {
      setN(0);
      return;
    }
    let raf: number;
    const dur = 800;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

/* ================================================================ */
/*  Clean & Simple Ambient Background                                */
/* ================================================================ */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030508]" aria-hidden>
      <div
        className="absolute w-[600px] h-[600px] -top-[150px] -left-[100px] rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="absolute w-[550px] h-[550px] top-[30%] -right-[150px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="absolute w-[500px] h-[500px] -bottom-[150px] left-[25%] rounded-full opacity-10 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

/* ================================================================ */
/*  Passed Checks Accordion                                          */
/* ================================================================ */

function PassedSection({ checks }: { checks: PassedCheck[] }) {
  const [open, setOpen] = useState(false);
  if (checks.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer w-full text-left"
      >
        <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
          <svg
            className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
        <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
        <span>{checks.length} Security Check{checks.length !== 1 ? "s" : ""} Passed</span>
        <span className="ml-auto text-[11px] text-slate-400 font-normal">
          {open ? "Hide details" : "View details"}
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-2">
            {checks.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 px-4 py-2.5 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-emerald-200 font-semibold truncate">
                    {c.header ?? `Port ${c.port} (${c.service})`}
                  </span>
                </div>
                {c.value && <span className="text-emerald-400/70 text-[11px] truncate max-w-[240px] ml-auto">{c.value}</span>}
                {c.state && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                    {c.state}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  1-Click Copy Remediation Button                                  */
/* ================================================================ */

function CopyFixButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 transition-all active:scale-95 cursor-pointer ml-auto shrink-0"
      title="Copy developer remediation fix to clipboard"
    >
      {copied ? (
        <>
          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span className="text-emerald-300">COPIED</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          <span>COPY FIX</span>
        </>
      )}
    </button>
  );
}

/* ================================================================ */
/*  Scanner Result Card                                              */
/* ================================================================ */

function ScanCard({ result, idx }: { result: ScannerResult; idx: number }) {
  const v = result.vulnerabilities.length;
  const p = result.passed.length;
  const isHeader = result.scanner.toLowerCase().includes("header");

  return (
    <div className="anim-fade-up" style={{ animationDelay: `${100 + idx * 100}ms` }}>
      <div className="glow-border">
        <div className="glass-card glass-card-hover rounded-[23px] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                {isHeader ? (
                  <ShieldIcon className="w-6 h-6 text-cyan-400" />
                ) : (
                  <ServerIcon className="w-6 h-6 text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{result.scanner}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  {v === 0 ? "No vulnerabilities found" : `${v} issue${v !== 1 ? "s" : ""} require attention`} · {p} passed
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap sm:justify-end">
              {v === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ALL CLEAR
                </span>
              ) : (
                [...new Set(result.vulnerabilities.map(x => x.severity))].map(s => <Badge key={s} severity={s} />)
              )}
            </div>
          </div>

          {v > 0 && (
            <div className="space-y-4">
              {result.vulnerabilities.map((vuln, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-200 hover:border-white/20 hover:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-orange-500 shrink-0" />
                      <span className="font-bold text-base text-white font-mono">
                        {vuln.header ?? `Port ${vuln.port} — ${vuln.service}`}
                      </span>
                    </div>
                    <Badge severity={vuln.severity} />
                  </div>

                  <div className="pl-4 space-y-4">
                    <div className="rounded-xl bg-black/40 border border-white/5 p-4">
                      <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-400 mb-1.5 flex items-center gap-1.5">
                        <InfoCircleIcon className="w-3.5 h-3.5 text-indigo-400" />
                        What This Means
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">{vuln.description}</p>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                            How To Fix It (Developer Remediation)
                          </span>
                        </div>
                        <CopyFixButton text={vuln.remediation} />
                      </div>
                      <p className="text-sm text-cyan-100/90 leading-relaxed font-mono mt-2 bg-black/30 p-3 rounded-lg border border-cyan-500/10">
                        {vuln.remediation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <PassedSection checks={result.passed} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Clean & Elegant Scanning Animation                               */
/* ================================================================ */

function ScanningRadar() {
  const [step, setStep] = useState(0);
  const steps = [
    "Establishing secure TCP handshake with target...",
    "Inspecting HTTP response & security headers...",
    "Probing network ports (FTP, SSH, Telnet, MySQL, RDP)...",
    "Translating security risks into developer plain-English...",
  ];

  useEffect(() => {
    const s = setInterval(() => setStep(p => (p + 1) % steps.length), 2500);
    return () => clearInterval(s);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 anim-scale-in">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-3 rounded-full border border-blue-500/30 animate-pulse" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center shadow-lg">
          <ShieldIcon className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-lg font-bold font-mono text-white tracking-tight">
          Scanning Attack Surface...
        </h3>
        <div className="rounded-xl bg-black/50 border border-white/10 px-4 py-2.5 font-mono text-xs text-cyan-300">
          <p>{steps[step]}</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Help / FAQ Drawer Modal (z-[100] to prevent navbar collision)   */
/* ================================================================ */

function HelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/80 backdrop-blur-md anim-fade-in">
      <div className="w-full max-w-lg h-full bg-slate-950 border-l border-cyan-500/30 p-6 sm:p-10 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-mono font-bold text-white tracking-tight">HOW SURFACECHECK WORKS</h3>
                <p className="text-[11px] font-mono text-slate-400">Security Architecture &amp; Methodology</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 text-sm font-mono text-slate-300 leading-relaxed">
            <div className="rounded-2xl bg-cyan-500/5 border border-cyan-500/20 p-5">
              <div className="flex items-center gap-2.5 font-bold text-cyan-400 mb-2">
                <ShieldIcon className="w-4 h-4" />
                <span>What is this platform?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                SurfaceCheck is an automated attack surface evaluation engine. It probes target web servers for missing HTTP security headers and exposed TCP network services.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-5">
              <div className="flex items-center gap-2.5 font-bold text-blue-400 mb-2">
                <SearchIcon className="w-4 h-4" />
                <span>Why do HTTP Headers matter?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Headers like HSTS, Content Security Policy (CSP), and X-Frame-Options instruct browsers on how to handle data securely, preventing Cross-Site Scripting (XSS), clickjacking, and man-in-the-middle attacks.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-500/5 border border-purple-500/20 p-5">
              <div className="flex items-center gap-2.5 font-bold text-purple-400 mb-2">
                <ServerIcon className="w-4 h-4" />
                <span>Why do TCP Ports matter?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exposed ports like Telnet (23), FTP (21), or MySQL (3306) can allow unauthorized hackers to brute-force or intercept sensitive server telemetry.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5">
              <div className="flex items-center gap-2.5 font-bold text-emerald-400 mb-2">
                <DocumentReportIcon className="w-4 h-4" />
                <span>How to use the PDF Report?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click &quot;Download PDF Report&quot; after any scan to generate an executive-ready audit document to share with your software engineering or DevOps teams.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
        >
          CLOSE GUIDE
        </button>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Main Dashboard Component                                         */
/* ================================================================ */

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScannerResult[] | null>(null);
  const [scannedUrl, setScannedUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("surfacecheck_recents");
    if (saved) {
      try { setRecentScans(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveToRecents = (target: string, sc: number) => {
    const item: RecentScan = { url: target, score: sc, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updated = [item, ...recentScans.filter(r => r.url !== target)].slice(0, 5);
    setRecentScans(updated);
    localStorage.setItem("surfacecheck_recents", JSON.stringify(updated));
  };

  async function executeScan(targetUrl: string) {
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: targetUrl }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.detail ?? `Server responded with status ${res.status}`);
      }
      const data: ScanResponse = await res.json();
      setResults(data.findings);
      setScannedUrl(targetUrl);

      const totV = data.findings.reduce((s, r) => s + r.vulnerabilities.length, 0);
      const totP = data.findings.reduce((s, r) => s + r.passed.length, 0);
      const sc = Math.round((totP / Math.max(totV + totP, 1)) * 100);
      saveToRecents(targetUrl, sc);

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while connecting to the scan server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleScan(e: FormEvent) {
    e.preventDefault();
    await executeScan(url);
  }

  async function handleDownload() {
    if (!results || !scannedUrl) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/v1/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: scannedUrl, findings: results }),
      });
      if (!res.ok) throw new Error(`Report generation failed (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "surfacecheck-security-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF report.");
    } finally {
      setDownloading(false);
    }
  }

  const totalV = results?.reduce((s, r) => s + r.vulnerabilities.length, 0) ?? 0;
  const totalP = results?.reduce((s, r) => s + r.passed.length, 0) ?? 0;
  const score = results ? Math.round((totalP / Math.max(totalV + totalP, 1)) * 100) : 0;

  const filteredResults = results?.map(r => ({
    ...r,
    vulnerabilities: r.vulnerabilities.filter(v => {
      const matchesSev = filterSeverity === "ALL" || 
        (filterSeverity === "CRITICAL_HIGH" && (v.severity === "Critical" || v.severity === "High")) ||
        (filterSeverity === "MEDIUM_LOW" && (v.severity === "Medium" || v.severity === "Low"));
      const matchesSearch = !searchQuery || 
        (v.header ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.service ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.remediation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSev && matchesSearch;
    })
  }));

  const sampleTargets: { label: string; url: string; icon: ReactNode }[] = [
    { label: "Vercel", url: "https://vercel.com", icon: <VercelLogo /> },
    { label: "Cloudflare", url: "https://cloudflare.com", icon: <CloudLogo /> },
    { label: "Stripe", url: "https://stripe.com", icon: <CreditCardLogo /> },
    { label: "GitHub", url: "https://github.com", icon: <CodeBracketLogo /> },
  ];

  return (
    <div className="min-h-screen relative font-sans text-slate-100 bg-[#030508] bg-gradient-to-b from-[#0a0f1d] via-[#030508] to-[#010204] overflow-hidden">
      <AmbientBackground />
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* ── TOP NAVBAR (z-50, clean & simple) ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-5">
          <div className="glass-card rounded-2xl px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                <ShieldIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white font-mono">SurfaceCheck</span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  v1.0.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setHelpOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer"
              >
                <InfoCircleIcon className="w-4 h-4 text-cyan-400" />
                <span>HOW IT WORKS</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-wider uppercase">READY</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (Clean, Simple, Attractive) ── */}
      <header className="relative pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className={`inline-block mb-6 transition-all duration-700 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <div className="px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 flex items-center gap-2 shadow-md">
              <SparklesIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">NEXT-GEN ATTACK SURFACE AUDITING</span>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] transition-all duration-700 delay-100 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-white">Audit Your Security Posture</span>
            <br />
            <span className="text-gradient-cyber">With Intelligent Scans</span>
          </h1>

          <p className={`mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Instantly inspect web targets for missing HTTP security headers and exposed TCP ports.
            Get plain-English explanations, real-time risk grading, and downloadable PDF reports.
          </p>

          {/* ── SCANNER FORM ── */}
          <form onSubmit={handleScan} className={`mt-10 transition-all duration-700 delay-300 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="glow-border max-w-2xl mx-auto">
              <div className="glass-card rounded-[23px] p-2.5 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <SearchIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="target-url-input"
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    required
                    placeholder="https://example.com"
                    className="w-full rounded-xl bg-slate-950/80 border border-white/5 pl-12 pr-4 py-4 text-sm font-mono text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all shadow-inner"
                  />
                </div>
                <button
                  id="run-scan-button"
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl btn-cyber text-sm font-mono cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      SCANNING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShieldIcon className="w-4 h-4" />
                      SCAN TARGET
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* ── 1-CLICK INSTANT SAMPLE TARGETS ── */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Quick Test Targets:
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {sampleTargets.map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => { setUrl(t.url); executeScan(t.url); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span className="text-cyan-400">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── RECENT SCANS STORAGE DRAWER ── */}
          {recentScans.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" /> Recent Audits:
              </span>
              {recentScans.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setUrl(r.url); executeScan(r.url); }}
                  className="px-2.5 py-1 rounded bg-slate-900/80 border border-white/5 hover:border-white/20 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="underline decoration-cyan-500/40">{r.url.replace("https://", "")}</span>
                  <span className={`font-bold ${r.score >= 70 ? "text-emerald-400" : r.score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                    ({r.score}%)
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── MAIN RESULTS AREA ── */}
      <main ref={resultsRef} className="relative z-10 mx-auto max-w-4xl px-6 pb-28">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-950/40 backdrop-blur-md p-6 flex items-start gap-4 shadow-lg anim-scale-in">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <AlertTriangleIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-mono font-bold text-red-300 text-sm uppercase tracking-wider">Scan Error Detected</p>
              <p className="text-sm text-red-200/80 mt-1 leading-relaxed font-mono">{error}</p>
            </div>
          </div>
        )}

        {loading && <ScanningRadar />}

        {results && !loading && (
          <div className="space-y-6">
            {/* Executive Summary Card */}
            <div className="anim-fade-up">
              <div className="glow-border">
                <div className="glass-card rounded-[23px] p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="relative w-20 h-20 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
                          <circle
                            cx="18" cy="18" r="15" fill="none"
                            stroke={score >= 70 ? "#10b981" : score >= 40 ? "#fbbf24" : "#ef4444"}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray={`${score * 0.942} 100`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-xl font-bold font-mono ${score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                            <Counter to={score} />
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">SCORE</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Security Audit Report</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        </div>
                        <p className="text-sm font-mono text-slate-300">
                          Target: <span className="text-white font-bold underline decoration-cyan-500/50 underline-offset-4">{scannedUrl}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-inner">
                          <span className="text-lg font-bold font-mono text-red-400"><Counter to={totalV} /></span>
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-white uppercase">Issues</p>
                          <p className="text-[10px] font-mono text-slate-400">Detected</p>
                        </div>
                      </div>

                      <div className="w-px h-10 bg-white/10 hidden sm:block" />

                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner">
                          <span className="text-lg font-bold font-mono text-emerald-400"><Counter to={totalP} /></span>
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-white uppercase">Passed</p>
                          <p className="text-[10px] font-mono text-slate-400">Checks</p>
                        </div>
                      </div>

                      <button
                        id="download-report-button"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="group flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold hover:border-purple-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md transition-all active:scale-95"
                      >
                        {downloading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin text-purple-300" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            GENERATING PDF...
                          </>
                        ) : (
                          <>
                            <DocumentReportIcon className="w-4 h-4 text-purple-400" />
                            DOWNLOAD PDF REPORT
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PROFESSIONAL RESULTS FILTER & SEARCH BAR ── */}
            <div className="rounded-2xl glass-card p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
                  <FunnelIcon className="w-3.5 h-3.5 text-cyan-400" /> Filter:
                </span>
                {[
                  { id: "ALL", label: `All Findings (${totalV})`, icon: null },
                  { id: "CRITICAL_HIGH", label: "Critical & High", icon: <AlertTriangleIcon className="w-3.5 h-3.5 text-red-400" /> },
                  { id: "MEDIUM_LOW", label: "Medium & Low", icon: <InfoCircleIcon className="w-3.5 h-3.5 text-amber-400" /> },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterSeverity(f.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${filterSeverity === f.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent"}`}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search issues (e.g. 'HSTS', '22')..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-3.5 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
                    ✕
                  </button>
                )}
              </div>
            </div>

            {filteredResults?.map((r, i) => (
              <ScanCard key={i} result={r} idx={i} />
            ))}
          </div>
        )}

        {!loading && !results && !error && (
          <div className="text-center py-28 anim-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card mb-6 shadow-xl border border-white/10">
              <ShieldIcon className="w-8 h-8 text-cyan-400/60" />
            </div>
            <h3 className="text-lg font-mono font-bold text-white tracking-tight">Ready for Security Inspection</h3>
            <p className="text-slate-400 text-sm font-mono mt-2 max-w-sm mx-auto">
              Enter any target web address above or select a Quick Test target to initiate an automated attack surface evaluation.
            </p>
          </div>
        )}
      </main>

      {/* ── STICKY FLOATING QUICK-ACTION BAR ── */}
      {results && !loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 anim-fade-up">
          <div className="glass-card rounded-2xl p-3 border border-cyan-500/40 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-white truncate">{scannedUrl.replace("https://", "")}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${score >= 70 ? "bg-emerald-500/20 text-emerald-300" : score >= 40 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"}`}>
                {score}%
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
              >
                <ArrowUpIcon className="w-3.5 h-3.5" />
                <span>TOP</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs transition-all cursor-pointer shadow-md disabled:opacity-40"
              >
                <DocumentReportIcon className="w-3.5 h-3.5" />
                <span>{downloading ? "PDF..." : "PDF REPORT"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-bold text-slate-400">SurfaceCheck Security Engine</span>
          </div>
          <span>Powered by Nmap TCP Engine &amp; FastAPI · Built with Next.js &amp; Tailwind CSS v4</span>
        </div>
      </footer>
    </div>
  );
}
