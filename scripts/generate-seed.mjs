import { KZP_520 } from "../lib/kzp-data.ts";
import { writeFileSync } from "fs";

function esc(s) {
  if (s === null || s === undefined) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}

let sql = "";
sql += "-- Vygenerováno automaticky ze stávajících dat SO 520 (KZP 520-01)\n\n";
sql += `INSERT INTO kzp (so, cislo, nazev) VALUES (${esc(KZP_520.so)}, ${esc("520-01")}, ${esc("Zemní práce a pokládka potrubí")});\n\n`;

KZP_520.konstrukce.forEach((k, ki) => {
  const technCast = k.id === "potrubi" ? "Plynovod" : "Zemní práce";
  sql += `INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)\n`;
  sql += `  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), ${ki + 1}, ${esc(k.nazev)}, ${esc(k.material)}, ${esc(technCast)});\n`;
  k.zkousky.forEach((z, zi) => {
    sql += `INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)\n`;
    sql += `  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = ${esc(k.nazev)} AND material = ${esc(k.material)}), ${zi + 1}, ${esc(z.kratky)}, ${esc(z.nazev)}, ${esc(z.hodnota)}, ${esc(z.norma)}, ${esc(z.cetnost)}, ${esc(z.pozadovano)}, ${esc(z.provede)}, ${esc(z.vystup)});\n`;
  });
  sql += "\n";
});

writeFileSync("/home/claude/kzp-app/sql/002_seed_so520.sql", sql);
console.log("done, lines:", sql.split("\n").length);
