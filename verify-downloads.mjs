// Copyright (c) 2026 Lachie Holt. All rights reserved. See LICENSE.

import { createReadStream, readFileSync, appendFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const metadata = JSON.parse(readFileSync("release.json", "utf8"));
if (!/^\d+(\.\d+){2,3}$/.test(metadata.version)) throw new Error("Invalid release version.");
for (const name of ["installer", "releases", ...["android", "portable"].filter(name => metadata[name])]) {
  const url = new URL(metadata[name]);
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password) throw new Error("Unexpected download host.");
}
const expectedFiles = new Set(["PartTrace-2026.10.0-Preview-Setup.exe", "PartTrace-Android.apk"]);
const lines = readFileSync("downloads/SHA256SUMS.txt", "utf8").trim().split(/\r?\n/);
if (lines.length !== expectedFiles.size) throw new Error("Missing installer checksums.");
for (const line of lines) {
  const match = /^([a-f0-9]{64})  ([^/\\]+)$/.exec(line);
  if (!match || !expectedFiles.delete(match[2])) throw new Error("Invalid checksum manifest.");
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(join("downloads", match[2]))) hash.update(chunk);
  if (hash.digest("hex") !== match[1]) throw new Error(`Checksum mismatch for ${match[2]}.`);
  console.log(`Verified ${match[2]}`);
}
if (metadata.preview && !/^preview-\d+(\.\d+){2,3}-[a-f0-9]{8}$/.test(metadata.tag)) throw new Error("Invalid preview tag.");
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `preview=${Boolean(metadata.preview)}\ntag=${metadata.tag || ""}\n`);
