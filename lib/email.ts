import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderEmail(order: {
  id: number;
  so: string;
  konstrukceNazev: string;
  staniceni?: string;
  identifikace?: string;
  termin?: string;
  zkousky: { nazev: string; pocet: number }[];
}) {
  if (!resend) {
    console.log("RESEND_API_KEY není nastavený, e-mail se neodesílá (jen log).");
    return;
  }

  const to = (process.env.NOTIFY_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (to.length === 0) {
    console.log("NOTIFY_EMAILS není nastavený, e-mail se neodesílá.");
    return;
  }

  const appUrl = process.env.APP_URL || "";
  const zkouskyList = order.zkousky.map((z) => `<li>${z.nazev} ×${z.pocet}</li>`).join("");

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "objednavky@resend.dev",
    to,
    subject: `Nová objednávka zkoušek – ${order.so} / ${order.konstrukceNazev}`,
    html: `
      <p>Byla vytvořena nová objednávka zkoušek:</p>
      <p>
        <b>SO:</b> ${order.so}<br/>
        <b>Konstrukce:</b> ${order.konstrukceNazev}<br/>
        <b>Staničení / Opěra:</b> ${order.staniceni || "–"}<br/>
        <b>Další identifikace:</b> ${order.identifikace || "–"}<br/>
        <b>Termín:</b> ${order.termin || "–"}
      </p>
      <p><b>Zkoušky:</b></p>
      <ul>${zkouskyList}</ul>
      ${appUrl ? `<p><a href="${appUrl}/objednavka/${order.id}">Otevřít objednávku v appce</a></p>` : ""}
    `,
  });
}
