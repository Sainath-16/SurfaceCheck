"""
PDF report generation for SurfaceCheck.

Produces a clean, professional PDF document summarising the findings
from all registered scanners.
"""

import os
import tempfile
from datetime import datetime, timezone

from fpdf import FPDF


# ---------------------------------------------------------------------------
#  Colour palette (R, G, B)
# ---------------------------------------------------------------------------
_CLR_DARK   = (18, 22, 30)
_CLR_WHITE  = (255, 255, 255)
_CLR_ACCENT = (56, 132, 244)
_CLR_MUTED  = (120, 130, 145)
_CLR_RULE   = (210, 215, 225)
_CLR_GREEN  = (40, 167, 69)

_SEVERITY_COLOURS: dict[str, tuple[int, int, int]] = {
    "Critical": (220, 53, 69),
    "High":     (232, 126, 4),
    "Medium":   (204, 163, 0),
    "Low":      (56, 132, 244),
}

# ---------------------------------------------------------------------------
#  Report directory
# ---------------------------------------------------------------------------
_REPORT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "reports",
)


def _ensure_report_dir() -> str:
    os.makedirs(_REPORT_DIR, exist_ok=True)
    return _REPORT_DIR


def _safe(text: str) -> str:
    """Replace Unicode chars that Helvetica (latin-1) cannot render."""
    replacements = {
        "\u2713": "+", "\u2714": "+",
        "\u2018": "'", "\u2019": "'",
        "\u201c": '"', "\u201d": '"',
        "\u2014": " - ", "\u2013": " - ",
        "\u2026": "...", "\u2022": "*",
    }
    for uni, asc in replacements.items():
        text = text.replace(uni, asc)
    return text.encode("latin-1", errors="replace").decode("latin-1")


def _draw_rule(pdf: FPDF) -> None:
    pdf.set_draw_color(*_CLR_RULE)
    pdf.set_line_width(0.3)
    pdf.line(pdf.l_margin, pdf.get_y(), 210 - pdf.r_margin, pdf.get_y())


def _indented_text(pdf: FPDF, text: str, indent: float = 8) -> None:
    """Write a multi_cell with a visual indent, safely."""
    w = 210 - pdf.l_margin - pdf.r_margin - indent
    pdf.set_x(pdf.l_margin + indent)
    pdf.multi_cell(w, 4.5, _safe(text))


# ---------------------------------------------------------------------------
#  Public API
# ---------------------------------------------------------------------------

def generate_pdf_report(target_url: str, findings: list) -> str:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # -- Title banner --
    pdf.set_fill_color(*_CLR_ACCENT)
    pdf.rect(0, 0, 210, 48, "F")
    pdf.set_y(10)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*_CLR_WHITE)
    pdf.cell(0, 12, "SurfaceCheck Security Report", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(220, 230, 255)
    pdf.cell(0, 7, f"Generated: {timestamp}", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(16)

    # -- Target info --
    pdf.set_text_color(*_CLR_DARK)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(28, 7, "Target URL:", new_x="END")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*_CLR_ACCENT)
    pdf.cell(0, 7, _safe(target_url), new_x="LMARGIN", new_y="NEXT")

    total_vulns = sum(len(f.get("vulnerabilities", [])) for f in findings)
    total_passed = sum(len(f.get("passed", [])) for f in findings)

    pdf.set_text_color(*_CLR_DARK)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(28, 7, "Summary:", new_x="END")
    pdf.set_font("Helvetica", "", 11)
    if total_vulns > 0:
        pdf.set_text_color(*_SEVERITY_COLOURS["Critical"])
        pdf.cell(0, 7, f"{total_vulns} issue(s) found", new_x="LMARGIN", new_y="NEXT")
    else:
        pdf.set_text_color(*_CLR_GREEN)
        pdf.cell(0, 7, "No issues found", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*_CLR_DARK)
    pdf.cell(28, 7, "", new_x="END")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*_CLR_GREEN)
    pdf.cell(0, 7, f"{total_passed} check(s) passed", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(4)
    _draw_rule(pdf)
    pdf.ln(4)

    # -- Scanner sections --
    for finding in findings:
        scanner_name = _safe(finding.get("scanner", "Unknown Scanner"))
        vulns = finding.get("vulnerabilities", [])
        passed = finding.get("passed", [])

        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(*_CLR_ACCENT)
        pdf.cell(0, 10, scanner_name, new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*_CLR_MUTED)
        pdf.cell(0, 5, f"{len(vulns)} issue(s)  |  {len(passed)} passed", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)

        # Vulnerabilities
        if vulns:
            for vuln in vulns:
                severity = vuln.get("severity", "Unknown")
                sev_clr = _SEVERITY_COLOURS.get(severity, _CLR_MUTED)
                identifier = vuln.get("header") or f"Port {vuln.get('port', '?')} - {vuln.get('service', '?')}"

                pdf.set_font("Helvetica", "B", 10)
                pdf.set_text_color(*sev_clr)
                pdf.cell(22, 6, f"[{severity}]", new_x="END")
                pdf.set_text_color(*_CLR_DARK)
                pdf.cell(0, 6, _safe(identifier), new_x="LMARGIN", new_y="NEXT")

                description = vuln.get("description", "")
                if description:
                    pdf.set_font("Helvetica", "", 9)
                    pdf.set_text_color(*_CLR_MUTED)
                    _indented_text(pdf, description)

                remediation = vuln.get("remediation", "")
                if remediation:
                    pdf.set_font("Helvetica", "I", 9)
                    pdf.set_text_color(*_CLR_ACCENT)
                    _indented_text(pdf, f"How to fix: {remediation}")

                pdf.ln(3)
        else:
            pdf.set_font("Helvetica", "I", 10)
            pdf.set_text_color(*_CLR_GREEN)
            pdf.cell(0, 7, "No vulnerabilities detected.", new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)

        # Passed checks
        if passed:
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 10)
            pdf.set_text_color(*_CLR_GREEN)
            pdf.cell(0, 7, "Passed Checks", new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(*_CLR_DARK)
            for check in passed:
                label = check.get("header") or f"Port {check.get('port', '?')} ({check.get('service', '?')})"
                extra = check.get("value") or check.get("state", "")
                line = f"  [OK]  {_safe(label)}"
                if extra:
                    line += f"  -  {_safe(extra)}"
                pdf.cell(0, 5.5, line, new_x="LMARGIN", new_y="NEXT")

        pdf.ln(6)
        _draw_rule(pdf)
        pdf.ln(4)

    # -- Footer --
    pdf.ln(2)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(*_CLR_MUTED)
    pdf.multi_cell(
        0, 4,
        "This report was auto-generated by SurfaceCheck. "
        "Results are point-in-time and may change as the target is updated. "
        "Always verify findings before taking remediation action.",
        align="C",
    )

    # -- Save --
    report_dir = _ensure_report_dir()
    fd, path = tempfile.mkstemp(suffix=".pdf", prefix="surfacecheck_", dir=report_dir)
    os.close(fd)
    pdf.output(path)
    return os.path.abspath(path)
