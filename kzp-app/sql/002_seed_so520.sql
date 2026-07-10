-- Vygenerováno automaticky ze stávajících dat SO 520 (KZP 520-01)

INSERT INTO kzp (so, cislo, nazev) VALUES ('SO 520', '520-01', 'Zemní práce a pokládka potrubí');

INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), 1, 'Základová spára', 'zemina', 'Zemní práce');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Základová spára' AND material = 'zemina'), 1, 'Posouzení geotechnikem', 'Posouzení geotechnikem', 'rostlý terén', 'TKP 3-3.3.5 / TKP 4.3.4.4', 'průběžně', 'min. 1', 'geotechnik', 'zápis v SD');

INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), 2, 'Obsyp', 'ŠP fr. 0/4 mm', 'Zemní práce');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Obsyp' AND material = 'ŠP fr. 0/4 mm'), 1, 'Zrnitost', 'Zrnitost', 'dle ITT', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', 'min. 1', 'výrobce', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Obsyp' AND material = 'ŠP fr. 0/4 mm'), 2, 'Proctor (PS) + vlhkost', 'Max. objemová hmot. (PS) + vlhkost optimální', 'deklarovaná hodnota', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', '1', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Obsyp' AND material = 'ŠP fr. 0/4 mm'), 3, 'Míra zhutnění + vlhkost', 'Míra zhutnění (D) + vlhkost', 'min. 95 %', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 50 bm', '14', 'laboratoř', 'protokol');

INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), 3, 'Zpětný zásyp – nové a rušené potrubí mimo komunikaci', 'zemina', 'Zemní práce');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí mimo komunikaci' AND material = 'zemina'), 1, 'Zrnitost + vlhkost přirozená', 'Zrnitost zeminy (příp. meze plasticity) + vlhkost přirozená', 'min. podmínečně vhodná do násypu / AZ', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', 'min. 1', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí mimo komunikaci' AND material = 'zemina'), 2, 'Proctor (PS) + vlhkost', 'Max. objemová hmot. (PS)* + vlhkost optimální', 'deklarovaná hodnota', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', '1', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí mimo komunikaci' AND material = 'zemina'), 3, 'Míra zhutnění – nové potrubí', 'Míra zhutnění (D) – nové potrubí mimo komunikaci', 'min. 92 %', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 50 bm výšky zásypu', 'min. 13', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí mimo komunikaci' AND material = 'zemina'), 4, 'Míra zhutnění – rušené potrubí', 'Míra zhutnění (D) – rušené potrubí mimo komunikaci', 'min. 92 %', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 50 bm výšky zásypu', 'min. 7', 'laboratoř', 'protokol');

INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), 4, 'Zpětný zásyp – nové a rušené potrubí pod komunikací', 'nakupovaný materiál', 'Zemní práce');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí pod komunikací' AND material = 'nakupovaný materiál'), 1, 'Zrnitost', 'Zrnitost', 'dle ITT', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', 'min. 1', 'výrobce', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí pod komunikací' AND material = 'nakupovaný materiál'), 2, 'Proctor (PS) + vlhkost', 'Max. objemová hmot. (PS)* + vlhkost optimální', 'deklarovaná hodnota', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 1500 m³', '1', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí pod komunikací' AND material = 'nakupovaný materiál'), 3, 'Míra zhutnění – nové potrubí', 'Míra zhutnění (D) – nové potrubí, aktivní zóna / násyp', 'min. 100 % / min. 95 %', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 50 bm výšky zásypu', 'min. 1', 'laboratoř', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Zpětný zásyp – nové a rušené potrubí pod komunikací' AND material = 'nakupovaný materiál'), 4, 'Míra zhutnění – rušené potrubí', 'Míra zhutnění (D) – rušené potrubí, aktivní zóna / násyp', 'min. 100 % / min. 95 %', 'TKP 3-3.3.5 / 4-4.3.10', '1x / 50 bm výšky zásypu', 'min. 8', 'laboratoř', 'protokol');

INSERT INTO konstrukce (kzp_id, poradi, nazev, material, technologicka_cast)
  VALUES ((SELECT id FROM kzp WHERE cislo = '520-01'), 5, 'Potrubí (plynovod PE DN 100, 110)', 'PE DN 100, 110', 'Plynovod');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 1, 'Vstupní kontrola materiálu', 'Vstupní kontrola materiálu', 'směrnice provozovatele', 'TPG 702 04', 'celá trasa', '1', 'stavbyvedoucí', 'zápis v SD');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 2, 'Vizuální kontrola svarů', 'Vizuální kontrola svarů', 'vyhovující', 'TPG 702 04', 'každý svar', 'cca 60', 'PPSD a.s.', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 3, 'Kontrola vodiče', 'Kontrola vodiče', 'vyhovující', 'TPG 702 04', 'celá trasa', '1', 'PPSD a.s.', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 4, 'Kontrola signální vrstvy', 'Kontrola položení signální vrstvy', 'vyhovující', 'TPG 702 04', 'celá trasa', '1', 'PPSD a.s.', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 5, 'Tlaková zkouška', 'Tlaková zkouška', 'vyhovující', 'TPG 702 04', '1x SO', '1', 'PPSD a.s.', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 6, 'Geodetické zaměření', 'Geodetické zaměření', 'dle RDS', 'směrnice provozovatele', '1x SO', '1', 'geodet', 'protokol');
INSERT INTO zkousky (konstrukce_id, poradi, kratky, nazev, hodnota, norma, cetnost, pozadovano, provede, vystup)
  VALUES ((SELECT id FROM konstrukce WHERE kzp_id = (SELECT id FROM kzp WHERE cislo = '520-01') AND nazev = 'Potrubí (plynovod PE DN 100, 110)' AND material = 'PE DN 100, 110'), 7, 'Revizní zpráva', 'Revizní zpráva', 'vyhovující', 'TPG 702 04', '1x SO', '1', 'PPSD a.s.', 'protokol');

