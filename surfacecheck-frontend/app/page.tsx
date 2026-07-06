"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";

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

/* ================================================================ */
/*  Severity config                                                  */
/* ================================================================ */

const SEV: Record<string, { bg: string; text: string; ring: string; dot: string; label: string }> = {
  Critical: { bg: "bg-red-500/8",    text: "text-red-400",    ring: "ring-red-500/25",    dot: "bg-red-500",    label: "CRITICAL" },
  High:     { bg: "bg-orange-500/8",  text: "text-orange-400", ring: "ring-orange-500/25", dot: "bg-orange-400", label: "HIGH" },
  Medium:   { bg: "bg-amber-500/8",   text: "text-amber-400",  ring: "ring-amber-500/25",  dot: "bg-amber-400",  label: "MEDIUM" },
  Low:      { bg: "bg-sky-500/8",     text: "text-sky-400",    ring: "ring-sky-500/25",    dot: "bg-sky-400",    label: "LOW" },
};

function Badge({ severity }: { severity: string }) {
  const s = SEV[severity] ?? SEV.Low;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-md text-[10px] font-bold tracking-widest ring-1 ${s.bg} ${s.text} ${s.ring} select-none`}>
      <span className={`w-[5px] h-[5px] rounded-full ${s.dot} animate-pulse`} />
      {s.label}
    </span>
  );
}

/* ================================================================ */
/*  Animated counter                                                 */
/* ================================================================ */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (to === 0) { setN(0); return; }
    let raf: number;
    const dur = 900;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

/* ================================================================ */
/*  Ambient background                                               */
/* ================================================================ */

function Ambient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div className="absolute w-[600px] h-[600px] -top-[200px] left-[5%] rounded-full opacity-100 anim-float"
        style={{ background: "radial-gradient(circle, rgba(110,168,254,0.04), transparent 70%)", animationDuration: "22s" }} />
      <div className="absolute w-[500px] h-[500px] top-[20%] right-[-5%] rounded-full opacity-100 anim-float"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.03), transparent 70%)", animationDelay: "4s", animationDuration: "26s" }} />
      <div className="absolute w-[400px] h-[400px] bottom-[5%] left-[30%] rounded-full opacity-100 anim-float"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.025), transparent 70%)", animationDelay: "8s", animationDuration: "20s" }} />
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(circle, rgba(110,168,254,0.025) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />
    </div>
  );
}

/* ================================================================ */
/*  Passed checks accordion                                          */
/* ================================================================ */

function PassedSection({ checks }: { checks: PassedCheck[] }) {
  const [open, setOpen] = useState(false);
  if (checks.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-white/[0.04]">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2.5 text-[13px] text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer"
      >
        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${open ? "rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="font-semibold">{checks.length} check{checks.length !== 1 ? "s" : ""} passed — looking good!</span>
      </button>

      <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-1.5">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10 px-4 py-2.5 text-[13px] anim-slide-r" style={{ animationDelay: `${i * 50}ms` }}>
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-500/80 shrink-0" />
                <span className="text-emerald-300/90 font-medium">
                  {c.header ?? `Port ${c.port} (${c.service})`}
                </span>
                {c.value && <span className="text-muted/50 font-mono text-[11px] truncate max-w-[280px] ml-auto">{c.value}</span>}
                {c.state && <span className="text-muted/50 text-[10px] ml-auto uppercase tracking-widest font-bold">{c.state}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Scanner result card                                              */
/* ================================================================ */

function ScanCard({ result, idx }: { result: ScannerResult; idx: number }) {
  const v = result.vulnerabilities.length;
  const p = result.passed.length;
  const isHeader = result.scanner.toLowerCase().includes("header");

  return (
    <div className="anim-fade-up" style={{ animationDelay: `${150 + idx * 120}ms` }}>
      <div className="glow-border lift">
        <div className="glass rounded-[19px] p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-accent/15 blur-xl" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/15 flex items-center justify-center">
                  {isHeader ? (
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008H15v-.008Zm0-6h.008v.008H15v-.008Z" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-foreground tracking-tight">{result.scanner}</h3>
                <p className="text-[12px] text-muted mt-0.5">
                  {v === 0 ? "No issues found" : `${v} issue${v !== 1 ? "s" : ""} need attention`} · {p} passed
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {v === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-md text-[10px] font-bold tracking-widest bg-emerald-500/8 text-emerald-400 ring-1 ring-emerald-500/25">
                  <span className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" /> ALL CLEAR
                </span>
              ) : [...new Set(result.vulnerabilities.map(x => x.severity))].map(s => <Badge key={s} severity={s} />)}
            </div>
          </div>

          {/* Vulnerabilities */}
          {v > 0 && (
            <div className="space-y-3">
              {result.vulnerabilities.map((vuln, i) => (
                <div key={i}
                  className="group rounded-2xl border border-white/[0.04] bg-white/[0.015] p-5 transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.07] anim-fade-up"
                  style={{ animationDelay: `${250 + idx * 120 + i * 70}ms` }}
                >
                  {/* Title + badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-[3px] h-5 rounded-full bg-gradient-to-b from-accent/80 to-accent/20 shrink-0" />
                      <span className="font-semibold text-[13px] text-foreground truncate">
                        {vuln.header ?? `Port ${vuln.port} — ${vuln.service}`}
                      </span>
                    </div>
                    <Badge severity={vuln.severity} />
                  </div>

                  {/* What's wrong */}
                  <div className="pl-[18px] space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted/50 mb-1.5">What this means</p>
                      <p className="text-[13px] text-muted leading-[1.7]">{vuln.description}</p>
                    </div>

                    {/* How to fix */}
                    <div className="rounded-xl bg-accent/[0.04] border border-accent/[0.08] px-4 py-3.5 group-hover:bg-accent/[0.06] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent/50 mb-1">How to fix it</p>
                          <p className="text-[12px] text-accent/75 leading-[1.7]">{vuln.remediation}</p>
                        </div>
                      </div>
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
/*  Scanning animation                                               */
/* ================================================================ */

function Scanning() {
  const [dots, setDots] = useState("");
  const [step, setStep] = useState(0);
  const steps = ["Connecting to target", "Checking security headers", "Scanning network ports", "Analyzing results"];

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? "" : p + "."), 350);
    const s = setInterval(() => setStep(p => (p + 1) % steps.length), 2200);
    return () => { clearInterval(d); clearInterval(s); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-10 anim-scale-in">
      {/* Radar */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border border-accent/8" />
        <div className="absolute inset-3 rounded-full border border-accent/12" />
        <div className="absolute inset-6 rounded-full border border-accent/8" />
        <div className="absolute inset-9 rounded-full border border-accent/5" />

        {/* Ping rings */}
        <div className="absolute inset-0 rounded-full border-2 border-accent/15" style={{ animation: "ring-ping 2.2s ease-out infinite" }} />
        <div className="absolute inset-0 rounded-full border-2 border-accent/15" style={{ animation: "ring-ping 2.2s ease-out 0.7s infinite" }} />

        {/* Sweep */}
        <div className="absolute inset-0" style={{ animation: "radar-sweep 2.2s linear infinite" }}>
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left -translate-y-1/2"
            style={{ background: "linear-gradient(90deg, rgba(110,168,254,0.7), transparent)" }} />
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_16px_rgba(110,168,254,0.5)] animate-pulse" />
        </div>

        {/* Blips */}
        <div className="absolute top-[22%] left-[62%] w-[6px] h-[6px] rounded-full bg-accent/50 animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="absolute top-[58%] left-[24%] w-[5px] h-[5px] rounded-full bg-violet-400/40 animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="text-center space-y-3">
        <p className="text-lg font-bold text-foreground tracking-tight">Scanning your website{dots}</p>
        <p className="text-[13px] text-muted h-5 transition-opacity duration-300">{steps[step]}</p>

        {/* Progress bar */}
        <div className="w-52 h-[3px] rounded-full bg-white/[0.04] mx-auto mt-4 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-accent to-violet-400"
            style={{ animation: "progress-indeterminate 1.5s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Main page                                                        */
/* ================================================================ */

export default function HomePage() {
  const [url, setUrl]                       = useState("");
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [results, setResults]               = useState<ScannerResult[] | null>(null);
  const [scannedUrl, setScannedUrl]         = useState("");
  const [downloading, setDownloading]       = useState(false);
  const [mounted, setMounted]               = useState(false);
  const resultsRef                          = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  async function handleScan(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: url }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => null);
        throw new Error(b?.detail ?? `Server responded with ${res.status}`);
      }
      const data: ScanResponse = await res.json();
      setResults(data.findings);
      setScannedUrl(url);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
      if (!res.ok) throw new Error(`Report failed (${res.status})`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "surfacecheck-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download report.");
    } finally {
      setDownloading(false);
    }
  }

  const totalV = results?.reduce((s, r) => s + r.vulnerabilities.length, 0) ?? 0;
  const totalP = results?.reduce((s, r) => s + r.passed.length, 0) ?? 0;
  const score = results ? Math.round((totalP / Math.max(totalV + totalP, 1)) * 100) : 0;

  return (
    <div className="min-h-screen relative">
      <Ambient />

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
        <div className="mx-auto max-w-5xl px-5 pt-4">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-[14px] h-[14px] text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold tracking-tight">SurfaceCheck</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted hidden sm:block">Website Security Scanner</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/8 ring-1 ring-emerald-500/15">
                <span className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-400 tracking-widest">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <header className="relative pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          {/* Shield */}
          <div className={`inline-block mb-8 transition-all duration-1000 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-[22px] bg-accent/12 blur-2xl animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="relative w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-accent/15 via-accent/8 to-violet-500/8 border border-accent/15 flex items-center justify-center anim-float">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.035em] leading-[1.1] transition-all duration-1000 ease-out d-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="text-foreground">Check your website</span>
            <br />
            <span className="bg-gradient-to-r from-accent via-blue-300 to-violet-300 bg-clip-text text-transparent">security in seconds</span>
          </h1>

          <p className={`mt-5 text-[15px] sm:text-base text-muted max-w-lg mx-auto leading-relaxed transition-all duration-1000 ease-out d-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Enter any website address and we&apos;ll check it for common security problems.
            You&apos;ll get clear explanations and step-by-step fixes anyone can understand.
          </p>

          {/* Pills */}
          <div className={`mt-5 flex items-center justify-center gap-2 flex-wrap transition-all duration-1000 ease-out d-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {["Security Headers", "Port Scanning", "PDF Reports", "Plain English"].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-muted/70 bg-white/[0.025] ring-1 ring-white/[0.04]">{f}</span>
            ))}
          </div>

          {/* ── SCAN FORM ──────────────────────────────────────── */}
          <form onSubmit={handleScan} className={`mt-10 transition-all duration-1000 ease-out d-600 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="glow-border max-w-xl mx-auto">
              <div className="glass rounded-[19px] p-2 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full group">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted/40 group-focus-within:text-accent transition-colors duration-300">
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <input id="target-url-input" type="url" value={url} onChange={e => setUrl(e.target.value)} required
                    placeholder="https://example.com"
                    className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3.5 text-[13px] text-foreground placeholder:text-muted/30 outline-none" />
                </div>
                <button id="run-scan-button" type="submit" disabled={loading}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl btn-glow text-[#0a0f1a] font-bold text-[13px] tracking-wide disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 hover:shadow-[0_0_24px_rgba(110,168,254,0.3)] active:scale-[0.97] transition-all">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Scanning…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      Scan Now
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </header>

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main ref={resultsRef} className="relative z-10 mx-auto max-w-3xl px-5 pb-24">
        {/* Error */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/15 bg-red-500/[0.04] backdrop-blur-sm px-5 py-4 flex items-start gap-3 anim-scale-in">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-400 text-[13px]">Something went wrong</p>
              <p className="text-[12px] text-red-400/60 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {loading && <Scanning />}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="anim-fade-up">
              <div className="glow-border">
                <div className="glass rounded-[19px] p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                    <div className="flex items-center gap-5 flex-wrap">
                      {/* Score ring */}
                      <div className="relative w-[60px] h-[60px] shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15" fill="none"
                            stroke={score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171"}
                            strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${score * 0.942} 100`}
                            className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm font-black ${score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                            <Counter to={score} />
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted/50 mb-1">Scan complete</p>
                        <p className="text-[13px] text-muted">
                          <span className="font-mono text-accent/90">{scannedUrl}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Stats */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-500/8 flex items-center justify-center">
                          <span className="text-[15px] font-black text-red-400"><Counter to={totalV} /></span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-foreground leading-none">Issues</p>
                          <p className="text-[9px] text-muted mt-0.5">found</p>
                        </div>
                      </div>

                      <div className="w-px h-8 bg-white/[0.04]" />

                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                          <span className="text-[15px] font-black text-emerald-400"><Counter to={totalP} /></span>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-foreground leading-none">Passed</p>
                          <p className="text-[9px] text-muted mt-0.5">checks</p>
                        </div>
                      </div>

                      <div className="w-px h-8 bg-white/[0.04]" />

                      {/* Download */}
                      <button id="download-report-button" onClick={handleDownload} disabled={downloading}
                        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent/8 text-accent text-[12px] font-bold hover:bg-accent/15 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ring-1 ring-accent/15 hover:ring-accent/30 hover:shadow-[0_0_16px_rgba(110,168,254,0.1)] active:scale-[0.97] transition-all">
                        {downloading ? (
                          <><svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Generating…</>
                        ) : (
                          <><svg className="w-3.5 h-3.5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>PDF Report</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards */}
            {results.map((r, i) => <ScanCard key={i} result={r} idx={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !results && !error && (
          <div className="text-center py-24 anim-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-5">
              <svg className="w-6 h-6 text-muted/30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-muted/40 text-[13px]">Enter a website address above to start your scan</p>
          </div>
        )}
      </main>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.03]">
        <div className="mx-auto max-w-3xl px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted/35">
          <span className="font-medium">SurfaceCheck v1.0</span>
          <span>Powered by Nmap &amp; Python · Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
