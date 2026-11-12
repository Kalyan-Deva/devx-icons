import { define, ALL, a, C, R, D, E } from "./_lib.ts";

const DOC = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z";
const FOLD = "M14 3v4a1 1 0 0 0 1 1h4";
const DOC_FILL = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z";
const FOLDER = "M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6a2 2 0 0 1 1.5.7L12 7.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z";

export default define("files", ALL, [
  ["file", "document page paper blank", [DOC, a(FOLD)]],
  ["file-text", "document page notes lines", [DOC, FOLD, "M8.5 9.5h2.5", a("M8.5 13h7"), "M8.5 16.5h7"]],
  ["file-code", "document source script", [DOC, FOLD, a("m10 12-2 2 2 2"), "m14 12 2 2-2 2"]],
  ["file-image", "document picture photo", [DOC, FOLD, a(C(9.5, 11.5, 1.25)), "M7.5 18l3-3.5 2 2 2-2.5 2 2.5"]],
  ["file-audio", "document sound music", [DOC, FOLD, a(C(10, 16.5, 1.75)), "M11.75 16.5v-6l3 1"]],
  ["file-video", "document movie clip", [DOC, FOLD, a("M10 11.5v5l4-2.5z")]],
  ["file-zip", "document archive compressed", [DOC, FOLD, a("M10 4.5v1.5M10 8v1.5M10 11.5V13"), R(9, 15, 2, 3, 1)]],
  ["file-chart", "document report analytics", [DOC, FOLD, "M8.5 17.5v-3", a("M12 17.5v-6"), "M15.5 17.5v-4"]],
  ["file-table", "document spreadsheet sheet", [DOC, FOLD, R(8, 11, 8, 7, 1), a("M8 14.5h8"), "M12 11v7"]],
  ["files", "documents copies stack multiple", ["M16 6.5h-6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9z", "M16 6.5v3a1 1 0 0 0 1 1h3", a("M5 16.5V5a2.5 2.5 0 0 1 2.5-2.5H13")]],
  ["folder", "directory files", [a("M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6a2 2 0 0 1 1.5.7L12 7.5"), "M12 7.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V7.5"], { sf: [FOLDER] }],
  ["folder-open", "directory browse open", ["M3 18V6.5A2 2 0 0 1 5 4.5h3.6a2 2 0 0 1 1.5.7l1.5 1.8H17a2 2 0 0 1 2 2V11", a("M3 18l2.2-5.6A2 2 0 0 1 7.1 11h13.4a1 1 0 0 1 .9 1.4l-2.4 5.7a2 2 0 0 1-1.8 1.4H4.5A1.5 1.5 0 0 1 3 18z")]],
  ["folders", "directories group multiple", ["M7 8.5A2 2 0 0 1 9 6.5h2.6a2 2 0 0 1 1.5.7l1 1.3H19a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z", a("M4 15V6a2.5 2.5 0 0 1 2.5-2.5H10")]],
  ["archive", "box storage store backup", ["M4.5 9v9a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5V9", a(R(3, 4, 18, 5, 1.5)), "M10 13h4"], { sf: ["M4.5 9h15v9a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 18z"] }],
  ["inbox", "tray mail incoming", ["M3.5 13.5 6 5.6a2 2 0 0 1 1.9-1.1h8.2a2 2 0 0 1 1.9 1.1l2.5 7.9", "M3.5 13.5V18A2.5 2.5 0 0 0 6 20.5h12a2.5 2.5 0 0 0 2.5-2.5v-4.5", a("M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5")], { sf: ["M6 5.6a2 2 0 0 1 1.9-1.1h8.2a2 2 0 0 1 1.9 1.1l2.5 7.9V18a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18v-4.5z"] }],
  ["book", "read library manual guide", ["M5 18.5v-13a2 2 0 0 1 2-2h11.5v14H7a2 2 0 0 0-2 2 2 2 0 0 0 2 2h11.5", a("M9 7.5h6")], { sf: ["M7 3.5h11.5v17H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z"] }],
  ["book-open", "read pages learning", ["M12 6.5C10.5 5 8.5 4.5 3.5 4.5v14c5 0 7 .5 8.5 2", "M12 6.5c1.5-1.5 3.5-2 8.5-2v14c-5 0-7 .5-8.5 2", a("M12 6.5v13.5")]],
  ["notebook", "journal notes diary", [R(5.5, 3, 13, 18, 2.5), a("M3.5 7.5h3M3.5 12h3M3.5 16.5h3"), "M10 8h5"]],
  ["sticky-note", "memo note reminder post-it", ["M14.5 20.5H6A2.5 2.5 0 0 1 3.5 18V6A2.5 2.5 0 0 1 6 3.5h12A2.5 2.5 0 0 1 20.5 6v8.5z", a("M14.5 20.5v-4a2 2 0 0 1 2-2h4")]],
  ["clipboard-list", "tasks checklist todo", ["M8.5 4.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-13a2 2 0 0 0-2-2h-1.5", a(R(9, 3, 6, 3, 1)), "M9 11h6", "M9 14.5h6", "M9 18h3"], { sf: [R(5, 4.5, 14, 17, 2)] }],
  ["database", "storage data sql records", [a(E(12, 5.5, 7.5, 2.5)), "M4.5 5.5v13c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5v-13", "M4.5 12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5"], { sf: ["M4.5 5.5c0-1.38 3.36-2.5 7.5-2.5s7.5 1.12 7.5 2.5v13c0 1.38-3.36 2.5-7.5 2.5s-7.5-1.12-7.5-2.5z"] }],
  ["save", "floppy disk store", ["M5.5 3.5h10l5 5v10a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z", a("M7.5 3.5v4h7v-4"), "M7.5 20.5v-6h9v6"]],
  ["receipt", "bill invoice purchase", ["M5.5 3.5v17l2-1.25 2 1.25 2.5-1.25 2.5 1.25 2-1.25 2 1.25v-17z", "M9 8h6", a("M9 12h6"), "M9 16h3"]],
  ["library", "books shelf collection", ["M5 4v16", "M9 4v16", a("M13.5 4.5l4.5 15.5")]],
  ["paperclip", "attach attachment clip", ["M20 11.5l-7.8 7.8a5 5 0 0 1-7.07-7.07l8.5-8.5a3.33 3.33 0 0 1 4.71 4.71l-8.5 8.5a1.67 1.67 0 0 1-2.36-2.36L15 7"]],
  ["document-scan", "scanner scan paper", ["M3.5 8V6.5a3 3 0 0 1 3-3H8", "M16 3.5h1.5a3 3 0 0 1 3 3V8", "M20.5 16v1.5a3 3 0 0 1-3 3H16", "M8 20.5H6.5a3 3 0 0 1-3-3V16", a("M3.5 12h17"), "M8 8.5h8", "M8 15.5h5"]],
  ["file-signature", "contract sign agreement", [DOC, FOLD, a("M8 17c1-1.5 1.8-2.5 2.5-2.5 1 0 .2 2.5 1.2 2.5.8 0 1.3-1 2.3-1h1")]],
  ["file-dashed", "draft document template", ["M14 3H12", "M9.5 3H7a2 2 0 0 0-2 2v2.5", "M5 10.5v3", "M5 16.5V19a2 2 0 0 0 2 2h2.5", "M12.5 21h2", "M17 21a2 2 0 0 0 2-2v-2.5", "M19 13.5v-2.5", a(FOLD)], { sf: [DOC_FILL] }],
  ["bookmark-file", "saved document favourite", [DOC, FOLD, a("M9 11v6l2-1.5 2 1.5v-6z")]],
  ["file-check-lines", "approved document review", [DOC, FOLD, "M8.5 9.5h3", a(D(8.5, 13) + D(8.5, 16.5)), "M11 13h4.5", "M11 16.5h4.5"]],
]);
