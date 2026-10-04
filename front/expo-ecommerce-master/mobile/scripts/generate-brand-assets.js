// Renders the AL BAYED mark (components/mall-logo-loader/static-svg.ts) into every app icon / logo PNG.
// Requires Microsoft Edge (or Chrome) for headless rendering. Run: npm run gen:brand
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const ts = require("typescript");

const root = path.join(__dirname, "..");
const out = (name) => path.join(root, "assets/images", name);

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  });
  module._compile(outputText, filename);
};
const { buildStaticLogoSvg } = require(path.join(root, "components/mall-logo-loader/static-svg.ts"));

const BACKGROUND = "#F8F8F5";

/** logo: share of the canvas width the mark occupies. */
const ASSETS = [
  { file: "logo.png", size: 1024, logo: 0.92, background: null },
  { file: "icon.png", size: 1024, logo: 0.78, background: BACKGROUND },
  { file: "splash-icon.png", size: 1024, logo: 0.96, background: null },
  { file: "favicon.png", size: 192, logo: 0.86, background: BACKGROUND },
  // Android adaptive icons keep content inside the central 66% safe zone.
  { file: "android-icon-foreground.png", size: 1024, logo: 0.6, background: null },
  { file: "android-icon-background.png", size: 1024, logo: 0, background: BACKGROUND },
  { file: "android-icon-monochrome.png", size: 1024, logo: 0.6, background: null, mono: "#FFFFFF" },
];

function findBrowser() {
  const candidates = [
    path.join(process.env["ProgramFiles(x86)"] || "", "Microsoft/Edge/Application/msedge.exe"),
    path.join(process.env.ProgramFiles || "", "Microsoft/Edge/Application/msedge.exe"),
    path.join(process.env.ProgramFiles || "", "Google/Chrome/Application/chrome.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ];
  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) throw new Error("Edge or Chrome is required to render brand assets.");
  return found;
}

function page({ size, logo, background, mono }) {
  const svg = logo > 0 ? buildStaticLogoSvg(mono ? { accent: mono, dark: mono } : {}) : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden;background:${background || "transparent"}}
body{display:flex;align-items:center;justify-content:center}
svg{width:${Math.round(size * logo)}px;height:auto;display:block}
</style></head><body>${svg}</body></html>`;
}

const browser = findBrowser();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "brand-assets-"));

for (const asset of ASSETS) {
  const htmlPath = path.join(tmp, `${asset.file}.html`);
  fs.writeFileSync(htmlPath, page(asset));
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--window-size=${asset.size},${asset.size}`,
    "--default-background-color=00000000",
    `--screenshot=${out(asset.file)}`,
    `file:///${htmlPath.replace(/\\/g, "/")}`,
  ], { stdio: "ignore" });
  console.log(`assets/images/${asset.file}  ${asset.size}x${asset.size}`);
}

fs.rmSync(tmp, { recursive: true, force: true });
