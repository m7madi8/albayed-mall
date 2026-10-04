import gsapSource from "./gsap-source";
import {
  DARK,
  FLIP,
  NATURAL_DURATION,
  POST_L,
  POST_R,
  RUNGS,
  TEXT_OFFSET,
  VIEWBOX,
  YELLOW,
} from "./geometry";

export const LOADER_MESSAGE_SOURCE = "mall-logo-loader";

export type LoaderMessage = { source: typeof LOADER_MESSAGE_SOURCE; type: "ready" | "complete" };

export interface LoaderHtmlOptions {
  duration: number;
  delay: number;
  accent: string;
  dark: string;
  label: string;
}

const letter = (key: string, fill: string, body: string) =>
  `<g data-k="L${key}" transform="translate(0 ${TEXT_OFFSET})" fill="${fill}">${body}</g>`;

const flipped = (...paths: string[]) =>
  `<g transform="${FLIP}">${paths.map((d) => `<path d="${d}"/>`).join("")}</g>`;

function buildSvg({ accent, dark, label }: LoaderHtmlOptions) {
  const { x, y, width, height } = VIEWBOX;
  const rungs = RUNGS.map(
    ([, , ry, rh], i) => `<rect data-k="rung${i}" x="525" y="${ry}" width="0" height="${rh}"/>`
  ).join("");

  // Every mask starts closed in the markup so the finished logo never flashes before GSAP runs.
  return `
<svg role="img" aria-label="${label}" viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMid meet" shape-rendering="geometricPrecision">
  <defs>
    <clipPath id="canopy">
      <rect data-k="beam" x="537" y="250" width="0" height="32"/>
      <rect data-k="legs" x="322" y="252" width="430" height="0"/>
    </clipPath>
    <clipPath id="cart">
      <rect data-k="hbar" x="567" y="290" width="0" height="37"/>
      <rect data-k="sides" x="322" y="324" width="492" height="0"/>
    </clipPath>
    <clipPath id="lattice">
      <polygon data-k="postL" points="${POST_L.from}"/>
      <polygon data-k="postR" points="${POST_R.from}"/>
      ${rungs}
    </clipPath>
    <clipPath id="ringL"><circle data-k="ringLClip" cx="470.45" cy="605.6" r="0"/></clipPath>
    <clipPath id="ringR"><circle data-k="ringRClip" cx="578.65" cy="605.6" r="0"/></clipPath>
    <clipPath id="text"><rect x="130" y="645" width="850" height="191"/></clipPath>
  </defs>
  <g data-k="camera" stroke="none">
    <g clip-path="url(#canopy)" fill="${dark}">${flipped(DARK.canopy)}</g>
    <g clip-path="url(#cart)" fill="${accent}"><path d="${YELLOW.cart}"/></g>
    <g clip-path="url(#lattice)" fill="${dark}">${flipped(DARK.lattice)}</g>
    <g clip-path="url(#ringL)" fill="${dark}"><g data-k="ringLG">${flipped(DARK.ringL)}</g></g>
    <g clip-path="url(#ringR)" fill="${dark}"><g data-k="ringRG">${flipped(DARK.ringR)}</g></g>
    <g clip-path="url(#text)">
      ${letter("AL1", accent, `<path d="${YELLOW.A}"/>`)}
      ${letter("AL2", accent, `<path d="${YELLOW.L}"/>`)}
      ${letter("B", dark, flipped(DARK.B))}
      ${letter("A", dark, flipped(DARK.A))}
      ${letter("Y", dark, flipped(DARK.Y1, DARK.Y2, DARK.Y3))}
      ${letter("E", dark, flipped(DARK.E))}
      ${letter("D", dark, flipped(DARK.D))}
    </g>
  </g>
</svg>`;
}

function buildTimelineScript({ duration, delay }: LoaderHtmlOptions) {
  const config = JSON.stringify({
    natural: NATURAL_DURATION,
    textOffset: TEXT_OFFSET,
    duration,
    delay,
    postL: POST_L,
    postR: POST_R,
    rungs: RUNGS,
    source: LOADER_MESSAGE_SOURCE,
  });

  return `
(function () {
  var C = ${config};
  function send(type) {
    var msg = JSON.stringify({ source: C.source, type: type });
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg);
    else if (window.parent && window.parent !== window) window.parent.postMessage(msg, "*");
  }

  var root = document.querySelector("svg");
  var q = gsap.utils.selector(root);
  function k(n) { return q('[data-k="' + n + '"]'); }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tl = gsap.timeline({ paused: true, delay: C.delay, onComplete: function () { send("complete"); } });

  /* canopy: beam laid centre-out, columns rise */
  tl.fromTo(k("beam"), { attr: { x: 537, width: 0 } }, { attr: { x: 322, width: 430 }, duration: 0.6, ease: "power3.inOut" }, 0);
  tl.fromTo(k("legs"), { attr: { y: 252, height: 0 } }, { attr: { y: 198, height: 54 }, duration: 0.4, ease: "power3.out" }, 0.35);

  /* cart: handle wipes out from the centre, sides are built downward to the wheel arches */
  tl.fromTo(k("hbar"), { attr: { x: 567, width: 0 } }, { attr: { x: 322, width: 492 }, duration: 0.55, ease: "power3.inOut" }, 0.3);
  tl.fromTo(k("sides"), { attr: { height: 0 } }, { attr: { height: 262 }, duration: 0.7, ease: "power3.inOut" }, 0.65);

  /* lattice: posts follow their true slant, rungs like floors */
  tl.fromTo(k("postL"), { attr: { points: C.postL.from } }, { attr: { points: C.postL.to }, duration: 0.65, ease: "power2.inOut" }, 0.6);
  tl.fromTo(k("postR"), { attr: { points: C.postR.from } }, { attr: { points: C.postR.to }, duration: 0.65, ease: "power2.inOut" }, 0.64);
  C.rungs.forEach(function (r, i) {
    tl.fromTo(k("rung" + i), { attr: { x: 525, width: 0 } }, { attr: { x: r[0], width: r[1] }, duration: 0.45, ease: "power3.out" }, 0.85 + i * 0.1);
  });

  /* wheels: aperture */
  [["ringL", 1.1, "470.45 605.6"], ["ringR", 1.22, "578.65 605.6"]].forEach(function (w) {
    tl.fromTo(k(w[0] + "Clip"), { attr: { r: 0 } }, { attr: { r: 50 }, duration: 0.5, ease: "power3.out" }, w[1]);
    tl.fromTo(k(w[0] + "G"), { scale: 0.94, svgOrigin: w[2] }, { scale: 1, svgOrigin: w[2], duration: 0.65, ease: "power3.out" }, w[1]);
  });

  /* wordmark: A L B A Y E D rise out of the baseline mask */
  tl.fromTo(
    ["AL1", "AL2", "B", "A", "Y", "E", "D"].map(function (l) { return k("L" + l)[0]; }),
    { y: C.textOffset },
    { y: 0, duration: 0.75, ease: "power4.out", stagger: 0.06 },
    1.25
  );

  /* whole mark: slow push-in landing exactly on scale 1, then a still hold */
  tl.fromTo(k("camera"), { scale: 0.965, svgOrigin: "547 515" }, { scale: 1, svgOrigin: "547 515", duration: 2.3, ease: "power2.out" }, 0);

  tl.to({}, { duration: 0.001 }, C.natural - 0.001);
  tl.timeScale(C.natural / Math.max(0.6, C.duration));

  send("ready");

  if (reduce) {
    tl.progress(1, true);
    gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out", delay: C.delay, onComplete: function () { send("complete"); } });
  } else {
    tl.play();
  }
})();`;
}

export function buildLoaderHtml(options: LoaderHtmlOptions) {
  const safeGsap = gsapSource.replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
<style>
  html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: transparent; overflow: hidden; }
  svg { display: block; width: 100%; height: 100%; overflow: visible; }
</style>
</head>
<body>
${buildSvg(options)}
<script>${safeGsap}</script>
<script>${buildTimelineScript(options)}</script>
</body>
</html>`;
}
