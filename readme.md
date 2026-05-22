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
