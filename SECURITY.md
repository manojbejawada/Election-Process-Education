# Security Policy

## Supported Versions

Currently, only the main `v1.x` branch is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within CivicEdu, please DO NOT report it via public GitHub issues. Instead, please email the security team at `security@civicedu.local`. 

We take all security vulnerabilities seriously and will prioritize resolving them.

## Threat Model & Safeguards
1. **Cross-Site Scripting (XSS):** Addressed via strict `sanitizeInput()` wrapping on all user inputs, and a rigorous `Content-Security-Policy`.
2. **Brute Force:** Addressed via `RateLimiter` allowing maximum 5 login attempts per 15 minutes.
3. **Session Hijacking:** Addressed via 30-minute auto-timeout `SessionManager` and `SAMEORIGIN` framing policies.
4. **Reverse Tabnabbing:** Prevented via `rel="noopener noreferrer"` on external calendar links.
5. **DDoS Protection:** Deployed via rate-limiting mechanisms at the NGINX configuration level.
