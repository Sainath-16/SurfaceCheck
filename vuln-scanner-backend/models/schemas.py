"""
Pydantic models for API request and response validation.
"""

from pydantic import BaseModel, HttpUrl


class ScanRequest(BaseModel):
    """Schema for incoming scan requests.

    Attributes:
        target_url: A valid HTTP/HTTPS URL to scan for security vulnerabilities.
    """

    target_url: HttpUrl


class ReportRequest(BaseModel):
    """Schema for PDF report generation requests.

    Attributes:
        target_url: The URL that was scanned.
        findings:   The list of scanner-result dictionaries returned by
                    the ``/api/v1/scan`` endpoint.
    """

    target_url: str
    findings: list[dict]
