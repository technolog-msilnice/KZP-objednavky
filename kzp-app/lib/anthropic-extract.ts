const EXTRACTION_PROMPT = `Jsi asistent, který čte české stavební dokumenty typu "Kontrolní a zkušební plán (KZP)" a převádí je do strukturovaných dat.

Z přiloženého PDF vytáhni všechny informace a vrať POUZE validní JSON (žádný markdown, žádné vysvětlování) v tomto přesném tvaru:

{
  "so": "SO 520",
  "cislo": "520-01",
  "nazev": "Zemní práce a pokládka potrubí",
  "konstrukce": [
    {
      "nazev": "Základová spára",
      "material": "zemina",
      "technologickaCast": "Zemní práce",
      "zkousky": [
        {
          "kratky": "Posouzení geotechnikem",
          "nazev": "Posouzení geotechnikem",
          "hodnota": "rostlý terén",
          "norma": "TKP 3-3.3.5",
          "cetnost": "průběžně",
          "pozadovano": "min. 1",
          "provede": "geotechnik",
          "vystup": "zápis v SD"
        }
      ]
    }
  ]
}

Pravidla:
- "so" = číslo a název stavebního objektu (např. "SO 520")
- "cislo" = evidenční číslo KZP bez prefixu "KZP" (např. "520-01")
- "nazev" = název technologické části z hlavičky dokumentu
- Pro každou "Konstrukci" v dokumentu vytvoř jednu položku v poli "konstrukce"
- "material" = hodnota z řádku "Materiál" pro danou konstrukci
- "technologickaCast" = hodnota z řádku "Technologická část"
- Pro každý řádek "Kontrolovaná (zkoušená) vlastnost" vytvoř jednu položku v poli "zkousky"
- "kratky" = stručný název zkoušky (max 4 slova), i když je originální název delší
- "nazev" (u zkoušky) = plný přesný název z dokumentu
- "hodnota" = "Požadovaná hodnota"
- "norma" = "Norma (předpis)"
- "cetnost" = "Požadovaná četnost"
- "pozadovano" = "Počet kontrolních zkoušek"
- "provede" = "Zkoušku provede"
- "vystup" = "Výstup"
- Pokud si nejsi jistý hodnotou, přepiš přesně to, co je v dokumentu - nic si nevymýšlej
- Pokud je pole prázdné nebo nenalezené, použij prázdný řetězec ""

Vrať pouze JSON, nic jiného.`;

export async function extractKzpFromPdf(base64Pdf: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY není nastavený v proměnných prostředí.");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64Pdf },
            },
            { type: "text", text: EXTRACTION_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chyba AI zpracování (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((c: any) => c.type === "text");
  if (!textBlock) {
    throw new Error("AI nevrátila žádný text.");
  }

  let jsonText = textBlock.text.trim();
  jsonText = jsonText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error("AI vrátila data, která se nepodařilo přečíst jako JSON. Zkuste to prosím znovu.");
  }
}
