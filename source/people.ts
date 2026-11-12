import { define, ALL, a, C, R, D } from "./_lib.ts";

export default define("people", ALL, [
  ["user", "person account profile", [a(C(12, 8, 4)), "M4.5 20a7.5 7.5 0 0 1 15 0"]],
  ["users", "people team group members", [C(9, 8, 3.5), "M2.5 20a6.5 6.5 0 0 1 13 0", a("M15 4.6a3.5 3.5 0 0 1 0 6.8"), "M17.5 14.4a6.5 6.5 0 0 1 4 5.6"]],
  ["user-circle", "avatar account profile", [C(12, 12, 9), C(12, 10, 3), a("M6.2 18.4a7 7 0 0 1 11.6 0")]],
  ["user-square", "avatar account profile", [R(3.5, 3.5, 17, 17, 3), C(12, 10, 3), a("M7 20.5a5 5 0 0 1 10 0")]],
  ["id-card", "identity badge license", [R(2.5, 5, 19, 14, 3), C(8.5, 11, 2), "M5.5 16a3 3 0 0 1 6 0", a("M14.5 10h4"), "M14.5 13.5h3"]],
  ["face-smile", "happy emoji smiley", [C(12, 12, 9), a("M8.5 14.5a4 4 0 0 0 7 0"), D(9, 9.5) + D(15, 9.5)]],
  ["face-sad", "unhappy emoji frown", [C(12, 12, 9), a("M8.5 16.5a4 4 0 0 1 7 0"), D(9, 9.5) + D(15, 9.5)]],
  ["face-neutral", "meh emoji indifferent", [C(12, 12, 9), a("M9 15.5h6"), D(9, 9.5) + D(15, 9.5)]],
  ["face-wink", "emoji playful", [C(12, 12, 9), "M8.5 14.5a4 4 0 0 0 7 0", D(9, 9.5), a("M14 9.5h2.5")]],
  ["person", "human standing body figure", [a(C(12, 4.5, 2)), "M7 9h10", "M12 9v5.5", "m9 21 3-6.5 3 6.5"]],
  ["accessibility", "a11y disability universal", [C(12, 12, 9), C(12, 7.5, 1), "M7.5 10l4.5 1 4.5-1", a("M12 11v3l-2.5 3.5M12 14l2.5 3.5")]],
  ["user-group", "community team circle", [a(C(12, 7, 3)), "M7 19a5 5 0 0 1 10 0", C(5, 10, 2), C(19, 10, 2), "M2.5 17.5a3.5 3.5 0 0 1 3-3", "M21.5 17.5a3.5 3.5 0 0 0-3-3"]],
  ["contact-card", "vcard profile business card", [R(3, 4, 18, 16, 3), C(12, 10, 2.5), a("M7.5 16.5a4.5 4.5 0 0 1 9 0")]],
  ["baby", "child infant kid", [C(12, 12, 9), a(D(9.5, 11) + D(14.5, 11)), "M10 15a2.5 2.5 0 0 0 4 0", "M12 3a2 2 0 0 0 0 4"]],
  ["user-voice", "speaker talk presenter", [C(9, 8, 4), "M2.5 20a6.5 6.5 0 0 1 13 0", a("M17 5a5 5 0 0 1 0 6.5"), "M19.5 3a8 8 0 0 1 0 10.5"]],
]);
