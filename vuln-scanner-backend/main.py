"""
SurfaceCheck API — Automated Vulnerability Scanning Service.

Entry-point for the FastAPI application.  Start with:
    uvicorn main:app --reload
"""

import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from models.schemas import ScanRequest, ReportRequest
from core.scanners import scan_http_headers, scan_open_ports
from core.reporter import generate_pdf_report

app = FastAPI(
    title="SurfaceCheck API",
    description="Automated vulnerability scanning API that audits web targets for common security misconfigurations.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS – allow the frontend dev server to reach the API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
async def health_check():
    """Simple liveness probe."""
    return {"status": "ok", "service": "SurfaceCheck API"}


@app.post("/api/v1/scan")
async def run_scan(request: ScanRequest):
    """Accept a target URL and return combined scan results.

    Runs both scanners **concurrently** in separate threads so the
    total wait time ≈ max(header_scan, port_scan) instead of the sum.
    """
    target = str(request.target_url)

    header_results, port_results = await asyncio.gather(
        asyncio.to_thread(scan_http_headers, target),
        asyncio.to_thread(scan_open_ports, target),
    )

    return {"findings": [header_results, port_results]}


@app.post("/api/v1/report")
async def generate_report(request: ReportRequest):
    """Generate a PDF report from previously obtained scan findings.

    Accepts the target URL and the findings array (as returned by
    ``/api/v1/scan``), builds a professional PDF document, and streams
    it back to the client.
    """
    pdf_path = await asyncio.to_thread(
        generate_pdf_report,
        target_url=request.target_url,
        findings=request.findings,
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename="surfacecheck-report.pdf",
    )
