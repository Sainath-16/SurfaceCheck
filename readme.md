# SurfaceCheck — Automated Vulnerability Scanning API

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![Nmap](https://img.shields.io/badge/Nmap-Supported-red.svg)

## 📖 Project Overview
**SurfaceCheck** is an automated, lightweight vulnerability scanning engine designed to evaluate the external attack surface of web applications and infrastructure. It accepts a target URL and orchestrates a suite of asynchronous security checks—ranging from HTTP security header analysis to Nmap-based port exposure detection. 

The system features a decoupled architecture: a high-performance **FastAPI (Python)** backend that handles the offensive security logic, paired with a modern, responsive **Next.js** frontend dashboard that visualizes security findings in real-time and generates downloadable artifacts.

## ✨ Core Features
* **Automated Port Scanning:** Utilizes Nmap to detect exposed sensitive ports (e.g., SSH, RDP, databases) on the target infrastructure.
* **Security Header Analysis:** Inspects web server configurations for missing critical headers (e.g., HSTS, Content-Security-Policy) that prevent common web attacks like XSS and Clickjacking.
* **Intelligent Scoring:** Categorizes findings by severity (Critical, High, Medium) and provides actionable remediation instructions for developers.
* **Automated PDF Reporting:** Generates clean, downloadable PDF security reports summarizing the scan results for stakeholders or SecOps teams.

## 🏗️ System Architecture

```mermaid
flowchart LR
    U[User Browser] -->|Inputs Target URL| FE[Next.js Dashboard]
    FE -->|POST /api/v1/scan| BE[FastAPI Backend]
    
    subgraph Core Scanning Engine
    BE --> H[HTTP Header Scanner]
    BE --> P[Nmap Port Scanner]
    end
    
    H -->|Requests| Target[(Target Server)]
    P -->|TCP Connect| Target
    
    H --> R[Aggregator]
    P --> R
    
    R -->|Returns JSON Results| BE
    BE -->|Generates PDF Artifact| BE
    BE -->|Visualizes Data & File| FE
```mermaid
🛠️ Technology Stack
Backend: Python, FastAPI, Uvicorn, Pydantic

Security Tooling: python-nmap (wrapper for system Nmap), requests

Artifact Generation: fpdf2

Frontend: Next.js (App Router), React, Tailwind CSS

🚀 Getting Started
To run SurfaceCheck locally, you need to configure both the backend API and the frontend dashboard.

Prerequisites
Python 3.10+ and Node.js 18+ installed.

Nmap System Tool: The port scanner requires the actual Nmap software to be installed on your operating system and accessible in your system PATH.

Windows: Download from nmap.org (Ensure "Add to PATH" is checked during install).

Mac: brew install nmap

Linux: sudo apt-get install nmap


1. Backend Setup (FastAPI)
Open a terminal and start the API engine:

# Navigate to the backend directory
cd vuln-scanner-backend

# Create and activate a virtual environment
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic requests python-nmap fpdf2

# Start the server
uvicorn main:app --reload


2. Frontend Setup (Next.js)
Open a new terminal and start the user dashboard:
# Navigate to the frontend directory
cd surfacecheck-frontend

# Install dependencies
npm install

# Start the development server
npm run dev


Safe Testing Targets
Do not run this tool against production environments without explicit authorization. Use the following intentionally vulnerable targets to test the scanners:

http://scanme.nmap.org (Authorized Nmap testing server)

http://testphp.vulnweb.com (Vulnerable web application for header testing)

http://127.0.0.1 (Your own local machine)

⚠️ Disclaimer
For educational and authorized testing purposes only. Always ensure you have explicit, written permission from the asset owner before scanning a target network or application. The developers of SurfaceCheck are not responsible for any misuse or damage caused by this program.
