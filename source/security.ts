import { define, ALL, a, C, R, D, brackets } from "./_lib.ts";

const SHIELD = "M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z";
const BR = brackets();

export default define("security", ALL, [
  ["lock", "secure private password padlock", [R(5, 10.5, 14, 10, 2.5), "M8 10.5V8a4 4 0 0 1 8 0v2.5", a("M12 14.5v2")]],
  ["unlock", "open unlocked padlock", [R(5, 10.5, 14, 10, 2.5), "M8 10.5V8a4 4 0 0 1 7.75-1.4", a("M12 14.5v2")]],
  ["key", "password access login", [a(C(8, 15, 4.5)), "M11.2 11.8 20 3", "M17 6l2.5 2.5", "M14.5 8.5l2 2"]],
  ["shield", "protection security defense", [SHIELD, a(D(12, 11.5))]],
  ["shield-half", "protection partial security", [SHIELD, a("M12 3v18")]],
  ["fingerprint", "biometric touch identity", ["M12 11v3.5a5 5 0 0 1-1.5 3.5", a("M8 12a4 4 0 0 1 8 0v2"), "M5 12a7 7 0 0 1 14 0v.5", "M16 17.5l-.5 2", "M8.2 17.8a7 7 0 0 1-1.2-2.3", "M6 6.5a8.5 8.5 0 0 1 12 0"]],
  ["scan-user", "face id identity scan recognition", [BR, C(12, 10, 2.5), a("M7.75 16.75a4.25 4.25 0 0 1 8.5 0")]],
  ["scan-face", "face id recognition biometric", [BR, D(9, 10) + D(15, 10), a("M9 14.5a3.5 3.5 0 0 0 6 0")]],
  ["scan-box", "3d ar cube scan", [BR, "m12 7.5 4 2.25v4.5L12 16.5l-4-2.25v-4.5z", a("m8 9.75 4 2.25 4-2.25M12 12v4.5")]],
  ["scan-line", "scanner barcode read", [BR, a("M3.5 12h17")]],
  ["qr-code", "scan code link", [R(3.5, 3.5, 6.5, 6.5, 1.5), R(14, 3.5, 6.5, 6.5, 1.5), R(3.5, 14, 6.5, 6.5, 1.5), a("M14 14h2.5v2.5H14z"), "M20.5 14v6.5H17"]],
  ["barcode", "scan product sku", ["M4 5v14", "M7.5 5v14", a("M11 5v14"), "M14 5v14", "M16.5 5v14", "M20 5v14"]],
  ["bug", "issue error defect insect", [R(7, 7.5, 10, 12.5, 5), a("M9 7.5a3 3 0 0 1 6 0"), "M12 11.5v8.5", "M7 11H3.5M7 15H3.5M17 11h3.5M17 15h3.5", "M9.5 5 8 3.5M14.5 5 16 3.5"]],
  ["firewall", "wall brick protection network", [R(3, 4, 18, 16, 2.5), "M3 9.3h18M3 14.7h18", a("M12 4v5.3"), "M8 9.3v5.4M16 9.3v5.4", "M12 14.7V20"]],
  ["radar", "scan detect sonar", [C(12, 12, 9), C(12, 12, 5), a("M12 12 18.4 5.6")]],
  ["siren", "alarm emergency alert police", ["M6.5 18v-5.5a5.5 5.5 0 0 1 11 0V18", R(4, 18, 16, 2.5, 1), a("M12 3v1.5M4.4 6l1.06 1.06M19.6 6l-1.06 1.06")]],
  ["vault", "safe bank secure storage", [R(3.5, 3.5, 17, 15.5, 3), a(C(12, 11.25, 3.5)), "M7 19v1.5M17 19v1.5"]],
  ["password", "pin code asterisk field", [R(2.5, 7, 19, 10, 3), a("M7 10.5v3M5.7 11.25l2.6 1.5M8.3 11.25l-2.6 1.5"), "M12 10.5v3M10.7 11.25l2.6 1.5M13.3 11.25l-2.6 1.5", "M16 13.5h3"]],
  ["skull", "danger threat death malware", ["M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.2 4.6 3 5.8V19A1.5 1.5 0 0 0 9 20.5h6a1.5 1.5 0 0 0 1.5-1.5v-2.7c1.8-1.2 3-3.2 3-5.8A7.5 7.5 0 0 0 12 3z", a(C(9.25, 11, 1.5)), C(14.75, 11, 1.5), "M10.5 20.5V18M13.5 20.5V18"]],
  ["target", "crosshair aim focus goal", [C(12, 12, 8.5), a(C(12, 12, 2)), "M12 2v4M12 18v4M2 12h4M18 12h4"]],
  ["incognito", "private browsing anonymous spy", ["M3 11h18", "M5.5 11l1.6-5.7A1 1 0 0 1 8.1 4.5h7.8a1 1 0 0 1 1 .8L18.5 11", C(7.5, 16.5, 2.5), C(16.5, 16.5, 2.5), a("M10 16.5a2 2 0 0 1 4 0")]],
  ["key-square", "access token api key", [R(3.5, 3.5, 17, 17, 3), a(C(9.5, 14.5, 2.5)), "M11.3 12.7 16.5 7.5", "M14.5 9.5l1.5 1.5"]],
  ["shield-user", "account protection privacy", [SHIELD, a(C(12, 10, 2)), "M8.5 16a3.5 3.5 0 0 1 7 0"]],
  ["eye-scan", "watch monitor observe", [BR, "M6.5 12S8.5 8.5 12 8.5s5.5 3.5 5.5 3.5-2 3.5-5.5 3.5S6.5 12 6.5 12z", a(C(12, 12, 1.25))]],
  ["certificate", "diploma award license credential", [R(3, 4, 18, 13, 2.5), "M7 8.5h10", "M7 12h5", a(C(16.5, 15.5, 2.5)), "M15 17.5l-.5 3 2-1 2 1-.5-3"]],
]);
