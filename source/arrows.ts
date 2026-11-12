import { define, NONE, a, C, dirs, mirror, type Entry } from "./_lib.ts";

const undo: Entry = ["undo", "back revert history", [a("M9 14.5 4.5 10 9 5.5"), "M4.5 10h10a5 5 0 0 1 0 10H11"]];
const reply: Entry = ["reply", "respond answer message back", [a("M9.5 6 4 11.5 9.5 17"), "M4 11.5h9a7 7 0 0 1 7 7v1"]];
const rotateCw: Entry = ["rotate-cw", "clockwise redo spin turn", ["M20 12a8 8 0 1 1-2.34-5.66", a("M20 4.5v4h-4")]];
const trendUp: Entry = ["trending-up", "growth chart increase stocks", ["M3.5 16.5 9 11l4 4 7.5-7.5", a("M15 7.5h5.5V13")]];
const sortAsc: Entry = ["sort-ascending", "order a-z increase", ["M4 6.5h8", "M4 12h6", "M4 17.5h4", a("M17.5 19V5"), a("M14 8.5l3.5-3.5L21 8.5")]];
const cornerDR: Entry = ["corner-down-right", "turn return enter", ["M5 4.5V11a3 3 0 0 0 3 3h11", a("m15 10 4 4-4 4")]];

export default define("arrows", NONE, [
  ...dirs("arrow", "direction pointer move", ["M4.5 12h15", a("M13.5 6l6 6-6 6")]),
  ["arrow-up-right", "diagonal external direction", ["M6.5 17.5l11-11", a("M8.5 6.5h9v9")]],
  mirror(["arrow-up-right", "", ["M6.5 17.5l11-11", a("M8.5 6.5h9v9")]], "arrow-up-left", "diagonal direction"),
  mirror(["arrow-up-right", "", ["M6.5 17.5l11-11", a("M8.5 6.5h9v9")]], "arrow-down-right", "diagonal direction", "y"),
  mirror(mirror(["arrow-up-right", "", ["M6.5 17.5l11-11", a("M8.5 6.5h9v9")]], "x", ""), "arrow-down-left", "diagonal direction", "y"),
  ...dirs("chevron", "caret direction expand collapse", ["m9 6 6 6-6 6"]),
  ...dirs("chevrons", "double caret fast skip", ["m5.5 6 6 6-6 6", a("m12.5 6 6 6-6 6")]),
  ...dirs("arrow-circle", "direction round button", [C(12, 12, 9), "M7.5 12h8", a("m12.5 8.5 3.5 3.5-3.5 3.5")]),
  ...dirs("square-arrow", "exit redirect share box", ["M20.5 8.5v-2a3 3 0 0 0-3-3h-11a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-2", "M8.5 16v-1.5A2.5 2.5 0 0 1 11 12h10", a("M18 9l3 3-3 3")]),
  ...dirs("arrow-to-line", "end last skip", ["M3.5 12H16", a("m11 7 5 5-5 5"), "M20.5 5v14"]),
  ...dirs("arrow-from-line", "start first begin", ["M3.5 5v14", "M8 12h12.5", a("m15.5 7 5 5-5 5")]),
  ["log-in", "sign in enter login", ["M14.5 3.5h3a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-3", "M3.5 12H14", a("m10 8 4 4-4 4")]],
  ["log-out", "sign out exit leave logout", ["M9.5 3.5h-3a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h3", "M9 12h11", a("m16.5 8 4 4-4 4")]],
  cornerDR,
  mirror(cornerDR, "corner-down-left", "turn return enter"),
  mirror(cornerDR, "corner-up-right", "turn return", "y"),
  mirror(mirror(cornerDR, "x", ""), "corner-up-left", "turn return", "y"),
  rotateCw,
  mirror(rotateCw, "rotate-ccw", "counterclockwise undo spin turn"),
  ["refresh", "reload sync update cycle", ["M4.5 10a7.5 7.5 0 0 1 13.5-3.5l2 2.5", a("M20 4.5v4h-4"), "M19.5 14a7.5 7.5 0 0 1-13.5 3.5l-2-2.5", "M4 19.5v-4h4"]],
  undo,
  mirror(undo, "redo", "forward repeat history"),
  ["repeat", "loop cycle again", ["M4 11.5v-2a4 4 0 0 1 4-4h12", a("m17 2.5 3 3-3 3"), "M20 12.5v2a4 4 0 0 1-4 4H4", "m7 21.5-3-3 3-3"]],
  ["shuffle", "random mix crossing", ["M3.5 7H7c3 0 4 2.5 5 5s2 5 5 5h3.5", "M3.5 17H7c1.4 0 2.4-.55 3.1-1.35", "M13.9 8.35C14.6 7.55 15.6 7 17 7h3.5", a("m17.5 4 3 3-3 3"), "m17.5 14 3 3-3 3"]],
  ["swap", "exchange switch horizontal transfer", ["M4 8h15", a("m15.5 4.5 3.5 3.5-3.5 3.5"), "M20 16H5", "m8.5 12.5-3.5 3.5 3.5 3.5"]],
  ["swap-vertical", "exchange switch sort", ["M8 20V5", a("M4.5 8.5 8 5l3.5 3.5"), "M16 4v15", "m12.5 15.5 3.5 3.5 3.5-3.5"]],
  ["move", "drag position pan arrows", ["M12 3v18M3 12h18", "m9 5.5 3-3 3 3", "m9 18.5 3 3 3-3", "m5.5 9-3 3 3 3", a("m18.5 9 3 3-3 3")]],
  ["external-link", "open new tab outside", ["M19.5 13.5v4a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3h4", a("M19.5 4.5l-8 8"), "M14 4.5h5.5V10"]],
  sortAsc,
  mirror(sortAsc, "sort-descending", "order z-a decrease", "y"),
  trendUp,
  mirror(trendUp, "trending-down", "decline chart decrease loss", "y"),
  reply,
  mirror(reply, "forward", "send share pass on"),
  ["reply-all", "respond everyone", [a("M8 6 2.5 11.5 8 17"), "M12.5 6 7 11.5l5.5 5.5", "M7 11.5h6a7 7 0 0 1 7 7v1"]],
  ["arrow-down-to-line", "download save bottom", ["M12 4v11", a("m7 10.5 5 5 5-5"), "M5 20h14"]],
  ["arrow-up-from-line", "upload share top", ["M12 20V9", a("m7 13.5 5-5 5 5"), "M5 4h14"]],
  ["expand-vertical", "unfold grow height", ["M12 3.5v17", a("m8.5 7 3.5-3.5L15.5 7"), "m8.5 17 3.5 3.5 3.5-3.5"]],
  ["collapse-vertical", "fold shrink height", ["M12 3.5V9M12 15v5.5", a("m8.5 5.5 3.5 3.5 3.5-3.5"), "m8.5 18.5 3.5-3.5 3.5 3.5", "M5 12h14"]],
  ["u-turn", "return back around", ["M7.5 20V9.5a5 5 0 0 1 10 0V15", a("m14 11.5 3.5 3.5 3.5-3.5")]],
  ["arrow-big-right", "next proceed bold", ["M4 9.5h7.5V5l8.5 7-8.5 7v-4.5H4z"]],
]);
