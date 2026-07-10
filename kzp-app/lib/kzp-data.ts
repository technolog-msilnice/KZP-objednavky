export type Zkouska = {
  id: string;
  kratky: string;
  nazev: string;
  hodnota: string;
  norma: string;
  cetnost: string;
  pozadovano: string;
  provede: string;
  vystup: string;
};

export type Konstrukce = {
  id: string;
  nazev: string;
  material: string;
  zkousky: Zkouska[];
};

export const KZP_520 = {
  so: "SO 520",
  stavba: "I/16 Mladá Boleslav – Martinovice",
  konstrukce: [
    {
      id: "zaklad_spara",
      nazev: "Základová spára",
      material: "zemina",
      zkousky: [
        { id: "geotech", kratky: "Posouzení geotechnikem", nazev: "Posouzení geotechnikem", hodnota: "rostlý terén", norma: "TKP 3-3.3.5 / TKP 4.3.4.4", cetnost: "průběžně", pozadovano: "min. 1", provede: "geotechnik", vystup: "zápis v SD" },
      ],
    },
    {
      id: "obsyp",
      nazev: "Obsyp",
      material: "ŠP fr. 0/4 mm",
      zkousky: [
        { id: "zrnitost_obsyp", kratky: "Zrnitost", nazev: "Zrnitost", hodnota: "dle ITT", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "min. 1", provede: "výrobce", vystup: "protokol" },
        { id: "proctor_obsyp", kratky: "Proctor (PS) + vlhkost", nazev: "Max. objemová hmot. (PS) + vlhkost optimální", hodnota: "deklarovaná hodnota", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "1", provede: "laboratoř", vystup: "protokol" },
        { id: "zhutneni_obsyp", kratky: "Míra zhutnění + vlhkost", nazev: "Míra zhutnění (D) + vlhkost", hodnota: "min. 95 %", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 50 bm", pozadovano: "14", provede: "laboratoř", vystup: "protokol" },
      ],
    },
    {
      id: "zasyp_mimo",
      nazev: "Zpětný zásyp – nové a rušené potrubí mimo komunikaci",
      material: "zemina",
      zkousky: [
        { id: "zrnitost_zasyp_mimo", kratky: "Zrnitost + vlhkost přirozená", nazev: "Zrnitost zeminy (příp. meze plasticity) + vlhkost přirozená", hodnota: "min. podmínečně vhodná do násypu / AZ", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "min. 1", provede: "laboratoř", vystup: "protokol" },
        { id: "proctor_zasyp_mimo", kratky: "Proctor (PS) + vlhkost", nazev: "Max. objemová hmot. (PS)* + vlhkost optimální", hodnota: "deklarovaná hodnota", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "1", provede: "laboratoř", vystup: "protokol" },
        { id: "zhutneni_nove_mimo", kratky: "Míra zhutnění – nové potrubí", nazev: "Míra zhutnění (D) – nové potrubí mimo komunikaci", hodnota: "min. 92 %", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 50 bm výšky zásypu", pozadovano: "min. 13", provede: "laboratoř", vystup: "protokol" },
        { id: "zhutneni_ruseneé_mimo", kratky: "Míra zhutnění – rušené potrubí", nazev: "Míra zhutnění (D) – rušené potrubí mimo komunikaci", hodnota: "min. 92 %", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 50 bm výšky zásypu", pozadovano: "min. 7", provede: "laboratoř", vystup: "protokol" },
      ],
    },
    {
      id: "zasyp_pod",
      nazev: "Zpětný zásyp – nové a rušené potrubí pod komunikací",
      material: "nakupovaný materiál",
      zkousky: [
        { id: "zrnitost_zasyp_pod", kratky: "Zrnitost", nazev: "Zrnitost", hodnota: "dle ITT", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "min. 1", provede: "výrobce", vystup: "protokol" },
        { id: "proctor_zasyp_pod", kratky: "Proctor (PS) + vlhkost", nazev: "Max. objemová hmot. (PS)* + vlhkost optimální", hodnota: "deklarovaná hodnota", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 1500 m³", pozadovano: "1", provede: "laboratoř", vystup: "protokol" },
        { id: "zhutneni_nove_pod", kratky: "Míra zhutnění – nové potrubí", nazev: "Míra zhutnění (D) – nové potrubí, aktivní zóna / násyp", hodnota: "min. 100 % / min. 95 %", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 50 bm výšky zásypu", pozadovano: "min. 1", provede: "laboratoř", vystup: "protokol" },
        { id: "zhutneni_ruseneé_pod", kratky: "Míra zhutnění – rušené potrubí", nazev: "Míra zhutnění (D) – rušené potrubí, aktivní zóna / násyp", hodnota: "min. 100 % / min. 95 %", norma: "TKP 3-3.3.5 / 4-4.3.10", cetnost: "1x / 50 bm výšky zásypu", pozadovano: "min. 8", provede: "laboratoř", vystup: "protokol" },
      ],
    },
    {
      id: "potrubi",
      nazev: "Potrubí (plynovod PE DN 100, 110)",
      material: "PE DN 100, 110",
      zkousky: [
        { id: "vstupni_kontrola", kratky: "Vstupní kontrola materiálu", nazev: "Vstupní kontrola materiálu", hodnota: "směrnice provozovatele", norma: "TPG 702 04", cetnost: "celá trasa", pozadovano: "1", provede: "stavbyvedoucí", vystup: "zápis v SD" },
        { id: "vizualni_svary", kratky: "Vizuální kontrola svarů", nazev: "Vizuální kontrola svarů", hodnota: "vyhovující", norma: "TPG 702 04", cetnost: "každý svar", pozadovano: "cca 60", provede: "PPSD a.s.", vystup: "protokol" },
        { id: "kontrola_vodice", kratky: "Kontrola vodiče", nazev: "Kontrola vodiče", hodnota: "vyhovující", norma: "TPG 702 04", cetnost: "celá trasa", pozadovano: "1", provede: "PPSD a.s.", vystup: "protokol" },
        { id: "signalni_vrstva", kratky: "Kontrola signální vrstvy", nazev: "Kontrola položení signální vrstvy", hodnota: "vyhovující", norma: "TPG 702 04", cetnost: "celá trasa", pozadovano: "1", provede: "PPSD a.s.", vystup: "protokol" },
        { id: "tlakova_zkouska", kratky: "Tlaková zkouška", nazev: "Tlaková zkouška", hodnota: "vyhovující", norma: "TPG 702 04", cetnost: "1x SO", pozadovano: "1", provede: "PPSD a.s.", vystup: "protokol" },
        { id: "geodet_zamereni", kratky: "Geodetické zaměření", nazev: "Geodetické zaměření", hodnota: "dle RDS", norma: "směrnice provozovatele", cetnost: "1x SO", pozadovano: "1", provede: "geodet", vystup: "protokol" },
        { id: "revizni_zprava", kratky: "Revizní zpráva", nazev: "Revizní zpráva", hodnota: "vyhovující", norma: "TPG 702 04", cetnost: "1x SO", pozadovano: "1", provede: "PPSD a.s.", vystup: "protokol" },
      ],
    },
  ] as Konstrukce[],
};
