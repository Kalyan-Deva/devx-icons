import { define, NONE, a, C, R, D } from "./_lib.ts";

const TRI = "M10.3 4.5a2 2 0 0 1 3.4 0l7.3 12.5a2 2 0 0 1-1.7 3H4.7A2 2 0 0 1 3 17z";
const SQ = R(3.5, 3.5, 17, 17, 3);

export default define("status", NONE, [
  ["info", "information about details help", [C(12, 12, 9), "M12 11v5.5", a(D(12, 7.75))]],
  ["alert-circle", "warning error attention", [C(12, 12, 9), "M12 7.5V13", a(D(12, 16.25))]],
  ["alert-triangle", "warning caution danger", [TRI, "M12 9v4.5", a(D(12, 16.5))]],
  ["help-circle", "question support faq", [C(12, 12, 9), "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6", a(D(12, 17))]],
  ["check-circle", "success done complete verified", [C(12, 12, 9), a("m8 12.5 2.75 2.75L16 10")]],
  ["x-circle", "error cancel close failed", [C(12, 12, 9), a("m9 9 6 6M15 9l-6 6")]],
  ["plus-circle", "add new create", [C(12, 12, 9), a("M12 8v8M8 12h8")]],
  ["minus-circle", "remove subtract delete", [C(12, 12, 9), a("M8 12h8")]],
  ["check-square", "checkbox done selected", [SQ, a("m8 12.5 2.75 2.75L16 10")]],
  ["x-square", "close cancel checkbox", [SQ, a("m9 9 6 6M15 9l-6 6")]],
  ["plus-square", "add new box", [SQ, a("M12 8v8M8 12h8")]],
  ["minus-square", "collapse remove box", [SQ, a("M8 12h8")]],
  ["ban", "forbidden blocked prohibited", [C(12, 12, 9), a("m5.6 5.6 12.8 12.8")]],
  ["power", "on off shutdown", ["M7.5 6a8 8 0 1 0 9 0", a("M12 3v8.5")]],
  ["zap", "lightning flash quick energy", ["M13.5 3 5 13.5h6.5L10.5 21 19 10.5h-6.5z"]],
  ["radio-button", "circle dot selected option", [C(12, 12, 9), a(C(12, 12, 3))]],
  ["check", "done tick yes confirm", ["m4.5 12.5 5 5 10-11"]],
  ["x", "close cancel remove", ["M6 6l12 12M18 6 6 18"]],
  ["plus", "add new create", ["M12 5v14M5 12h14"]],
  ["minus", "subtract remove less", ["M5 12h14"]],
  ["check-double", "read delivered seen", ["m2.5 12.5 4.5 4.5L15 8", a("m11.5 16 1 1L21 8")]],
  ["loader-circle", "loading spinner progress", ["M21 12a9 9 0 1 1-6.2-8.55"]],
  ["progress", "loading percent partial", [C(12, 12, 9), a("M12 3a9 9 0 0 1 9 9h-9z")]],
  ["badge-check", "verified approved certified", ["M12 2.8l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.9 2.7.9 2.7-2.4 1.5-.9 2.7-2.8-.2L12 19.4l-2.3-1.7-2.8.2-.9-2.7-2.4-1.5.9-2.7-.9-2.7 2.4-1.5.9-2.7 2.8.2z", a("m9 11.25 2 2 4-4")]],
  ["badge-alert", "warning notice attention", ["M12 2.8l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.9 2.7.9 2.7-2.4 1.5-.9 2.7-2.8-.2L12 19.4l-2.3-1.7-2.8.2-.9-2.7-2.4-1.5.9-2.7-.9-2.7 2.4-1.5.9-2.7 2.8.2z", "M12 7.5v4", a(D(12, 14.5))]],
  ["thumbs-up", "like approve good vote", ["M7.5 10.5v10", "M7.5 10.5 11 3.5a2.2 2.2 0 0 1 2.5 2.4L13 9.5h5.3a2 2 0 0 1 2 2.4l-1.4 7a2 2 0 0 1-2 1.6H7.5", a(R(3, 10.5, 4.5, 10, 1.5))]],
  ["thumbs-down", "dislike disapprove bad vote", ["M16.5 13.5v-10", "M16.5 13.5 13 20.5a2.2 2.2 0 0 1-2.5-2.4l.5-3.6H5.7a2 2 0 0 1-2-2.4l1.4-7a2 2 0 0 1 2-1.6h9.4", a(R(16.5, 3.5, 4.5, 10, 1.5))]],
]);
