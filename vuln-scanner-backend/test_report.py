"""Test the report endpoint via HTTP to confirm PDF download works end-to-end."""
import requests

r = requests.post(
    "http://127.0.0.1:8000/api/v1/report",
    json={
        "target_url": "https://example.com",
        "findings": [
            {
                "scanner": "Security Headers Analysis",
                "vulnerabilities": [
                    {
                        "header": "Strict-Transport-Security",
                        "severity": "High",
                        "description": "Your website does not force secure connections.",
                        "remediation": "Ask your developer to add the HSTS header.",
                    }
                ],
                "passed": [
                    {"header": "X-Content-Type-Options", "value": "nosniff"}
                ],
            },
            {
                "scanner": "Open Ports Analysis",
                "vulnerabilities": [],
                "passed": [
                    {"port": 22, "service": "SSH (Remote Access)", "state": "closed"},
                ],
            },
        ],
    },
)

print(f"Status: {r.status_code}")
print(f"Content-Type: {r.headers.get('content-type')}")
print(f"Content-Disposition: {r.headers.get('content-disposition')}")
print(f"Size: {len(r.content)} bytes")

if r.status_code == 200:
    print("PDF endpoint works!")
else:
    print(f"Error: {r.text[:500]}")
