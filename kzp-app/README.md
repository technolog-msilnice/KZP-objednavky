# KZP objednávky – SO 520 (pilot)

Appka pro objednávání zkoušek dle KZP mezi M-SILNICE a laboratoří.

## Nasazení (poprvé) – přesný postup

### 1. Nahrání kódu na GitHub
1. V repozitáři `kzp-objednavky` klikni na **"uploading an existing file"** (nebo Add file > Upload files)
2. Přetáhni do okna **celou tuto složku** (všechny soubory a podsložky)
3. Dole klikni **Commit changes**

### 2. Databáze (Neon)
1. Jdi na **neon.tech** → Sign up (klidně přes GitHub účet)
2. Vytvoř nový projekt, název klidně `kzp-objednavky`
3. Po vytvoření uvidíš **Connection string** (začíná `postgresql://...`) – zkopíruj si ho
4. V Neon otevři **SQL Editor** a vlož obsah souboru `sql/schema.sql` z tohoto projektu, spusť (tím se vytvoří tabulka pro objednávky)

### 3. E-mail (Resend)
1. Jdi na **resend.com** → Sign up
2. V sekci **API Keys** vytvoř nový klíč, zkopíruj si ho (zobrazí se jen jednou)
3. Pro start stačí odesílat z testovací adresy `onboarding@resend.dev` – funguje bez dalšího nastavování

### 4. Nasazení appky (Vercel)
1. Jdi na **vercel.com** → Sign up **přes GitHub účet** (žádné nové heslo)
2. Klikni **Add New → Project**
3. Najdi a vyber repozitář `kzp-objednavky` → **Import**
4. Před kliknutím na Deploy rozbal **Environment Variables** a přidej:
   - `DATABASE_URL` = connection string z Neonu
   - `RESEND_API_KEY` = klíč z Resendu
   - `FROM_EMAIL` = `onboarding@resend.dev`
   - `NOTIFY_EMAILS` = tvůj e-mail (nebo víc e-mailů oddělených čárkou)
5. Klikni **Deploy** a počkej ~1 minutu
6. Po dokončení dostaneš adresu appky (např. `kzp-objednavky.vercel.app`) – tu doplň i jako `APP_URL` v Environment Variables a appku znovu nasaď (Redeploy)

Appka je pak dostupná z mobilu i PC na dané adrese.

## Další úpravy appky
Kdykoliv appku budeme dál upravovat, stačí nahradit soubory v GitHub repozitáři (stejným postupem jako v kroku 1) – Vercel appku automaticky znovu nasadí během ~1 minuty.
