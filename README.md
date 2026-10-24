# PartTrace downloads — private testing

This repository contains the download website and a tested installation preview. It stays private
while testing. The Windows installer is unsigned; the Android app is release-signed.

## Installers

- [Windows installer](https://github.com/lachiegitholt/PartTrace-Releases/releases/download/preview-2026.10.0-95a42067/PartTrace-2026.10.0-Preview-Setup.exe)
- [Android app](https://github.com/lachiegitholt/PartTrace-Releases/releases/download/preview-2026.10.0-95a42067/PartTrace-Android.apk)
- [Preview release](https://github.com/lachiegitholt/PartTrace-Releases/releases/tag/preview-2026.10.0-95a42067)

The Downloads and Pages workflow verifies the files and publishes the preview into this private
repository. The same files are in `downloads/`, with SHA-256 checksums. The Windows installer passed
a fresh installation, HTTPS account setup, and updater registration on a disposable Windows runner.
Application source and signing keys are kept in a separate private repository.

## GitHub Pages

The website is ready in `index.html`, `page.css`, `page.js` and `release.json`. Every push validates
the installer files and saves a `download-page` artifact for testing. No website is published
automatically.

**A private repository does not make its Pages website private.** Private Pages access control
requires an eligible GitHub Enterprise organisation. Keep deployment disabled during private testing.
See [GitHub's Pages access-control documentation](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site).

When ready to publish publicly:

1. Open Settings → Pages and select **GitHub Actions** as the source (an eligible Pages plan is required for a private repository).
2. Open Actions → Downloads and Pages → Run workflow.
3. Select **Publish the website publicly**, then run it.

The expected public address is `https://lachiegitholt.github.io/PartTrace-Releases/`. The workflow
uploads only the four website files and `.nojekyll`, not the private installer folder or Git history.
