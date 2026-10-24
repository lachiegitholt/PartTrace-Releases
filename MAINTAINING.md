# Maintaining PartTrace-Releases

This repository holds what testers and customers download. Application source and signing keys are
in the separate private `parttrace` repository. Keep this one private while testing.

## Testing previews

Every push to `main` in the source repository runs **Build and publish the
testing preview**. It builds the Windows installer, installs it on a disposable Windows runner, then:

1. Replaces `PartTrace-Setup.exe`, `PartTrace-Android.apk` and `SHA256SUMS.txt` on the rolling
   [`preview`](https://github.com/lachiegitholt/PartTrace-Releases/releases/tag/preview) release
   and rewrites its notes.
2. Commits the matching `release.json`, the download page files and the version line in
   `README.md` to `main`.

Nothing here needs editing by hand for a preview. The source repository's `RELEASES_TOKEN` secret
must be able to write to this repository. Publishing stops if this repository is public, because the
preview installer is unsigned. Installers are never committed to Git.

## Stable releases

A signed, tagged release in the source repository publishes its installers, update bundles and feed
as a `v…` release here. Once the first stable release exists, point the download link in `README.md`
at `releases/latest/download/` and say the installer is signed.

## GitHub Pages

The download website is `index.html`, `page.css`, `page.js` and `release.json`. Every push to `main`
checks `release.json` and saves a `download-page` artifact for testing. No website is published
automatically.

**A private repository does not make its Pages website private.** Private Pages access control
requires an eligible GitHub Enterprise organisation. Keep deployment off during private testing.
See [GitHub's Pages access-control documentation](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site).

When ready to publish publicly:

1. Open Settings → Pages and select **GitHub Actions** as the source (an eligible Pages plan is
   required for a private repository).
2. Open Actions → Downloads and Pages → Run workflow.
3. Select **Publish the website publicly**, then run it.

The expected public address is `https://lachiegitholt.github.io/PartTrace-Releases/`. The workflow
uploads only the four website files and `.nojekyll`.
