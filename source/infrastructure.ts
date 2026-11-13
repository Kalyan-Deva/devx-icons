import { define, ALL, a, C, R, D, ngon } from "./_lib.ts";

const SHIELD = "M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z";
const t = (s: string) => `security infrastructure ${s}`;

// cluster: heptagon with spokes
const HEPT = ngon(12, 12, 9, 7);
let spokes = "";
for (let i = 0; i < 7; i++) {
  const ang = ((-90 + (i * 360) / 7) * Math.PI) / 180;
  const p = (r: number) => `${Math.round((12 + r * Math.cos(ang)) * 100) / 100} ${Math.round((12 + r * Math.sin(ang)) * 100) / 100}`;
  spokes += `M${p(3.75)}L${p(6.5)}`;
}

export default define("infrastructure", ALL, [
  ["vpn", t("tunnel private network encrypted"), [R(2.5, 8, 6, 8, 1.5), R(15.5, 8, 6, 8, 1.5), a("M8.5 10.5h7M8.5 13.5h7")]],
  ["proxy", t("intermediary relay reverse proxy"), [C(4.5, 12, 2), a(R(9.5, 9, 5, 6, 1.5)), C(19.5, 12, 2), "M6.5 12h3M14.5 12h3"]],
  ["load-balancer", t("distribute traffic nodes"), [a(C(12, 5, 2)), C(5, 19, 2), C(12, 19, 2), C(19, 19, 2), "M12 7v10M10.9 6.7 6 17.2M13.1 6.7 18 17.2"]],
  ["cluster", t("kubernetes orchestration nodes k8s"), [HEPT, spokes, a(C(12, 12, 2))]],
  ["container-scan", t("image scanning docker vulnerability"), [R(3, 9, 18, 11, 2.5), "M7.5 12v5M12 12v5M16.5 12v5", a(C(15, 5.5, 2.5)), "m16.8 7.3 1.7 1.7"]],
  ["sbom", t("software bill of materials dependencies"), ["M7 3.5 11.5 6v5L7 13.5 2.5 11V6z", "M2.5 6 7 8.5 11.5 6M7 8.5v5", a("M14.5 5.5h6.5"), "M14.5 9.5h6.5", "M3 17h18", "M3 20.5h12"]],
  ["supply-chain", t("dependencies vendor third party link"), [R(2.5, 9, 9, 6, 3), a(R(12.5, 9, 9, 6, 3)), "M8 12h8"]],
  ["network-port", t("ethernet socket lan port"), [R(4, 4, 16, 16, 2.5), a("M8 16v-4.5h1.5V9.5h5v2H16V16z")]],
  ["packet", t("network packet frame datagram"), [R(3, 6, 18, 12, 2.5), "M3 10h18", a("M8 14h7M12.5 11.75 14.75 14l-2.25 2.25")]],
  ["log-analysis", t("logs search terminal investigate"), [R(2.5, 4, 19, 16, 3), "M6 9h7", "M6 12.5h4", a(C(15.5, 14, 2.5)), "m17.3 15.8 1.7 1.7"]],
  ["audit-log", t("audit trail records verified"), ["M4 6h10", "M4 10h10", "M4 14h6", a("M17.5 12.5 14 14v2.5c0 2 1.5 3.5 3.5 4 2-.5 3.5-2 3.5-4V14z")]],
  ["compliance", t("policy standard checklist governance"), ["M8.5 4.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-13a2 2 0 0 0-2-2h-1.5", R(9, 3, 6, 3, 1), a("M12 10 9 11.2v2c0 1.7 1.3 3 3 3.5 1.7-.5 3-1.8 3-3.5v-2z")], { sf: [R(5, 4.5, 14, 17, 2)] }],
  ["access-control", t("authorization user key permissions iam"), [C(9, 8, 3.5), "M2.5 20a6.5 6.5 0 0 1 10-5.5", a(C(17, 14, 2)), "M17 16v4.5M17 18.5h1.5"]],
  ["privacy", t("private data protection watch"), [SHIELD, a("M8.5 11s1.5-2.25 3.5-2.25S15.5 11 15.5 11 14 13.25 12 13.25 8.5 11 8.5 11z")]],
  ["incident", t("incident response alert fire"), [SHIELD, a("M12 16.5a2.5 2.5 0 0 0 2.5-2.5c0-1.6-1.2-2.4-1.8-4.4-1.2.8-1.6 1.8-1.6 2.6-.4-.2-.8-.6-1-1.2-.6.8-.6 1.6-.6 3a2.5 2.5 0 0 0 2.5 2.5z")]],
  ["siem", t("monitoring events correlation soc"), [R(3, 4, 18, 12.5, 3), "M12 16.5v3.5", "M8 20h8", a("M6 10.5h3l1.5-2.5 2.5 5 1.5-2.5H18")]],
  ["onion-routing", t("tor anonymity layers onion"), ["M12 3c-3 3-7 6-7 11a7 7 0 0 0 14 0c0-5-4-8-7-11z", a("M12 8c-2 2-3.75 4-3.75 6.25a3.75 3.75 0 0 0 7.5 0C15.75 12 14 10 12 8z")]],
  ["api-gateway", t("gateway ingress api routing"), [R(9, 3.5, 6, 17, 2), a("M2.5 9h5M5.5 7l2 2-2 2"), "M16.5 15h5M19.5 13l2 2-2 2"]],
  ["edge-network", t("cdn edge points of presence"), [C(12, 12, 4), C(4.5, 4.5, 1.5), C(19.5, 4.5, 1.5), C(4.5, 19.5, 1.5), C(19.5, 19.5, 1.5), "M5.6 5.6 9.2 9.2M18.4 5.6l-3.6 3.6M5.6 18.4l3.6-3.6M18.4 18.4l-3.6-3.6", a(D(12, 12))]],
  ["secrets-manager", t("vault secrets keys storage"), [R(3.5, 3.5, 17, 15.5, 3), "M7 19v1.5M17 19v1.5", a(C(10, 11.25, 2.5)), "M12.5 11.25H16M15 11.25v1.5"]],
  ["https", t("tls ssl secure website browser"), [R(3, 4, 18, 16, 3), "M3 8.5h18", a(R(9.5, 13, 5, 4.5, 1)), "M10.5 13v-1a1.5 1.5 0 0 1 3 0v1"]],
]);
