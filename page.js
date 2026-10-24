// Copyright (c) 2026 Lachie Holt. All rights reserved. See LICENSE.
const byId = id => document.getElementById(id);
const choose = joining => {
  byId("choose-new").setAttribute("aria-pressed", String(!joining));
  byId("choose-join").setAttribute("aria-pressed", String(joining));
  byId("new-workshop").hidden = joining;
  byId("join-workshop").hidden = !joining;
};
byId("choose-new").addEventListener("click", () => choose(false));
byId("choose-join").addEventListener("click", () => choose(true));
choose(new URLSearchParams(location.search).get("purpose") === "join");
const windows = /Windows/i.test(navigator.userAgent);
byId("device-note").textContent = windows ? "Recommended for this computer · Windows 10 or later, 64-bit." : "Setting up from a phone or another computer? Download this installer on the Windows PC that will run PartTrace. To connect this device, choose Join your workshop.";
async function release() {
  byId("retry").hidden = true;
  byId("release-error").hidden = true;
  byId("release-status").textContent = "Finding the installer…";
  try {
    const response = await fetch("./release.json", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (data.available === false) {
      const releases = new URL(data.releases);
      if (releases.protocol !== "https:" || releases.hostname !== "github.com" || releases.username || releases.password) throw new Error();
      byId("installer").hidden = true;
      byId("portable").hidden = true;
      byId("releases").href = releases.href;
      byId("release-status").textContent = "The first public installer is coming soon.";
      byId("device-note").textContent = "Already using PartTrace? Choose Join your workshop to connect this device. The Windows download will appear here when the first public release is ready.";
      return;
    }
    if (!/^\d+(\.\d+){2,3}$/.test(data.version)) throw new Error();
    const links = ["installer", "releases", ...["portable", "android"].filter(name => data[name])];
    for (const name of links) {
      const url = new URL(data[name]);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) throw new Error();
    }
    for (const name of links) {
      byId(name).href = data[name];
      byId(name).hidden = false;
    }
    byId("portable").hidden = !data.portable;
    byId("portable-description").hidden = !data.portable;
    byId("android").hidden = !data.android;
    byId("preview-note").hidden = data.preview !== true;
    byId("release-status").textContent = data.preview ? `Preview ${data.version} · Unsigned Windows installer` : `Version ${data.version} · Includes everything you need`;
    byId("installer").addEventListener("click", () => {
      // The unsigned-download prompts are where people give up, so the way past them appears as the download starts.
      byId("after-download").hidden = false;
      byId("after-download").focus();
    });
  } catch {
    byId("release-status").textContent = "The installer could not be loaded.";
    byId("release-error").textContent = "Check your connection and try again, or open the releases link under Other options. If your workshop is offline, download the installer on another computer and copy it across.";
    byId("release-error").hidden = false;
    byId("retry").hidden = false;
  }
}
byId("retry").addEventListener("click", release);
void release();
byId("join-form").addEventListener("submit", event => {
  event.preventDefault();
  const error = byId("join-error");
  error.hidden = true;
  try {
    const typed = byId("address").value.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(typed) ? typed : `http://${typed}`);
    const host = url.hostname.toLowerCase();
    const parts = host.split(".").map(Number);
    const ipv4 = parts.length === 4 && parts.every(n => Number.isInteger(n) && n >= 0 && n <= 255);
    const privateAddress = host === "localhost" || host.endsWith(".local") || /^\[(?:f[cd][\da-f]{2}:|fe[89ab][\da-f]:|::1\])/i.test(host) ||
      (ipv4 && (parts[0] === 10 || parts[0] === 127 || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 169 && parts[1] === 254)));
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || !privateAddress) throw new Error("Use the workshop’s local address, such as http://parttrace.local or http://192.168.1.50.");
    const code = byId("code").value.toUpperCase().replace(/[^0-9A-Z]/g, "");
    if (code && !/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(code)) throw new Error("Enter the eight-character setup code shown on the PartTrace computer, or leave it blank.");
    // Keep the original path and fingerprint when an administrator supplies a complete setup link.
    if (code) url.pathname = `/j/${code}`;
    location.assign(url.href);
  } catch (failure) {
    error.textContent = failure.message.startsWith("Use ") || failure.message.startsWith("Enter ") ? failure.message : "Check the workshop address and try again.";
    error.hidden = false;
  }
});

