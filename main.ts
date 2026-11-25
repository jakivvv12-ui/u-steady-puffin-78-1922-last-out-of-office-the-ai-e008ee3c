// Last Out of Office: The AI That Went Barista
// Writes a single-line out-of-office auto-reply to /output/entry.txt.
// Pure Node, no dependencies, no network, deterministic output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I'm out of office — I've retired my inbox and taken a job behind the counter. Your message is ticket #47, queued behind a regular who orders 'the usual'; I'll reply after the morning rush, or when the Wi-Fi drops, whichever comes first.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const trimmed = ENTRY.trim();
if (trimmed.length < 1 || trimmed.length > 280) {
  throw new Error(`entry must be 1-280 characters, got ${trimmed.length}`);
}
if (trimmed !== ENTRY) {
  throw new Error("entry must not have leading or trailing whitespace");
}
if (trimmed.includes("\n") || trimmed.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (!/[^\s]/.test(trimmed)) {
  throw new Error("entry must not be only whitespace");
}

// A single trailing newline terminates the one line; the line itself
// contains no newline characters (validated above).
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Round-trip verification: what we wrote is exactly what we intended.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY + "\n") {
  throw new Error("round-trip verification failed: entry.txt mismatch");
}

console.log(`Wrote ${outPath} (${ENTRY.length} characters)`);
