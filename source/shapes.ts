import { define, ALL, NONE, a, C, R, G, D, ngon } from "./_lib.ts";

export default define("shapes", ALL, [
  ["square", "box rectangle shape", [R(3.5, 3.5, 17, 17, 3)]],
  ["circle", "round ring shape", [C(12, 12, 9)]],
  ["triangle", "shape polygon delta", ["M10.3 4.5a2 2 0 0 1 3.4 0l7.3 12.5a2 2 0 0 1-1.7 3H4.7A2 2 0 0 1 3 17z"]],
  ["hexagon", "shape polygon six", [ngon(12, 12, 9, 6)]],
  ["diamond", "rhombus shape kite", ["M10.6 3.4a2 2 0 0 1 2.8 0l7.2 7.2a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1 0-2.8z"]],
  ["octagon", "stop shape polygon", [ngon(12, 12, 9.2, 8, -67.5)]],
  ["pentagon", "shape polygon five", [ngon(12, 12.5, 9, 5)]],
  ["square-dashed", "selection marquee area", ["M3.5 7.5v-1a3 3 0 0 1 3-3h1", "M10.5 3.5h3", "M16.5 3.5h1a3 3 0 0 1 3 3v1", "M20.5 10.5v3", "M20.5 16.5v1a3 3 0 0 1-3 3h-1", "M13.5 20.5h-3", "M7.5 20.5h-1a3 3 0 0 1-3-3v-1", a("M3.5 13.5v-3")], { v: NONE }],
  ["circle-dashed", "selection loading draft", ["M12 3a9 9 0 0 1 3.2.6", "M18.4 5.6a9 9 0 0 1 2 2.9", "M21 12a9 9 0 0 1-.6 3.2", "M18.4 18.4a9 9 0 0 1-2.9 2", "M12 21a9 9 0 0 1-3.2-.6", "M5.6 18.4a9 9 0 0 1-2-2.9", "M3 12a9 9 0 0 1 .6-3.2", a("M5.6 5.6a9 9 0 0 1 2.9-2")], { v: NONE }],
  ["shapes", "geometry objects design", [C(7.5, 7.5, 4), a(R(13, 13, 7.5, 7.5, 1.5)), "M17 3.5 21 10.5h-8z"], { v: NONE }],
  ["frame", "crop artboard canvas", ["M8 3.5v17", "M16 3.5v17", "M3.5 8h17", a("M3.5 16h17")], { v: NONE }],
  ["circles", "venn overlap intersect", [C(9, 12, 5.5), a(C(15, 12, 5.5))], { v: NONE }],
  ["squares", "grid tiles blocks", [R(3.5, 3.5, 8, 8, 2), a(R(12.5, 12.5, 8, 8, 2)), D(16.5, 7.5), D(7.5, 16.5)], { v: NONE }],
  ["star-outline-half", "rating half partial", [G(12, 3.5, 14.35, 9.26, 20.56, 9.72, 15.8, 13.74, 17.29, 19.78, 12, 16.5, 6.71, 19.78, 8.2, 13.74, 3.44, 9.72, 9.65, 9.26), a("M12 3.5v13")], { v: NONE }],
]);
