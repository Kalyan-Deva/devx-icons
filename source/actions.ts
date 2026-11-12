import { define, ALL, NONE, a, C, R, D } from "./_lib.ts";

const LID = "M4 6.5h16";
const HANDLE = "M9 6.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1.5";
const BIN = "m6 6.5.9 12.6A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 6.5";
const TRAY = "M4 16.5v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2";

export default define("actions", ALL, [
  ["trash", "delete remove bin garbage", [LID, a(HANDLE), BIN], { sf: ["M6 6.5h12l-.9 12.6a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9z"] }],
  ["trash-lines", "delete remove bin garbage", [LID, HANDLE, BIN, a("M10 11v5.5M14 11v5.5")], { sf: ["M6 6.5h12l-.9 12.6a2 2 0 0 1-2 1.9H8.9a2 2 0 0 1-2-1.9z"] }],
  ["download", "save export get tray", [a("M12 3.5V15M7 10l5 5 5-5"), TRAY], { v: NONE }],
  ["upload", "import send put tray", [a("M12 15V3.5M7 8.5l5-5 5 5"), TRAY], { v: NONE }],
  ["import", "bring in load file", ["M15 3.5h3a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5h-3", a("M3.5 12H14M10 8l4 4-4 4")], { v: NONE }],
  ["export", "send out file share", ["M9 3.5H6A2.5 2.5 0 0 0 3.5 6v12A2.5 2.5 0 0 0 6 20.5h3", a("M10 12h10.5M16.5 8l4 4-4 4")], { v: NONE }],
  ["edit-box", "write compose pencil square", ["M11 4.5H6.5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V13", a("M18.1 3.4a2 2 0 0 1 2.8 2.8L12.5 14.6l-3.5 1 1-3.5z")]],
  ["pin", "pushpin attach stick", ["M9 3.5h6", "M10 3.5v5L7 12v2h10v-2l-3-3.5v-5", a("M12 14v6.5")]],
  ["grip-vertical", "drag handle reorder move", [D(9, 6) + D(9, 12) + D(9, 18), a(D(15, 6) + D(15, 12) + D(15, 18))], { v: NONE }],
  ["grip-horizontal", "drag handle reorder move", [D(6, 9) + D(12, 9) + D(18, 9), a(D(6, 15) + D(12, 15) + D(18, 15))], { v: NONE }],
  ["paste", "clipboard insert", ["M15 4.5h2a2 2 0 0 1 2 2V10", "M9 4.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h3", R(9, 3, 6, 3, 1), a(R(13, 13, 7, 8, 2))]],
  ["cut", "scissors clip trim", [C(6.5, 17.5, 2.5), C(17.5, 17.5, 2.5), a("M8.4 15.6 16 4"), "M15.6 15.6 12.9 11.6", "M11.1 8.9 8 4"]],
  ["select", "selection cursor marquee", ["M3.5 7.5v-1a3 3 0 0 1 3-3h1", "M10.5 3.5h3", "M16.5 3.5h1a3 3 0 0 1 3 3v1", "M20.5 10.5v2", "M3.5 10.5v3", "M3.5 16.5v1a3 3 0 0 0 3 3h1", "M10.5 20.5h2", a("m14 14 7 2.5-3 1.5-1.5 3z")], { v: NONE }],
  ["reset", "restore default revert", ["M3.5 12a8.5 8.5 0 1 0 2.5-6", a("M3.5 4v4.5H8")]],
  ["sync", "synchronise cloud update", ["M20 12a8 8 0 0 1-14.3 4.9", "M4 12a8 8 0 0 1 14.3-4.9", a("M18.5 3v4.5H14"), "M5.5 21v-4.5H10"]],
  ["power-off", "shutdown turn off", ["M7.5 6a8 8 0 1 0 9 0", a("M12 3v8.5")], { v: NONE }],
  ["send-later", "schedule message delay", ["M21 3l-6.5 18-4-7.5-7.5-4z", a(C(17, 17, 3)), "M17 15.75V17l.9.6"], { v: NONE }],
  ["mark-read", "envelope open read done", ["M3.5 10l8.5-6 8.5 6v8a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18z", a("m9 13.5 2 2 4-4")], { v: NONE }],
]);
