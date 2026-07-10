"use client";

import { useEffect, useMemo, useState } from "react";

const STAVBA_NAZEV = "I/16 Mladá Boleslav – Martinovice";

type Zkouska = {
  id: number;
  kratky: string;
  nazev: string;
  hodnota: string;
  norma: string;
  cetnost: string;
  pozadovano: string;
  provede: string;
  vystup: string;
};
type Konstrukce = {
  id: number;
  nazev: string;
  material: string;
  technologickaCast: string;
  zkousky: Zkouska[];
};
type KzpDetail = {
  id: number;
  so: string;
  cislo: string;
  nazev: string;
  konstrukce: Konstrukce[];
};
type KzpListItem = { id: number; so: string; cislo: string; nazev: string };

type ManualTest = { id: string; nazev: string; pocet: number };
type OrderZkouska = { kod: number | null; nazev: string; pocet: number };
type Order = {
  id: number;
  kzp_id: number | null;
  so: string;
  so_manual: boolean;
  konstrukce_id: number | null;
  konstrukce_nazev: string;
  staniceni: string | null;
  identifikace: string | null;
  termin: string | null;
  manual: boolean;
  status: string;
  zkousky: OrderZkouska[];
  vytvoreno: string;
};

export default function Home() {
  const [tab, setTab] = useState<"objednat" | "prehled" | "stav" | "nahrat">("objednat");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [toast, setToast] = useState("");

  const [kzpList, setKzpList] = useState<KzpListItem[]>([]);
  const [selectedKzp, setSelectedKzp] = useState<number | "manual" | null>(null);
  const [kzpDetail, setKzpDetail] = useState<KzpDetail | null>(null);
  const [loadingKzp, setLoadingKzp] = useState(true);
  const [manualSoName, setManualSoName] = useState("");

  const [konstrukceId, setKonstrukceId] = useState<number | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualKonstrukce, setManualKonstrukce] = useState("");
  const [staniceni, setStaniceni] = useState("");
  const [identifikace, setIdentifikace] = useState("");
  const [termin, setTermin] = useState("");
  const [checked, setChecked] = useState<Record<number, number>>({});
  const [manualTests, setManualTests] = useState<ManualTest[]>([]);

  const effManual = manualMode || selectedKzp === "manual" || !kzpDetail;
  const konstrukce = useMemo(
    () => kzpDetail?.konstrukce.find((k) => k.id === konstrukceId) || null,
    [kzpDetail, konstrukceId]
  );

  async function loadOrders() {
    setLoadingOrders(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoadingOrders(false);
  }

  async function loadKzpList() {
    setLoadingKzp(true);
    const res = await fetch("/api/kzp");
    const data: KzpListItem[] = await res.json();
    setKzpList(data);
    if (data.length > 0) setSelectedKzp(data[0].id);
    else setSelectedKzp("manual");
    setLoadingKzp(false);
  }

  useEffect(() => {
    loadOrders();
    loadKzpList();
  }, []);

  useEffect(() => {
    if (typeof selectedKzp !== "number") {
      setKzpDetail(null);
      setKonstrukceId(null);
      return;
    }
    fetch(`/api/kzp/${selectedKzp}`)
      .then((r) => r.json())
      .then((data: KzpDetail) => {
        setKzpDetail(data);
        setKonstrukceId(data.konstrukce[0]?.id ?? null);
        setChecked({});
      });
  }, [selectedKzp]);

  const sums = useMemo(() => {
    const s: Record<number, { objednano: number; hotovo: number }> = {};
    orders.forEach((o) => {
      if (o.manual || o.so_manual || !o.konstrukce_id) return;
      o.zkousky.forEach((z) => {
        if (!z.kod) return;
        if (!s[z.kod]) s[z.kod] = { objednano: 0, hotovo: 0 };
        s[z.kod].objednano += z.pocet;
        if (o.status === "v deníku") s[z.kod].hotovo += z.pocet;
      });
    });
    return s;
  }, [orders]);

  function chybi(zId: number, pozadovano: string) {
    const objednano = sums[zId]?.objednano || 0;
    const m = pozadovano.match(/\d+/);
    if (!m) return null;
    return Math.max(0, parseInt(m[0]) - objednano);
  }

  function toggleCheck(id: number) {
    setChecked((c) => {
      const next = { ...c };
      if (next[id]) delete next[id];
      else next[id] = 1;
      return next;
    });
  }
  function setQty(id: number, val: string) {
    const n = Math.max(1, parseInt(val) || 1);
    setChecked((c) => ({ ...c, [id]: n }));
  }
  function addManualTest() {
    setManualTests((t) => [
      ...t,
      { id: String(Date.now()) + Math.random().toString(36).slice(2), nazev: "", pocet: 1 },
    ]);
  }
  function removeManualTest(id: string) {
    setManualTests((t) => t.filter((x) => x.id !== id));
  }
  function updateManualTest(id: string, field: "nazev" | "pocet", value: string) {
    setManualTests((t) =>
      t.map((x) =>
        x.id === id
          ? { ...x, [field]: field === "pocet" ? Math.max(1, parseInt(value) || 1) : value }
          : x
      )
    );
  }

  function resetForm() {
    setStaniceni("");
    setIdentifikace("");
    setTermin("");
    setChecked({});
    setManualTests([]);
    setManualMode(false);
    setManualKonstrukce("");
  }

  async function submitOrder() {
    const soNazev =
      selectedKzp === "manual" ? manualSoName.trim() || "Neuvedeno" : kzpDetail?.so || "Neuvedeno";
    const soManualFlag = selectedKzp === "manual";

    let konstrukceNazev: string;
    let konstrukceIdToSave: number | null;
    if (effManual) {
      konstrukceNazev = manualKonstrukce.trim();
      konstrukceIdToSave = null;
      if (!konstrukceNazev) {
        setToast("Vyplňte název konstrukce.");
        return;
      }
    } else {
      konstrukceNazev = konstrukce!.nazev;
      konstrukceIdToSave = konstrukce!.id;
    }

    const zkouskyZKzp: OrderZkouska[] =
      effManual || !konstrukce
        ? []
        : konstrukce.zkousky
            .filter((z) => checked[z.id])
            .map((z) => ({ kod: z.id, nazev: z.kratky, pocet: checked[z.id] }));

    const zkouskyRucne: OrderZkouska[] = manualTests
      .filter((t) => t.nazev.trim())
      .map((t) => ({ kod: null, nazev: t.nazev.trim(), pocet: t.pocet }));

    const zkousky = [...zkouskyZKzp, ...zkouskyRucne];
    if (zkousky.length === 0) {
      setToast("Vyberte nebo přidejte alespoň jednu zkoušku.");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kzpId: typeof selectedKzp === "number" ? selectedKzp : null,
        so: soNazev,
        soManual: soManualFlag,
        konstrukceId: konstrukceIdToSave,
        konstrukceNazev,
        staniceni,
        identifikace,
        termin,
        manual: effManual,
        zkousky,
      }),
    });

    if (!res.ok) {
      setToast("Odeslání se nepovedlo, zkuste to prosím znovu.");
      return;
    }

    resetForm();
    setToast("Objednávka odeslána. E-mail šel na laboratoř a technologovi.");
    await loadOrders();
    setTab("prehled");
  }

  async function nextStatus(o: Order) {
    const next = o.status === "objednáno" ? "protokol nahrán" : "v deníku";
    await fetch(`/api/orders/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    await loadOrders();
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <h1 className="text-xl font-semibold mb-1">KZP objednávky</h1>
      <p className="text-sm text-gray-500 mb-4">{STAVBA_NAZEV}</p>

      <div className="mb-6 max-w-md">
        <label className="block text-xs text-gray-500 mb-1">Aktivní KZP</label>
        <select
          className={inputCls}
          value={selectedKzp ?? ""}
          onChange={(e) =>
            setSelectedKzp(e.target.value === "manual" ? "manual" : parseInt(e.target.value))
          }
        >
          {kzpList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.so} – KZP {k.cislo} – {k.nazev}
            </option>
          ))}
          <option value="manual">Bez KZP (zadat ručně)</option>
        </select>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {[
          { id: "objednat", label: "Objednat zkoušku" },
          { id: "prehled", label: "Přehled objednávek" },
          { id: "stav", label: "Stav plnění KZP" },
          { id: "nahrat", label: "Nahrát KZP" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {toast && (
        <div className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          {toast}
        </div>
      )}

      {loadingKzp || loadingOrders ? (
        <p className="text-sm text-gray-500">Načítám…</p>
      ) : tab === "objednat" ? (
        <ObjednatForm
          selectedKzp={selectedKzp}
          manualSoName={manualSoName}
          setManualSoName={setManualSoName}
          kzpDetail={kzpDetail}
          konstrukceId={konstrukceId}
          setKonstrukceId={setKonstrukceId}
          manualMode={manualMode}
          setManualMode={setManualMode}
          manualKonstrukce={manualKonstrukce}
          setManualKonstrukce={setManualKonstrukce}
          staniceni={staniceni}
          setStaniceni={setStaniceni}
          identifikace={identifikace}
          setIdentifikace={setIdentifikace}
          termin={termin}
          setTermin={setTermin}
          checked={checked}
          toggleCheck={toggleCheck}
          setQty={setQty}
          manualTests={manualTests}
          addManualTest={addManualTest}
          removeManualTest={removeManualTest}
          updateManualTest={updateManualTest}
          effManual={effManual}
          konstrukce={konstrukce}
          chybi={chybi}
          submitOrder={submitOrder}
        />
      ) : tab === "prehled" ? (
        <Prehled orders={orders} nextStatus={nextStatus} />
      ) : tab === "nahrat" ? (
        <NahratKzp
          onSaved={async (newId: number) => {
            await loadKzpList();
            setSelectedKzp(newId);
            setTab("objednat");
            setToast("KZP bylo úspěšně uloženo a je teď dostupné v roletce nahoře.");
          }}
        />
      ) : !kzpDetail ? (
        <p className="text-sm text-gray-400 text-center py-12">
          Vyberte konkrétní KZP nahoře pro zobrazení stavu plnění.
        </p>
      ) : (
        <StavPlneni kzpDetail={kzpDetail} sums={sums} />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300";

function ObjednatForm(props: any) {
  const {
    selectedKzp, manualSoName, setManualSoName, kzpDetail,
    konstrukceId, setKonstrukceId, manualMode, setManualMode,
    manualKonstrukce, setManualKonstrukce, staniceni, setStaniceni,
    identifikace, setIdentifikace, termin, setTermin,
    checked, toggleCheck, setQty, manualTests, addManualTest,
    removeManualTest, updateManualTest, effManual, konstrukce, chybi, submitOrder,
  } = props;

  return (
    <div className="border border-gray-200 rounded-xl p-5 max-w-3xl">
      {selectedKzp === "manual" && (
        <Field label="Stavební objekt">
          <input
            className={inputCls}
            placeholder="Např. SO 130"
            value={manualSoName}
            onChange={(e) => setManualSoName(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Bez KZP – konstrukce i zkoušky se zadávají ručně níže.
          </p>
        </Field>
      )}

      {kzpDetail && (
        <Field label="Konstrukce">
          {manualMode ? (
            <>
              <input
                className={inputCls}
                placeholder="Zadejte název konstrukce"
                value={manualKonstrukce}
                onChange={(e) => setManualKonstrukce(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                <button className="underline" onClick={() => setManualMode(false)}>
                  Zpět na seznam z KZP
                </button>
              </p>
            </>
          ) : (
            <>
              <select
                className={inputCls}
                value={konstrukceId ?? ""}
                onChange={(e) => setKonstrukceId(parseInt(e.target.value))}
              >
                {kzpDetail.konstrukce.map((k: Konstrukce) => (
                  <option key={k.id} value={k.id}>
                    {k.nazev}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Nenašli jste konstrukci?{" "}
                <button className="underline" onClick={() => setManualMode(true)}>
                  Přidat ručně
                </button>
              </p>
            </>
          )}
        </Field>
      )}

      {effManual && !kzpDetail && (
        <Field label="Konstrukce">
          <input
            className={inputCls}
            placeholder="Zadejte název konstrukce"
            value={manualKonstrukce}
            onChange={(e) => setManualKonstrukce(e.target.value)}
          />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="Staničení / Opěra">
          <input
            className={inputCls}
            placeholder="km 2,950 nebo Opěra 1"
            value={staniceni}
            onChange={(e) => setStaniceni(e.target.value)}
          />
        </Field>
        <Field label="Další identifikace (pilota, vrstva, atd.)">
          <input
            className={inputCls}
            placeholder="např. 3. vrstva"
            value={identifikace}
            onChange={(e) => setIdentifikace(e.target.value)}
          />
        </Field>
      </div>

      {!effManual && konstrukce && (
        <>
          <p className="text-sm font-medium mb-2">Zkoušky dle KZP pro tuto konstrukci</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500">
                  <th className="p-2 w-8"></th>
                  <th className="p-2">Zkouška</th>
                  <th className="p-2">Četnost</th>
                  <th className="p-2">Dle KZP celkem</th>
                  <th className="p-2">Dle KZP chybí</th>
                  <th className="p-2 w-20">Objednat</th>
                </tr>
              </thead>
              <tbody>
                {konstrukce.zkousky.map((z: Zkouska) => {
                  const ch = chybi(z.id, z.pozadovano);
                  const isChecked = !!checked[z.id];
                  return (
                    <tr key={z.id} className={`border-t border-gray-100 ${isChecked ? "" : "opacity-50"}`}>
                      <td className="p-2">
                        <input type="checkbox" checked={isChecked} onChange={() => toggleCheck(z.id)} />
                      </td>
                      <td className="p-2 cursor-pointer" onClick={() => toggleCheck(z.id)}>
                        {z.kratky}
                      </td>
                      <td className="p-2">
                        <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                          {z.cetnost}
                        </span>
                      </td>
                      <td className="p-2">{z.pozadovano}</td>
                      <td className="p-2">
                        {ch === null ? (
                          "–"
                        ) : ch === 0 ? (
                          <span className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5">
                            splněno
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">
                            {ch}
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={1}
                          className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                          value={checked[z.id] || 1}
                          onChange={(e) => setQty(z.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="text-sm font-medium mb-2">
        {effManual ? "Zkoušky (mimo KZP)" : "Chybí zkouška v KZP? Přidejte ji ručně"}
      </p>
      {manualTests.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
          <table className="w-full text-sm">
            <tbody>
              {manualTests.map((t: ManualTest) => (
                <tr key={t.id} className="border-t border-gray-100 first:border-t-0">
                  <td className="p-2">
                    <input
                      className={inputCls}
                      placeholder="Např. tlaková zkouška"
                      value={t.nazev}
                      onChange={(e) => updateManualTest(t.id, "nazev", e.target.value)}
                    />
                  </td>
                  <td className="p-2 w-20">
                    <input
                      type="number"
                      min={1}
                      className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                      value={t.pocet}
                      onChange={(e) => updateManualTest(t.id, "pocet", e.target.value)}
                    />
                  </td>
                  <td className="p-2 w-10">
                    <button onClick={() => removeManualTest(t.id)} className="text-gray-400 hover:text-red-500">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={addManualTest}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 mb-6 hover:bg-gray-50"
      >
        + Přidat {effManual ? "zkoušku" : "vlastní zkoušku"}
      </button>

      <Field label="Požadovaný termín provedení">
        <input
          type="date"
          className={inputCls}
          value={termin}
          onChange={(e) => setTermin(e.target.value)}
        />
      </Field>

      <button
        onClick={submitOrder}
        className="w-full border border-gray-300 rounded-lg py-3 text-sm font-medium hover:bg-gray-50"
      >
        Odeslat objednávku
      </button>
    </div>
  );
}

function statusBadge(status: string) {
  const cls =
    status === "objednáno"
      ? "bg-amber-50 text-amber-700"
      : status === "protokol nahrán"
      ? "bg-blue-50 text-blue-700"
      : "bg-green-50 text-green-700";
  return <span className={`text-xs rounded-full px-2 py-0.5 ${cls}`}>{status}</span>;
}

function Prehled({ orders, nextStatus }: { orders: Order[]; nextStatus: (o: Order) => void }) {
  const objednano = orders.filter((o) => o.status === "objednáno").length;
  const cekaProtokol = orders.filter((o) => o.status === "protokol nahrán").length;
  const vDeniku = orders.filter((o) => o.status === "v deníku").length;

  if (orders.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-12">Zatím žádné objednávky.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          ["Objednáno", objednano],
          ["Čeká na protokol", cekaProtokol],
          ["Zapsáno do deníku", vDeniku],
        ].map(([label, val]) => (
          <div key={label as string} className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-medium">{val}</p>
          </div>
        ))}
      </div>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500">
              <th className="p-2">SO</th>
              <th className="p-2">Konstrukce</th>
              <th className="p-2">Staničení / Opěra</th>
              <th className="p-2">Další identifikace</th>
              <th className="p-2">Zkoušky</th>
              <th className="p-2">Termín</th>
              <th className="p-2">Stav</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="p-2">
                  {o.so} {o.so_manual && <span className="text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-0.5 ml-1">ručně</span>}
                </td>
                <td className="p-2">
                  {o.konstrukce_nazev}{" "}
                  {o.manual && !o.so_manual && (
                    <span className="text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-0.5 ml-1">ručně</span>
                  )}
                </td>
                <td className="p-2">{o.staniceni || "–"}</td>
                <td className="p-2">{o.identifikace || "–"}</td>
                <td className="p-2">{o.zkousky.map((z) => `${z.nazev} ×${z.pocet}`).join(", ")}</td>
                <td className="p-2">{o.termin ? new Date(o.termin).toLocaleDateString("cs-CZ") : "–"}</td>
                <td className="p-2">{statusBadge(o.status)}</td>
                <td className="p-2">
                  {o.status !== "v deníku" && (
                    <button
                      onClick={() => nextStatus(o)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 hover:bg-gray-50"
                    >
                      {o.status === "objednáno" ? "Protokol nahrán" : "Zapsat do deníku"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StavPlneni({
  kzpDetail,
  sums,
}: {
  kzpDetail: KzpDetail;
  sums: Record<number, { objednano: number; hotovo: number }>;
}) {
  const rows: any[] = [];
  kzpDetail.konstrukce.forEach((k) => {
    k.zkousky.forEach((z) => {
      const rec = sums[z.id] || { objednano: 0, hotovo: 0 };
      const m = z.pozadovano.match(/\d+/);
      const req = m ? parseInt(m[0]) : null;
      const zbyva = req !== null ? Math.max(0, req - rec.hotovo) : null;
      rows.push({
        konstrukce: k.nazev,
        zkouska: z.kratky,
        pozadovano: z.pozadovano,
        provedeno: rec.hotovo,
        zbyva,
        objednano: rec.objednano,
      });
    });
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-500">
            <th className="p-2">Konstrukce</th>
            <th className="p-2">Zkouška</th>
            <th className="p-2">Požadováno dle KZP</th>
            <th className="p-2">Provedeno dle KZP</th>
            <th className="p-2">Zbývá</th>
            <th className="p-2">Objednáno</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-gray-100">
              <td className="p-2">{r.konstrukce}</td>
              <td className="p-2">{r.zkouska}</td>
              <td className="p-2">{r.pozadovano}</td>
              <td className="p-2">{r.provedeno}</td>
              <td className="p-2">
                {r.zbyva === null ? (
                  "–"
                ) : r.zbyva === 0 ? (
                  <span className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5">splněno</span>
                ) : (
                  <span className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">{r.zbyva}</span>
                )}
              </td>
              <td className="p-2">{r.objednano}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ExtractedZkouska = {
  kratky: string;
  nazev: string;
  hodnota: string;
  norma: string;
  cetnost: string;
  pozadovano: string;
  provede: string;
  vystup: string;
};
type ExtractedKonstrukce = {
  nazev: string;
  material: string;
  technologickaCast: string;
  zkousky: ExtractedZkouska[];
};
type ExtractedKzp = {
  so: string;
  cislo: string;
  nazev: string;
  konstrukce: ExtractedKonstrukce[];
};

function NahratKzp({ onSaved }: { onSaved: (newId: number) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [extracted, setExtracted] = useState<ExtractedKzp | null>(null);

  async function handleParse() {
    if (!file) {
      setError("Nejdřív vyberte PDF soubor.");
      return;
    }
    setError("");
    setParsing(true);
    setExtracted(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/kzp/parse", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Zpracování se nepovedlo.");
      } else {
        setExtracted(data);
      }
    } catch {
      setError("Zpracování se nepovedlo. Zkuste to prosím znovu.");
    } finally {
      setParsing(false);
    }
  }

  function updateHeader(field: "so" | "cislo" | "nazev", value: string) {
    setExtracted((e) => (e ? { ...e, [field]: value } : e));
  }
  function updateKonstrukce(ki: number, field: "nazev" | "material", value: string) {
    setExtracted((e) => {
      if (!e) return e;
      const konstrukce = [...e.konstrukce];
      konstrukce[ki] = { ...konstrukce[ki], [field]: value };
      return { ...e, konstrukce };
    });
  }
  function removeKonstrukce(ki: number) {
    setExtracted((e) => {
      if (!e) return e;
      return { ...e, konstrukce: e.konstrukce.filter((_, i) => i !== ki) };
    });
  }
  function updateZkouska(ki: number, zi: number, field: keyof ExtractedZkouska, value: string) {
    setExtracted((e) => {
      if (!e) return e;
      const konstrukce = [...e.konstrukce];
      const zkousky = [...konstrukce[ki].zkousky];
      zkousky[zi] = { ...zkousky[zi], [field]: value };
      konstrukce[ki] = { ...konstrukce[ki], zkousky };
      return { ...e, konstrukce };
    });
  }
  function removeZkouska(ki: number, zi: number) {
    setExtracted((e) => {
      if (!e) return e;
      const konstrukce = [...e.konstrukce];
      konstrukce[ki] = {
        ...konstrukce[ki],
        zkousky: konstrukce[ki].zkousky.filter((_, i) => i !== zi),
      };
      return { ...e, konstrukce };
    });
  }

  async function handleSave() {
    if (!extracted) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/kzp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extracted),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Uložení se nepovedlo.");
      } else {
        setExtracted(null);
        setFile(null);
        onSaved(data.id);
      }
    } catch {
      setError("Uložení se nepovedlo. Zkuste to prosím znovu.");
    } finally {
      setSaving(false);
    }
  }

  const zkouskaFieldCls =
    "w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-300";

  return (
    <div>
      {!extracted && (
        <div className="border border-gray-200 rounded-xl p-5 max-w-xl">
          <p className="text-sm font-medium mb-2">Nahrát nové KZP</p>
          <p className="text-xs text-gray-500 mb-4">
            Appka přečte PDF pomocí AI a vytáhne z něj konstrukce a zkoušky. Než se to uloží,
            uvidíte náhled k opravě a potvrzení.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm mb-4 block"
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            onClick={handleParse}
            disabled={parsing || !file}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {parsing ? "Čtu KZP pomocí AI… (může to trvat i minutu)" : "Přečíst KZP pomocí AI"}
          </button>
        </div>
      )}

      {extracted && (
        <div>
          <div className="border border-gray-200 rounded-xl p-5 max-w-3xl mb-4">
            <p className="text-sm font-medium mb-3">Zkontrolujte vytažená data</p>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <Field label="Stavební objekt">
                <input
                  className={inputCls}
                  value={extracted.so}
                  onChange={(e) => updateHeader("so", e.target.value)}
                />
              </Field>
              <Field label="Číslo KZP">
                <input
                  className={inputCls}
                  value={extracted.cislo}
                  onChange={(e) => updateHeader("cislo", e.target.value)}
                />
              </Field>
              <Field label="Název">
                <input
                  className={inputCls}
                  value={extracted.nazev}
                  onChange={(e) => updateHeader("nazev", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {extracted.konstrukce.map((k, ki) => (
            <div key={ki} className="border border-gray-200 rounded-xl p-4 max-w-3xl mb-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  className={inputCls}
                  style={{ flex: 2 }}
                  value={k.nazev}
                  onChange={(e) => updateKonstrukce(ki, "nazev", e.target.value)}
                  placeholder="Název konstrukce"
                />
                <input
                  className={inputCls}
                  style={{ flex: 1 }}
                  value={k.material}
                  onChange={(e) => updateKonstrukce(ki, "material", e.target.value)}
                  placeholder="Materiál"
                />
                <button
                  onClick={() => removeKonstrukce(ki)}
                  className="text-gray-400 hover:text-red-500 text-sm px-2"
                  title="Odebrat konstrukci"
                >
                  ✕
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500">
                      <th className="p-1.5">Krátký název</th>
                      <th className="p-1.5">Plný název</th>
                      <th className="p-1.5">Hodnota</th>
                      <th className="p-1.5">Norma</th>
                      <th className="p-1.5">Četnost</th>
                      <th className="p-1.5">Počet</th>
                      <th className="p-1.5">Provede</th>
                      <th className="p-1.5">Výstup</th>
                      <th className="p-1.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {k.zkousky.map((z, zi) => (
                      <tr key={zi} className="border-t border-gray-100">
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.kratky} onChange={(e) => updateZkouska(ki, zi, "kratky", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.nazev} onChange={(e) => updateZkouska(ki, zi, "nazev", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.hodnota} onChange={(e) => updateZkouska(ki, zi, "hodnota", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.norma} onChange={(e) => updateZkouska(ki, zi, "norma", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.cetnost} onChange={(e) => updateZkouska(ki, zi, "cetnost", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.pozadovano} onChange={(e) => updateZkouska(ki, zi, "pozadovano", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.provede} onChange={(e) => updateZkouska(ki, zi, "provede", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <input className={zkouskaFieldCls} value={z.vystup} onChange={(e) => updateZkouska(ki, zi, "vystup", e.target.value)} />
                        </td>
                        <td className="p-1.5">
                          <button onClick={() => removeZkouska(ki, zi)} className="text-gray-400 hover:text-red-500">
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? "Ukládám…" : "Uložit do databáze"}
            </button>
            <button
              onClick={() => {
                setExtracted(null);
                setFile(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Zahodit a začít znovu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
