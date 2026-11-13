import { define, ALL, a, C, R, D, E, brackets } from "./_lib.ts";

const SHIELD = "M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z";
const TRI = "M10.3 4.5a2 2 0 0 1 3.4 0l7.3 12.5a2 2 0 0 1-1.7 3H4.7A2 2 0 0 1 3 17z";
const DOC = "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z";
const FOLD = "M14 3v4a1 1 0 0 0 1 1h4";
const DB_TOP = E(10, 5.5, 6.5, 2.5);
const DB = ["M3.5 5.5v12c0 1.38 2.9 2.5 6.5 2.5s6.5-1.12 6.5-2.5v-12", "M3.5 11.5c0 1.38 2.9 2.5 6.5 2.5s6.5-1.12 6.5-2.5"];
const BR = brackets();
const t = (s: string) => `security ${s}`;

export default define("threats", ALL, [
  ["malware", t("virus infection trojan worm"), [C(12, 12, 5.5), "M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M5.6 18.4l2.5-2.5M15.9 8.1l2.5-2.5", a(D(10.25, 10.75) + D(13.5, 13.25) + D(13.75, 10.25))]],
  ["ransomware", t("extortion encrypted locked money"), [R(5, 10.5, 14, 10, 2.5), "M8 10.5V8a4 4 0 0 1 8 0v2.5", a("M13.5 13.75c0-.6-.7-1-1.5-1s-1.5.4-1.5 1 .7.9 1.5 1 1.5.4 1.5 1-.7 1-1.5 1-1.5-.4-1.5-1M12 12v.75M12 17.75v.75")]],
  ["phishing", t("scam email hook lure"), [R(3, 3.5, 8.5, 6, 1.5), "m3.5 4.5 3.75 2.5 3.75-2.5", "M17 3v4", a("M17 7v6.5a4.5 4.5 0 0 1-9 0v-1.5l2 1.5")]],
  ["hacker", t("attacker hooded threat actor anonymous"), ["M4.5 20.5v-2a7.5 7.5 0 0 1 3.4-6.3A5 5 0 0 1 12 3.5a5 5 0 0 1 4.1 8.7 7.5 7.5 0 0 1 3.4 6.3v2", a("M9.5 9.5h5")]],
  ["exploit", t("vulnerability crack broken defence"), [SHIELD, a("M12 3.5l-1.5 4.5 3 2.5-2.5 4 1 6")]],
  ["payload", t("malicious package charge"), ["M12 3 20 7.5v9L12 21l-8-4.5v-9z", "M4 7.5l8 4.5 8-4.5", "M12 12v9", a("m16.5 11.5-2 3h2.5l-2 3")]],
  ["backdoor", t("hidden access entry door"), ["M5.5 20.5V5A1.5 1.5 0 0 1 7 3.5h10A1.5 1.5 0 0 1 18.5 5v15.5", "M3.5 20.5h17", a("M8 12h6M11.5 9.5 14 12l-2.5 2.5")]],
  ["botnet", t("zombie network bots command control"), [a(R(9, 9.5, 6, 5, 1.5)), C(4.5, 5, 1.5), C(19.5, 5, 1.5), C(4.5, 19, 1.5), C(19.5, 19, 1.5), "M5.6 6.1 9 9.5M18.4 6.1 15 9.5M5.6 17.9 9 14.5M18.4 17.9 15 14.5"]],
  ["ddos", t("denial of service flood traffic attack"), [R(11.5, 4.5, 9, 15, 2.5), "M14.5 9h3M14.5 15h3", a("M3 8h5.5M7 6.5 8.5 8 7 9.5M3 12h5.5M7 10.5 8.5 12 7 13.5M3 16h5.5M7 14.5 8.5 16 7 17.5")]],
  ["sql-injection", t("database injection attack query"), [DB_TOP, ...DB, a("M21 3l-5 5M18.75 4.25l1 1M17 6l1 1")]],
  ["xss", t("cross site scripting web attack script"), [R(3, 4, 18, 16, 3), "M3 8.5h18", a("m10 12-2 2.5 2 2.5M14 12l2 2.5-2 2.5")]],
  ["zero-day", t("unknown vulnerability unpatched 0day"), [R(3.5, 5, 17, 15.5, 3), "M3.5 10h17", "M8 3v4M16 3v4", a(E(12, 15.25, 2, 2.75))]],
  ["cve", t("vulnerability report advisory bug"), [DOC, FOLD, a(R(9.5, 11.5, 5, 6.5, 2.5)), "M8 13.5h1.5M14.5 13.5H16M8 16.5h1.5M14.5 16.5H16"]],
  ["vuln-scan", t("vulnerability scanner audit bug"), [BR, a(R(9, 9, 6, 8, 3)), "M7.5 11.5H9M15 11.5h1.5M7.5 14.5H9M15 14.5h1.5", "M10.5 9V7.5M13.5 9V7.5"]],
  ["pentest", t("penetration test red team target"), [SHIELD, a(C(12, 11.5, 3)), "M12 6.5v2M12 14.5v2M7 11.5h2M15 11.5h2"]],
  ["intrusion-detection", t("ids monitor watch network wall"), [R(3, 5, 18, 14, 2.5), "M3 12h4M17 12h4", a("M8 12s1.5-2.5 4-2.5 4 2.5 4 2.5-1.5 2.5-4 2.5S8 12 8 12z"), D(12, 12)]],
  ["honeypot", t("decoy trap deception canary"), ["M7 7h10", "M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7", "M6.5 7.5C5 9 4.5 10.5 4.5 13c0 4.5 3 7.5 7.5 7.5s7.5-3 7.5-7.5c0-2.5-.5-4-2-5.5", a(R(8.5, 11.5, 7, 4.5, 1))]],
  ["sandbox", t("isolation detonation analysis container"), ["M3.5 7.5v-1a3 3 0 0 1 3-3h1", "M10.5 3.5h3", "M16.5 3.5h1a3 3 0 0 1 3 3v1", "M20.5 10.5v3", "M20.5 16.5v1a3 3 0 0 1-3 3h-1", "M13.5 20.5h-3", "M7.5 20.5h-1a3 3 0 0 1-3-3v-1", "M3.5 13.5v-3", a(R(9.5, 9.5, 5, 6, 2.5))]],
  ["data-leak", t("exfiltration breach spill database"), [DB_TOP, ...DB, a("M19.5 13.5s-2 2.2-2 3.7a2 2 0 0 0 4 0c0-1.5-2-3.7-2-3.7z")]],
  ["breach", t("compromise break wall hole"), [R(3, 4, 18, 16, 2.5), "M3 9.3h6.5M15 9.3h6M3 14.7h6M15.5 14.7H21", a("M12 4l-2 5.3 3 2.5-2.5 3 1.5 5.2")]],
  ["threat", t("danger risk warning attack"), [TRI, a("m12.75 8.5-2.25 3.75h3L11.25 16")]],
  ["insider-threat", t("insider employee masked user"), [C(12, 8, 4), "M4.5 20a7.5 7.5 0 0 1 15 0", a("M7.5 7.5h9")]],
  ["attack-path", t("kill chain lateral movement route"), [C(5, 19, 2), C(9.5, 11, 2), C(16, 15, 2), a(C(18.5, 5.5, 2.5)), "M6 17.25l2.5-4.5M11.25 12l3 2", "M17 13.1l1-5"]],
  ["keylogger", t("keystroke capture spyware keyboard"), [R(2.5, 10, 19, 10, 2.5), D(6.5, 13.5) + D(10, 13.5) + D(14, 13.5) + D(17.5, 13.5), "M8 17h8", a("M8 6S9.8 4 12 4s4 2 4 2-1.8 2-4 2-4-2-4-2z")]],
]);
