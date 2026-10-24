// Copyright (c) 2026 Lachie Holt. All rights reserved. See LICENSE.

// The installers live on releases, not in Git; this checks that the page only ever points at them.
import { readFileSync } from "node:fs";

const metadata = JSON.parse(readFileSync("release.json", "utf8"));
if (!/^\d+(\.\d+){2,3}$/.test(metadata.version)) throw new Error("Invalid release version.");
const repository = "/lachiegitholt/PartTrace-Releases/releases/";
for (const name of ["installer", "releases", ...["android", "portable"].filter(name => metadata[name])]) {
  const url = new URL(metadata[name]);
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) throw new Error("Unexpected download host.");
  if (!url.pathname.toLowerCase().startsWith(repository.toLowerCase())) throw new Error(`${name} does not point at this repository's releases.`);
}
if (metadata.preview && metadata.tag !== "preview") throw new Error("A testing preview must use the rolling preview release.");
console.log(`release.json points at PartTrace ${metadata.version}${metadata.preview ? " (testing preview)" : ""}.`);
