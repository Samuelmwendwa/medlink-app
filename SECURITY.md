# Security Policy

## Supported Versions

Only the latest version of MediLink is currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within MediLink, please send an email to samuelmwendwa976@gmail.com. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Security Measures

MediLink implements several security measures to protect user data:

1. **Authentication**: Secure user authentication through Supabase Auth
2. **Authorization**: Role-based access control for different user types
3. **Data Protection**: Row-level security policies in the database
4. **Secure Communication**: HTTPS for all API communications
5. **Input Validation**: Validation of all user inputs to prevent injection attacks

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.

---

© 2025 MediLink. All rights reserved.
