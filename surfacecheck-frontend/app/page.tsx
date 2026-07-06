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

interface RecentScan {
  url: string;
  score: number;
  timestamp: string;
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-extrabold tracking-widest border ${s.bg} ${s.text} ${s.border} shadow-[0_0_12px_rgba(0,0,0,0.3)] select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
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
    const dur = 1000;
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
/*  Techie Signal Waveform Widget                                    */
/* ================================================================ */

function SignalWaveform() {
  return (
    <div className="flex items-end gap-1 h-5 px-2 py-1 rounded bg-slate-950/80 border border-cyan-500/20 shadow-inner">
      <span className="w-1 bg-cyan-400 rounded-full anim-wave-1 shadow-[0_0_8px_#00f0ff]" />
      <span className="w-1 bg-blue-500 rounded-full anim-wave-2 shadow-[0_0_8px_#3b82f6]" />
      <span className="w-1 bg-purple-500 rounded-full anim-wave-3 shadow-[0_0_8px_#8b5cf6]" />
      <span className="w-1 bg-cyan-400 rounded-full anim-wave-1 shadow-[0_0_8px_#00f0ff]" />
    </div>
  );
}

/* ================================================================ */
/*  Live Cyber Telemetry Terminal                                    */
/* ================================================================ */

function CyberTelemetryConsole() {
  const logs = [
    "[SYS_AUDIT] TCP SYN port scanning engine initialized... [OK]",
    "[AI_HEURISTICS] Security headers analysis engine online... [READY]",
    "[SSL_INSPECT] Transport Layer Security cipher suites... [VERIFIED]",
    "[THREAT_INTEL] CVE vulnerability database synced... [140,291 RECORDS]",
    "[NET_MONITOR] Anomaly detection heuristics... [ACTIVE]",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setIndex(p => (p + 1) % logs.length), 3000);
    return () => clearInterval(i);
  }, [logs.length]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 rounded-xl bg-slate-950/90 border border-cyan-500/30 p-3.5 shadow-[0_0_25px_rgba(0,240,255,0.1)] font-mono text-xs flex items-center justify-between gap-3 overflow-hidden">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>
        <span className="text-slate-500 text-[10px] hidden sm:inline">SOC_CONSOLE // LIVE</span>
      </div>
      <div className="text-cyan-300/90 truncate flex-1 font-semibold text-right sm:text-left flex items-center gap-2">
        <span className="text-cyan-500">&gt;</span>
        <span className="truncate">{logs[index]}</span>
        <span className="w-1.5 h-3 bg-cyan-400 animate-pulse inline-block" />
      </div>
      <SignalWaveform />
    </div>
  );
}

/* ================================================================ */
/*  High-Tech Cyber Metrics Bar                                      */
/* ================================================================ */

function CyberMetricsBar() {
  const metrics = [
    { label: "SCAN VELOCITY", val: "<150ms", color: "text-cyan-400" },
    { label: "TCP ENGINE", val: "NMAP 7.94", color: "text-blue-400" },
    { label: "VULN DATABASE", val: "140,000+ CVEs", color: "text-purple-400" },
    { label: "HEURISTICS", val: "AI-ENHANCED", color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-10">
      {metrics.map((m, i) => (
        <div key={i} className="rounded-xl bg-slate-950/60 border border-white/10 p-3 flex flex-col items-center justify-center text-center shadow-inner hover:border-cyan-500/30 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {m.label}
          </span>
          <span className={`text-sm font-mono font-black mt-1 ${m.color}`}>{m.val}</span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================ */
/*  Ambient Cyber Background with Laser Scanline                     */
/* ================================================================ */

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030508]" aria-hidden>
      <div
        className="absolute w-[600px] h-[600px] -top-[150px] -left-[100px] rounded-full opacity-20 anim-float-slow blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)" }}
      />
      <div
        className="absolute w-[550px] h-[550px] top-[30%] -right-[150px] rounded-full opacity-25 anim-float blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="absolute w-[500px] h-[500px] -bottom-[150px] left-[25%] rounded-full opacity-15 anim-float-slow blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)", animationDelay: "6s" }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,240,255,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] opacity-40 anim-scanline" />

      <div className="absolute top-24 left-8 text-cyan-500/30 font-mono text-xs hidden lg:block">
        [+001.294.59] // TARGET_AUDIT_READY
      </div>
      <div className="absolute bottom-12 right-8 text-purple-500/30 font-mono text-xs hidden lg:block">
        [SYS_MONITOR_ACTIVE] // V.1.0.0
      </div>
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
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>{checks.length} Security Check{checks.length !== 1 ? "s" : ""} Passed</span>
        <span className="ml-auto text-[10px] text-emerald-500/60 font-normal uppercase tracking-wider">
          {open ? "[ - HIDE TELEMETRY ]" : "[ + VIEW TELEMETRY ]"}
        </span>
      </button>

      <div className={`grid transition-all duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="space-y-2">
            {checks.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 px-4 py-2.5 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
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
          <svg className="w-3.5 h-3.5 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-emerald-300">COPIED!</span>
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
    <div className="anim-fade-up" style={{ animationDelay: `${150 + idx * 150}ms` }}>
      <div className="glow-border">
        <div className="glass-card glass-card-hover rounded-[23px] p-6 sm:p-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 opacity-25 blur-lg" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 flex items-center justify-center shadow-inner">
                  {isHeader ? (
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008H15v-.008Zm0-6h.008v.008H15v-.008Z" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white tracking-tight anim-glitch">{result.scanner}</h3>
                  <SignalWaveform />
                </div>
                <p className="text-xs font-mono text-indigo-300/70 mt-1">
                  {v === 0 ? "No vulnerabilities found" : `${v} issue${v !== 1 ? "s" : ""} require attention`} · {p} passed
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap sm:justify-end">
              {v === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ALL CLEAR
                </span>
              ) : (
                [...new Set(result.vulnerabilities.map(x => x.severity))].map(s => <Badge key={s} severity={s} />)
              )}
            </div>
          </div>

          {/* Vulnerability Items */}
          {v > 0 && (
            <div className="space-y-4">
              {result.vulnerabilities.map((vuln, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:border-white/20 hover:bg-slate-900/80 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-orange-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                      <span className="font-bold text-base text-white font-mono">
                        {vuln.header ?? `Port ${vuln.port} — ${vuln.service}`}
                      </span>
                    </div>
                    <Badge severity={vuln.severity} />
                  </div>

                  <div className="pl-4 space-y-4">
                    {/* What this means */}
                    <div className="rounded-xl bg-black/40 border border-white/5 p-4">
                      <p className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-indigo-400 mb-1.5 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        What This Means
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">{vuln.description}</p>
                    </div>

                    {/* How to fix with 1-Click Copy */}
                    <div className="rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 p-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.049.58.025 1.194-.14 1.743" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-cyan-400">
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
/*  Radar Scanning Animation                                         */
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
    <div className="flex flex-col items-center justify-center py-20 gap-8 anim-scale-in">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 anim-ping-ring" />
        <div className="absolute inset-2 rounded-full border border-blue-500/30 anim-ping-ring" style={{ animationDelay: "0.8s" }} />

        <div className="absolute inset-4 rounded-full border border-white/10 bg-slate-950/80 shadow-2xl" />
        <div className="absolute inset-10 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-white/10" />
        <div className="absolute w-full h-[1px] bg-white/10" />
        <div className="absolute h-full w-[1px] bg-white/10" />

        <div className="absolute inset-4 rounded-full overflow-hidden anim-radar">
          <div
            className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
            style={{
              background: "linear-gradient(135deg, rgba(0,240,255,0.6) 0%, rgba(0,240,255,0.1) 60%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#00f0ff] animate-pulse" />

        <div className="absolute top-[25%] left-[65%] w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_#f87171] animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute top-[65%] left-[30%] w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      </div>

      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-bold font-mono text-white tracking-tight flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SCAN IN PROGRESS...
        </h3>
        <div className="rounded-xl bg-black/60 border border-white/10 px-5 py-3 font-mono text-xs text-cyan-300 shadow-inner">
          <p className="animate-pulse">&gt; {steps[step]}</p>
        </div>

        <div className="w-64 h-1.5 rounded-full bg-white/10 mx-auto overflow-hidden">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
            style={{ animation: "float 1.5s ease-in-out infinite alternate" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Help / FAQ Drawer Modal                                          */
/* ================================================================ */

function HelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm anim-fade-in">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-cyan-500/30 p-6 sm:p-8 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
              <h3 className="text-lg font-mono font-black text-white tracking-tight">HOW SURFACECHECK WORKS</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 text-sm font-mono text-slate-300 leading-relaxed">
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-4">
              <h4 className="font-bold text-cyan-400 mb-1">🛡️ What is this tool?</h4>
              <p className="text-xs text-slate-300">
                SurfaceCheck is an automated vulnerability auditing platform. It evaluates website targets for missing HTTP security headers and open TCP network ports.
              </p>
            </div>

            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
              <h4 className="font-bold text-blue-400 mb-1">🔍 Why do HTTP Headers matter?</h4>
              <p className="text-xs text-slate-300">
                Headers like HSTS, Content Security Policy (CSP), and X-Frame-Options instruct browsers on how to handle data securely, preventing Cross-Site Scripting (XSS), clickjacking, and man-in-the-middle attacks.
              </p>
            </div>

            <div className="rounded-xl bg-purple-500/5 border border-purple-500/20 p-4">
              <h4 className="font-bold text-purple-400 mb-1">⚡ Why do TCP Ports matter?</h4>
              <p className="text-xs text-slate-300">
                Exposed ports like Telnet (23), FTP (21), or MySQL (3306) can allow unauthorized hackers to brute-force or intercept sensitive server telemetry.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
              <h4 className="font-bold text-emerald-400 mb-1">📑 How to use the PDF Report?</h4>
              <p className="text-xs text-slate-300">
                Click &quot;Download PDF Report&quot; after any scan to generate an executive-ready audit document to share with your software engineering or DevOps teams.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-extrabold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
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

  // Filtered Results
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

  const sampleTargets = [
    { label: "Vercel", url: "https://vercel.com", icon: "▲" },
    { label: "Cloudflare", url: "https://cloudflare.com", icon: "☁️" },
    { label: "Stripe", url: "https://stripe.com", icon: "💳" },
    { label: "GitHub", url: "https://github.com", icon: "🐙" },
  ];

  return (
    <div className="min-h-screen relative font-sans text-slate-100 bg-[#030508] bg-gradient-to-b from-[#0a0f1d] via-[#030508] to-[#010204] overflow-hidden">
      <AmbientBackground />
      <HelpDrawer open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* ── TOP NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className="mx-auto max-w-6xl px-6 pt-5">
          <div className="glass-card rounded-2xl px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white font-mono">SurfaceCheck</span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  v1.0.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setHelpOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
                <span className="hidden md:inline">HOW IT WORKS</span>
              </button>
              <SignalWaveform />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 tracking-widest uppercase">SYSTEM READY</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <header className="relative pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className={`transition-all duration-1000 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <CyberTelemetryConsole />
          </div>

          <div className={`inline-block mb-6 transition-all duration-1000 ease-out ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-xl animate-pulse" />
              <div className="relative px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 flex items-center gap-2 shadow-lg">
                <svg className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "10s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">NEXT-GEN SECURITY AUDITING</span>
              </div>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] transition-all duration-1000 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-white">Audit Your Attack Surface</span>
            <br />
            <span className="text-gradient-cyber">With Intelligent Scans</span>
          </h1>

          <p className={`mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-150 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Instantly inspect web targets for missing HTTP security headers and exposed TCP ports.
            Get plain-English explanations, real-time risk grading, and downloadable PDF reports.
          </p>

          {/* ── SCANNER FORM ── */}
          <form onSubmit={handleScan} className={`mt-10 transition-all duration-1000 delay-500 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="glow-border max-w-2xl mx-auto">
              <div className="glass-card rounded-[23px] p-2.5 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
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
                  {url && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      TARGET_LOCKED
                    </div>
                  )}
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
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      INITIATE SCAN
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
              1-Click Instant Demo Scans:
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {sampleTargets.map(t => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => { setUrl(t.url); executeScan(t.url); }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── RECENT SCANS STORAGE DRAWER ── */}
          {recentScans.length > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-slate-500">🕒 Recent Audits:</span>
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

          <div className={`transition-all duration-1000 delay-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <CyberMetricsBar />
          </div>
        </div>
      </header>

      {/* ── MAIN RESULTS AREA ── */}
      <main ref={resultsRef} className="relative z-10 mx-auto max-w-4xl px-6 pb-28">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-950/40 backdrop-blur-md p-6 flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] anim-scale-in">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="font-mono font-bold text-red-300 text-sm uppercase tracking-wider">Scan Error Detected</p>
              <p className="text-sm text-red-200/80 mt-1 leading-relaxed font-mono">{error}</p>
            </div>
          </div>
        )}

        {loading && <ScanningRadar />}

        {/* Scan Results Dashboard */}
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
                          <span className={`text-xl font-black font-mono ${score >= 70 ? "text-emerald-400" : score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                            <Counter to={score} />
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">SCORE</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Security Audit Report</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        </div>
                        <p className="text-sm font-mono text-slate-300">
                          Target: <span className="text-white font-bold underline decoration-cyan-500/50 underline-offset-4">{scannedUrl}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                          <span className="text-lg font-black font-mono text-red-400"><Counter to={totalV} /></span>
                        </div>
                        <div>
                          <p className="text-xs font-mono font-bold text-white uppercase">Issues</p>
                          <p className="text-[10px] font-mono text-slate-400">Detected</p>
                        </div>
                      </div>

                      <div className="w-px h-10 bg-white/10 hidden sm:block" />

                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                          <span className="text-lg font-black font-mono text-emerald-400"><Counter to={totalP} /></span>
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
                        className="group flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold hover:border-purple-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all active:scale-95"
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
                            <svg className="w-4 h-4 text-purple-400 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
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
                <span className="text-xs font-mono text-slate-400 mr-1">🎛️ Filter:</span>
                {[
                  { id: "ALL", label: `All Findings (${totalV})` },
                  { id: "CRITICAL_HIGH", label: "🚨 Critical & High" },
                  { id: "MEDIUM_LOW", label: "⚠️ Medium & Low" },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterSeverity(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${filterSeverity === f.id ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="🔍 Search issues (e.g. 'HSTS', '22')..."
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

            {/* Filtered Scanner Cards */}
            {filteredResults?.map((r, i) => (
              <ScanCard key={i} result={r} idx={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !results && !error && (
          <div className="text-center py-28 anim-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card mb-6 shadow-2xl border border-white/10">
              <svg className="w-8 h-8 text-cyan-400/60 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="text-lg font-mono font-bold text-white tracking-tight">Ready for Security Inspection</h3>
            <p className="text-slate-400 text-sm font-mono mt-2 max-w-sm mx-auto">
              Enter any target web address above or select a 1-Click Demo target to initiate an automated attack surface evaluation.
            </p>
          </div>
        )}
      </main>

      {/* ── STICKY FLOATING QUICK-ACTION BAR ── */}
      {results && !loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 anim-fade-up">
          <div className="glass-card rounded-2xl p-3 border border-cyan-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-xs font-mono font-bold text-white truncate">{scannedUrl.replace("https://", "")}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${score >= 70 ? "bg-emerald-500/20 text-emerald-300" : score >= 40 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"}`}>
                {score}%
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
              >
                ⬆️ TOP
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-extrabold text-xs transition-all cursor-pointer shadow-md disabled:opacity-40"
              >
                {downloading ? "PDF..." : "📑 PDF REPORT"}
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
