import { define, NONE, SOME, a, C, R, D, mirror, type Entry } from "./_lib.ts";

const alignL: Entry = ["align-left", "text paragraph justify", ["M4 6.5h16", a("M4 12h10"), "M4 17.5h13"]];
const indent: Entry = ["indent", "text tab increase", ["M10 6.5h10", "M10 12h10", "M10 17.5h10", a("m4 9 3 3-3 3")]];

export default define("editor", NONE, [
  ["bold", "text strong format", ["M7 4.5h6a3.75 3.75 0 0 1 0 7.5H7z", a("M7 12h7a4 4 0 0 1 0 8H7z")]],
  ["italic", "text emphasis format", ["M10 4.5h8", "M6 19.5h8", a("M14.5 4.5l-5 15")]],
  ["underline", "text format line", ["M7 4v6.5a5 5 0 0 0 10 0V4", a("M5 20.5h14")]],
  ["strikethrough", "text delete format", ["M16.5 6.5c-.5-1.5-2.3-2.5-4.5-2.5-2.5 0-4.5 1.3-4.5 3.5 0 1.2.6 2.1 1.6 2.7", a("M4 12h16"), "M15.5 14.5c.6.6 1 1.4 1 2.3 0 2.2-2 3.2-4.5 3.2-2.4 0-4.4-1-5-2.8"]],
  alignL,
  ["align-center", "text paragraph centre", ["M4 6.5h16", a("M7 12h10"), "M5.5 17.5h13"]],
  mirror(alignL, "align-right", "text paragraph"),
  ["align-justify", "text paragraph block", ["M4 6.5h16", a("M4 12h16"), "M4 17.5h16"]],
  ["list-ordered", "numbered list steps", ["M10 6.5h10", "M10 12h10", "M10 17.5h10", a("M4.5 5.5 5.5 4.5v4"), "M4 15.5a1.25 1.25 0 0 1 2.5 0c0 1-2.5 2-2.5 3h2.5"]],
  ["list-checks", "todo tasks checklist", ["M11 6.5h9", "M11 12h9", "M11 17.5h9", a("m4 6.5 1.5 1.5 2.5-3"), "m4 12 1.5 1.5 2.5-3", "m4 17.5 1.5 1.5 2.5-3"]],
  ["heading", "title h1 text", ["M6 4.5v15", "M18 4.5v15", a("M6 12h12")]],
  ["type", "text font typography", ["M5 7V5h14v2", a("M12 5v14.5"), "M9 19.5h6"]],
  ["quote", "blockquote citation testimonial", ["M4.5 11.5h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-7a5 5 0 0 1 4-4.9", a("M14.5 11.5h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-7a5 5 0 0 1 4-4.9")]],
  ["pen-tool", "vector bezier design draw", ["M12 3.5 18.5 10 15 20H9L5.5 10z", a(C(12, 13, 1.75)), "M12 3.5v7.75"]],
  ["crop", "trim image resize", ["M6.5 3v12.5a2 2 0 0 0 2 2H21", a("M3 6.5h12.5a2 2 0 0 1 2 2V21")]],
  ["ruler", "measure scale length", [R(2.5, 8, 19, 8, 2), a("M7 8v3M11 8v4M15 8v3"), "M19 8v4"]],
  ["pipette", "eyedropper colour picker", ["m14.5 6.5 3 3", "M16 8 6.5 17.5 5 21l3.5-1.5L18 10", a("M14.5 6.5l2.3-2.3a2.1 2.1 0 0 1 3 3L17.5 9.5")]],
  ["palette", "colour paint design theme", ["M12 21a9 9 0 1 1 9-9c0 2.5-2 3.5-4 3.5h-1.5a1.5 1.5 0 0 0-1 2.6c.6.5.7 1.4.2 2a1.5 1.5 0 0 1-1.2.9z", D(8, 10) + D(12, 7.5), a(D(16, 10))], { v: SOME }],
  ["eraser", "remove clear delete rubber", ["m20 14-7 7H8.5L4 16.5a2 2 0 0 1 0-2.8L13.7 4a2 2 0 0 1 2.8 0L20 7.5a2 2 0 0 1 0 2.8z", a("M9.5 8.5l6 6"), "M8.5 21h12"]],
  ["highlighter", "marker emphasis text", ["m9 11-5.5 5.5L6 19h5l1.5-1.5", "M9 11l6.5-6.5a2 2 0 0 1 2.8 0l1.7 1.7a2 2 0 0 1 0 2.8L13.5 15.5z", a("M3.5 20.5h17")]],
  ["table", "grid spreadsheet data rows", [R(3.5, 4, 17, 16, 3), a("M3.5 9.5h17"), "M3.5 15h17", "M10 9.5v10.5"], { v: SOME }],
  indent,
  mirror(indent, "outdent", "text tab decrease"),
  ["text-cursor", "caret input type", ["M9 4h1.5A1.5 1.5 0 0 1 12 5.5v13a1.5 1.5 0 0 1-1.5 1.5H9", "M15 4h-1.5A1.5 1.5 0 0 0 12 5.5", "M15 20h-1.5a1.5 1.5 0 0 1-1.5-1.5", a("M9.5 12h5")]],
  ["paragraph", "pilcrow text block", ["M12.5 4v16", "M16.5 4v16", a("M19 4H10a4 4 0 0 0 0 8h2.5")]],
  ["superscript", "exponent power text", ["m4 7 8 10", "M12 7l-8 10", a("M16.5 8a1.5 1.5 0 0 1 3 0c0 1.5-3 2-3 3.5h3")]],
  ["subscript", "index text chemical", ["m4 7 8 10", "M12 7l-8 10", a("M16.5 16a1.5 1.5 0 0 1 3 0c0 1.5-3 2-3 3.5h3")]],
  ["link-2", "hyperlink url chain", ["M9 16.5H7.5a4.5 4.5 0 0 1 0-9H9", "M15 7.5h1.5a4.5 4.5 0 0 1 0 9H15", a("M8.5 12h7")]],
  ["image-text", "media caption layout", [R(3.5, 4, 8, 8, 2), a("M15 6h5.5"), "M15 10h5.5", "M3.5 15.5h17", "M3.5 19.5h11"]],
  ["word-wrap", "text flow wrap lines", ["M4 6.5h16", "M4 17.5h6", a("M4 12h13a3 3 0 0 1 0 6h-4"), "m15 20-2-2 2-2"]],
  ["sigma", "sum math formula", ["M18 5.5V4H6l6 8-6 8h12v-1.5"]],
  ["code-inline", "monospace snippet backtick", [R(2.5, 6, 19, 12, 3), a("m10 10-2 2 2 2"), "m14 10 2 2-2 2"]],
]);
