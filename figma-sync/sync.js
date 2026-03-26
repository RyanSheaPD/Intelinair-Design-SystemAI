#!/usr/bin/env node
/**
 * Intelinair Design System — Figma Variable Sync
 * ─────────────────────────────────────────────────────────────────
 * Pulls all Variables from your Figma file and writes:
 *   ../design-tokens/tokens.css   — CSS custom properties (:root)
 *   ../design-tokens/tokens.json  — Structured JSON
 *   ../design-tokens/tokens.ts    — TypeScript constants (typed)
 *
 * Usage:
 *   npm run sync           — writes output files
 *   npm run sync:dry       — prints output, no file writes
 *
 * Setup:
 *   1. cp .env.example .env
 *   2. Fill in FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY
 *   3. npm install && npm run sync
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDryRun = process.argv.includes("--dry-run");

// ─── Load env ────────────────────────────────────────────────────
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!TOKEN || !FILE_KEY || FILE_KEY === "your_file_key_here") {
  console.error(
    "\n❌  Missing config. Copy .env.example → .env and fill in:\n" +
      "    FIGMA_ACCESS_TOKEN\n" +
      "    FIGMA_FILE_KEY\n"
  );
  process.exit(1);
}

// ─── Output paths ────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, "..", "design-tokens");
const CSS_PATH = path.join(OUT_DIR, "tokens.css");
const JSON_PATH = path.join(OUT_DIR, "tokens.json");
const TS_PATH = path.join(OUT_DIR, "tokens.ts");

// ─── Figma API helpers ───────────────────────────────────────────
async function figmaGet(endpoint) {
  const url = `https://api.figma.com/v1${endpoint}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status} on ${endpoint}:\n${body}`);
  }
  return res.json();
}

// ─── Color helpers ───────────────────────────────────────────────
function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function toRgbStr(r, g, b) {
  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
}

function toHexAlpha(r, g, b, a) {
  if (a >= 0.999) return toHex(r, g, b);
  const hex = toHex(r, g, b);
  const alphaHex = Math.round(a * 255).toString(16).padStart(2, "0");
  return hex + alphaHex;
}

// ─── Name → CSS custom property ─────────────────────────────────
/**
 * Converts a Figma variable name to a CSS custom property name.
 * Figma uses "/" as a hierarchy separator, e.g. "color/brand/500"
 * → --color-brand-500
 * Also handles spaces, camelCase, etc.
 */
function toCSSVarName(collectionName, variableName) {
  // Combine collection (optional prefix) + variable name
  // Many teams prefix inside the variable name already, so we detect duplicates.
  const raw = variableName
    .replace(/\s+/g, "-")         // spaces → dashes
    .replace(/\//g, "-")          // Figma hierarchy → dashes
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → kebab
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")   // strip non-alphanumeric
    .replace(/-+/g, "-")          // collapse multiple dashes
    .replace(/^-|-$/g, "");       // trim leading/trailing dashes

  return `--${raw}`;
}

// ─── Build nested JSON path from Figma variable name ────────────
function toJsonPath(variableName) {
  return variableName
    .split("/")
    .map((s) => s.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, ""));
}

function setNestedJson(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!cur[pathArr[i]] || typeof cur[pathArr[i]] !== "object") {
      cur[pathArr[i]] = {};
    }
    cur = cur[pathArr[i]];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

// ─── Resolve alias values ────────────────────────────────────────
function resolveValue(rawValue, variablesById, modeId, depth = 0) {
  if (depth > 10) return null; // avoid infinite loops
  if (rawValue?.type === "VARIABLE_ALIAS") {
    const ref = variablesById[rawValue.id];
    if (!ref) return null;
    const refValue = ref.valuesByMode?.[modeId] ?? Object.values(ref.valuesByMode ?? {})[0];
    return resolveValue(refValue, variablesById, modeId, depth + 1);
  }
  return rawValue;
}

// ─── Format resolved value to CSS string ────────────────────────
function formatCSSValue(resolvedValue, resolvedType) {
  if (resolvedValue === null || resolvedValue === undefined) return null;

  if (resolvedType === "COLOR") {
    const { r, g, b, a = 1 } = resolvedValue;
    return toHexAlpha(r, g, b, a);
  }

  if (resolvedType === "FLOAT") {
    const n = resolvedValue;
    // Figma stores unitless numbers; heuristics to add px:
    // 0 stays 0, integers that look like pixel values get "px",
    // small decimals (line-height) stay unitless.
    if (n === 0) return "0";
    if (n < 1 && n > 0) return String(n); // line-height, opacity
    return `${n}px`;
  }

  if (resolvedType === "STRING") {
    return resolvedValue;
  }

  if (resolvedType === "BOOLEAN") {
    return resolvedValue ? "1" : "0";
  }

  return String(resolvedValue);
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🔗  Fetching Figma Variables from file: ${FILE_KEY}\n`);

  const data = await figmaGet(`/files/${FILE_KEY}/variables/local`);

  const { variableCollections, variables } = data.meta ?? data;

  if (!variables || !variableCollections) {
    console.error("❌  No variables found. Check that:\n" +
      "    • Your Figma file has a Variables panel with collections\n" +
      "    • Your PAT has the 'file_variables:read' scope\n" +
      "    • Your Figma plan supports the Variables API (Professional or above)\n");
    process.exit(1);
  }

  // Index variables by id
  const variablesById = {};
  for (const v of Object.values(variables)) {
    variablesById[v.id] = v;
  }

  // Group variables by collection
  const collectionMap = {};
  for (const col of Object.values(variableCollections)) {
    collectionMap[col.id] = col;
  }

  // ── Collect token data ──
  const cssVars = {};   // cssVarName → value string
  const jsonTokens = {};
  const aliasVars = {}; // cssVarName → aliased cssVarName

  let count = 0;

  for (const variable of Object.values(variables)) {
    const collection = collectionMap[variable.variableCollectionId];
    if (!collection) continue;

    // Use the first (default) mode
    const defaultModeId = collection.defaultModeId ?? collection.modes?.[0]?.modeId;
    if (!defaultModeId) continue;

    const rawValue = variable.valuesByMode?.[defaultModeId];
    if (rawValue === undefined || rawValue === null) continue;

    const cssName = toCSSVarName(collection.name, variable.name);
    const jsonPath = toJsonPath(variable.name);

    // Check if this is an alias
    if (rawValue?.type === "VARIABLE_ALIAS") {
      const refVar = variablesById[rawValue.id];
      if (refVar) {
        const refCSSName = toCSSVarName(
          collectionMap[refVar.variableCollectionId]?.name ?? "",
          refVar.name
        );
        aliasVars[cssName] = refCSSName;
        cssVars[cssName] = `var(${refCSSName})`;
        setNestedJson(jsonTokens, jsonPath, `var(${refCSSName})`);
        count++;
        continue;
      }
    }

    // Resolve the actual value
    const resolved = resolveValue(rawValue, variablesById, defaultModeId);
    const cssValue = formatCSSValue(resolved, variable.resolvedType ?? variable.type);
    if (!cssValue) continue;

    cssVars[cssName] = cssValue;
    setNestedJson(jsonTokens, jsonPath, cssValue);
    count++;

    // Also emit an -rgb companion for COLOR tokens (useful for rgba() in CSS)
    if (variable.resolvedType === "COLOR" && resolved && rawValue?.type !== "VARIABLE_ALIAS") {
      const { r, g, b, a = 1 } = resolved;
      if (a >= 0.999) {
        const rgbName = `${cssName}-rgb`;
        const rgbValue = toRgbStr(r, g, b);
        cssVars[rgbName] = rgbValue;
      }
    }
  }

  console.log(`✅  Processed ${count} variables from ${Object.values(variableCollections).length} collections.\n`);

  // ── Log collections summary ──
  for (const col of Object.values(variableCollections)) {
    const vars = Object.values(variables).filter(
      (v) => v.variableCollectionId === col.id
    );
    console.log(`   📦  ${col.name}  (${vars.length} variables)`);
  }
  console.log();

  // ── Generate CSS ──────────────────────────────────────────────
  const now = new Date().toISOString().split("T")[0];
  const cssLines = [
    `/**`,
    ` * Intelinair Design System — Design Tokens`,
    ` * Auto-generated by figma-sync on ${now}`,
    ` * Source: Figma "Variable Design System" — file ${FILE_KEY}`,
    ` *`,
    ` * ⚠️  DO NOT EDIT MANUALLY — run \`npm run sync\` to regenerate`,
    ` */`,
    ``,
    `:root {`,
  ];

  let lastCollection = null;
  for (const [varName, value] of Object.entries(cssVars)) {
    // Detect collection boundary for section comments
    // (Heuristic: group by first segment of the var name)
    const segment = varName.replace("--", "").split("-")[0];
    if (segment !== lastCollection) {
      cssLines.push(``, `  /* ── ${segment.toUpperCase()} ── */`);
      lastCollection = segment;
    }
    cssLines.push(`  ${varName}: ${value};`);
  }

  cssLines.push(`}`, ``);
  const cssOutput = cssLines.join("\n");

  // ── Generate JSON ─────────────────────────────────────────────
  const jsonOutput = JSON.stringify(jsonTokens, null, 2) + "\n";

  // ── Generate TypeScript ───────────────────────────────────────
  const tsLines = [
    `/**`,
    ` * Intelinair Design System — Design Tokens`,
    ` * Auto-generated by figma-sync on ${now}`,
    ` * Source: Figma "Variable Design System" — file ${FILE_KEY}`,
    ` *`,
    ` * ⚠️  DO NOT EDIT MANUALLY — run \`npm run sync\` to regenerate`,
    ` */`,
    ``,
    `/** All CSS custom property names in the design system */`,
    `export const cssVars = {`,
  ];

  for (const [varName, value] of Object.entries(cssVars)) {
    // Convert --color-brand-500 → colorBrand500
    const camelKey = varName
      .replace(/^--/, "")
      .replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    tsLines.push(`  /** \`${value}\` */`);
    tsLines.push(`  ${camelKey}: "${varName}",`);
  }

  tsLines.push(
    `} as const;`,
    ``,
    `export type CSSVarKey = keyof typeof cssVars;`,
    `export type CSSVarName = (typeof cssVars)[CSSVarKey];`,
    ``,
    `/** Convenience: get a CSS var() reference string by token key */`,
    `export function token(key: CSSVarKey): string {`,
    `  return \`var(\${cssVars[key]})\`;`,
    `}`,
    ``,
    `/** Raw token values (from Figma default mode) */`,
    `export const tokens = ${JSON.stringify(jsonTokens, null, 2)} as const;`,
    ``
  );

  const tsOutput = tsLines.join("\n");

  // ── Write or print ────────────────────────────────────────────
  if (isDryRun) {
    console.log("─── DRY RUN: tokens.css (first 40 lines) ───────────────────");
    console.log(cssOutput.split("\n").slice(0, 40).join("\n"));
    console.log("\n─── DRY RUN: tokens.json (first 30 lines) ──────────────────");
    console.log(jsonOutput.split("\n").slice(0, 30).join("\n"));
    console.log("\n─── DRY RUN: tokens.ts (first 20 lines) ────────────────────");
    console.log(tsOutput.split("\n").slice(0, 20).join("\n"));
    console.log("\n✅  Dry run complete. No files written.\n");
  } else {
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(CSS_PATH, cssOutput, "utf8");
    fs.writeFileSync(JSON_PATH, jsonOutput, "utf8");
    fs.writeFileSync(TS_PATH, tsOutput, "utf8");
    console.log(`📄  ${path.relative(process.cwd(), CSS_PATH)}`);
    console.log(`📄  ${path.relative(process.cwd(), JSON_PATH)}`);
    console.log(`📄  ${path.relative(process.cwd(), TS_PATH)}`);
    console.log(`\n✅  Done! Token files updated.\n`);
  }
}

main().catch((err) => {
  console.error("\n❌  Sync failed:", err.message);
  process.exit(1);
});
