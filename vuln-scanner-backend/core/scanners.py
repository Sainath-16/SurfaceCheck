"""
Security scanning modules for SurfaceCheck.

Provides functions to audit target URLs for common security
misconfigurations such as missing HTTP security headers and open ports.
"""

import socket
from urllib.parse import urlparse

import nmap
import requests

# ---------------------------------------------------------------------------
# HTTP Header Scanner
# ---------------------------------------------------------------------------

# Each entry: (header_name, severity, description, remediation)
_SECURITY_HEADERS = [
    (
        "Strict-Transport-Security",
        "High",
        "Your website doesn't force visitors to use a secure (HTTPS) connection. "
        "This means someone on the same Wi-Fi network could secretly spy on or "
        "tamper with the data being sent between your site and its visitors — "
        "including passwords and personal information.",
        "Ask your developer to add a 'Strict-Transport-Security' rule to your "
        "web server so browsers are always forced to use the secure, encrypted "
        "version of your site.",
    ),
    (
        "Content-Security-Policy",
        "High",
        "Your website doesn't have rules about which scripts and resources are "
        "allowed to run. Without this safeguard, attackers could inject malicious "
        "code into your pages — for example, stealing login credentials or "
        "redirecting visitors to fake websites.",
        "Ask your developer to set up a 'Content-Security-Policy' that specifies "
        "exactly which scripts, styles, and resources your site is allowed to load. "
        "This acts like a bouncer that blocks unauthorized code.",
    ),
    (
        "X-Frame-Options",
        "Medium",
        "Your website can be embedded inside another website using a trick called "
        "an 'iframe'. Attackers can use this to create invisible overlays that trick "
        "your users into clicking buttons they didn't intend to — like unknowingly "
        "transferring money or changing account settings.",
        "Ask your developer to add the 'X-Frame-Options' rule to prevent other "
        "websites from embedding yours. This stops the invisible overlay trick "
        "(known as 'clickjacking').",
    ),
    (
        "X-Content-Type-Options",
        "Medium",
        "Your website doesn't tell browsers to strictly follow the file types it "
        "sends. This means a browser might guess wrong and treat a harmless-looking "
        "file as executable code — which attackers can exploit to run malicious "
        "scripts on your visitors' computers.",
        "Ask your developer to add the 'X-Content-Type-Options: nosniff' rule. "
        "This is a simple one-line fix that tells browsers to never guess — just "
        "trust the file type your server says it is.",
    ),
]


def scan_http_headers(url: str) -> dict:
    """Scan a target URL for missing HTTP security headers."""

    result: dict = {
        "scanner": "Security Headers Analysis",
        "vulnerabilities": [],
        "passed": [],
    }

    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
    except requests.exceptions.ConnectionError:
        result["vulnerabilities"].append({
            "header": "Connection Failed",
            "severity": "Critical",
            "description": f"We couldn't reach {url}. The website appears to be offline or the address may be incorrect.",
            "remediation": "Double-check that you typed the website address correctly and that the site is currently online.",
        })
        return result
    except requests.exceptions.Timeout:
        result["vulnerabilities"].append({
            "header": "Connection Timed Out",
            "severity": "Critical",
            "description": f"The website {url} took too long to respond (over 10 seconds). It may be overloaded or blocking our scan.",
            "remediation": "Try again in a few minutes. If the problem persists, the server may need performance improvements.",
        })
        return result
    except requests.exceptions.RequestException as exc:
        result["vulnerabilities"].append({
            "header": "Connection Error",
            "severity": "Critical",
            "description": f"Something went wrong while trying to connect to {url}: {exc}",
            "remediation": "Make sure the website address starts with http:// or https:// and try again.",
        })
        return result

    headers = response.headers

    for header_name, severity, description, remediation in _SECURITY_HEADERS:
        if header_name in headers:
            result["passed"].append({
                "header": header_name,
                "value": headers[header_name],
            })
        else:
            result["vulnerabilities"].append({
                "header": header_name,
                "severity": severity,
                "description": description,
                "remediation": remediation,
            })

    return result


# ---------------------------------------------------------------------------
# Nmap Port Scanner
# ---------------------------------------------------------------------------

_PORTS_TO_SCAN = "21,22,23,3306,3389"

# Maps each port to (service_name, severity, description, remediation)
_PORT_RISK_MAP: dict[int, tuple[str, str, str, str]] = {
    21: (
        "FTP (File Transfer)",
        "High",
        "Port 21 is open — this is used for FTP, an old method of transferring files. "
        "The problem is that FTP sends passwords in plain text, like writing your "
        "password on a postcard instead of sealing it in an envelope. Anyone "
        "monitoring the network could read it.",
        "Switch to a secure file transfer method (SFTP or SCP) that encrypts data. "
        "If FTP is absolutely necessary, enable encryption (FTPS) and restrict "
        "who can access it using firewall rules.",
    ),
    22: (
        "SSH (Remote Access)",
        "High",
        "Port 22 is open — this is used for SSH, which lets administrators remotely "
        "control the server. While SSH itself is secure, leaving this port publicly "
        "visible is like leaving your front door visible to everyone — attackers "
        "will constantly try to guess the password to get in.",
        "Limit who can access SSH by setting up firewall rules or requiring a VPN. "
        "Use security keys instead of passwords (like a special USB key to log in), "
        "and consider moving SSH to a non-standard port to reduce automated attacks.",
    ),
    23: (
        "Telnet (Insecure Remote Access)",
        "Critical",
        "Port 23 is open — this is used for Telnet, an extremely outdated and "
        "dangerous remote access tool. Telnet sends EVERYTHING in plain text — "
        "passwords, commands, data — all of it. Using Telnet is like having a "
        "phone conversation on speakerphone in a crowded room.",
        "Disable Telnet immediately. There is no safe way to use it. Replace it "
        "with SSH, which encrypts all communication.",
    ),
    3306: (
        "MySQL (Database)",
        "Critical",
        "Port 3306 is open — this is your MySQL database, and it's directly "
        "accessible from the internet. This is like leaving your filing cabinet "
        "unlocked on the sidewalk. Attackers can try to guess database passwords "
        "or exploit known vulnerabilities to steal all your data.",
        "Configure MySQL to only accept connections from the server itself (localhost). "
        "If remote database access is needed, use a secure tunnel (VPN or SSH tunnel) "
        "instead of exposing it directly to the internet.",
    ),
    3389: (
        "RDP (Remote Desktop)",
        "Critical",
        "Port 3389 is open — this is used for Remote Desktop, which lets someone "
        "control your computer from anywhere. Leaving this exposed to the internet "
        "is extremely dangerous — it's one of the most common ways hackers break "
        "into systems, and there have been major security flaws discovered in RDP.",
        "Disable Remote Desktop if you don't need it. If you do, put it behind a "
        "VPN so only authorized users on your network can reach it, and enable "
        "multi-factor authentication (like a code sent to your phone) for an "
        "extra layer of security.",
    ),
}


def scan_open_ports(url: str) -> dict:
    """Scan a target URL for dangerous open ports using Nmap."""

    result: dict = {
        "scanner": "Open Ports Analysis",
        "vulnerabilities": [],
        "passed": [],
    }

    # --- Resolve hostname to IP -----------------------------------------------
    hostname = urlparse(url).hostname
    if not hostname:
        result["vulnerabilities"].append({
            "port": "N/A",
            "severity": "Critical",
            "description": f"We couldn't figure out the website address from: {url}",
            "remediation": "Please enter a complete website address like https://example.com.",
        })
        return result

    try:
        ip_address = socket.gethostbyname(hostname)
    except socket.gaierror:
        result["vulnerabilities"].append({
            "port": "N/A",
            "severity": "Critical",
            "description": f"We couldn't find a server for '{hostname}'. The domain name doesn't appear to exist or DNS is unreachable.",
            "remediation": "Double-check the spelling of the website address and make sure it's a real, active domain.",
        })
        return result

    # --- Run Nmap scan --------------------------------------------------------
    try:
        scanner = nmap.PortScanner()
        scanner.scan(
            hosts=ip_address,
            ports=_PORTS_TO_SCAN,
            arguments="-Pn -sT --host-timeout 10s",
        )
    except nmap.PortScannerError as exc:
        result["vulnerabilities"].append({
            "port": "N/A",
            "severity": "Critical",
            "description": f"The port scanning tool (Nmap) encountered an error: {exc}",
            "remediation": "Make sure Nmap is installed on the server. Contact your system administrator.",
        })
        return result
    except Exception as exc:  # noqa: BLE001
        result["vulnerabilities"].append({
            "port": "N/A",
            "severity": "Critical",
            "description": f"Something unexpected went wrong during the port scan: {exc}",
            "remediation": "Try running the scan again. If it keeps failing, contact support.",
        })
        return result

    # --- Process results ------------------------------------------------------
    for port in [int(p) for p in _PORTS_TO_SCAN.split(",")]:
        service, severity, description, remediation = _PORT_RISK_MAP[port]

        try:
            state = scanner[ip_address]["tcp"][port]["state"]
        except KeyError:
            state = "closed"

        if state == "open":
            result["vulnerabilities"].append({
                "port": port,
                "service": service,
                "severity": severity,
                "description": description,
                "remediation": remediation,
            })
        else:
            result["passed"].append({
                "port": port,
                "service": service,
                "state": state,
            })

    return result
