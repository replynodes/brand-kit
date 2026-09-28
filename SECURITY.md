# Security

Report suspected vulnerabilities privately through the GitHub Security Advisory form for this repository: https://github.com/replynodes/brand-kit/security/advisories/new. Do not open a public issue with exploit details.

Include the affected version or commit, a concise impact description, reproduction steps or a minimal proof of concept, and any relevant logs with secrets removed. Avoid passwords, tokens, private keys, personal data, and other credentials. Never request credentials in a public issue or report, and do not send credentials in an advisory.

The client makes one HTTPS GET, follows no redirects, sends no credentials or cookies, and writes only to a newly staged local `brand/` directory.
