### Architektura práce s externími zdroji (Justice, ČSU, Katastr, klientské podklady)

#### 1. Hlavní cíle

- Automatizovat stahování a aktualizaci dat z veřejných i částečně uzavřených systémů (Justice, ČSU, Katastr).
- Zajistit bezpečné a auditovatelné zpracování dokumentů a tabulek (účetní závěrky, výroční zprávy, časové řady, LV, smlouvy, technické průkazy).
- Poskytnout AI modelu strukturovaný kontext tak, aby uměl:
  - najít relevantní zdroj/e,
  - vysvětlit, co v nich je,
  - a případně vrátit agregované/odvozené metriky.

#### 2. Logické bloky systému

1. **Ingestion layer (stahování)**  
   - Moduly pro jednotlivé zdroje:
     - `justiceFetcher` – stahování HTML/PDF účetních závěrek a výročních zpráv.
     - `csuFetcher` – stahování XLS/XLSX časových řad.
     - `cadastralFetcher` – práce s katastrem (HTML/PDF LV, přehledy vlastnictví; přístup typicky za paywallem).
   - Každý modul:
     - respektuje podmínky použití daného zdroje (rate limiting, robot policy, právní rámec),
     - neukládá přístupové údaje do kódu – používá **env proměnné** nebo externí tajemství,
     - zapisuje logy (čas, typ operace, identifikátor dokumentu/spisu).

2. **Storage layer (uložení dat)**  
   - Surové soubory:
     - ukládány do objektového úložiště (S3 / Azure Blob / lokálně v prototypu v `docs/`),
     - organizace např. `source/year/client/...`.
   - Metadata:
     - uložena v databázi (např. Postgres) nebo v menším setupu v JSON/YAML,
     - struktura obdobná typu `ExternalSource` + technické údaje (checksum, velikost, datum stažení, verze).

3. **Parsing & normalization layer (parsování a strukturování)**  
   - Každý typ souboru má svůj parser:
     - PDF/scan → OCR + extrakce textu + heuristiky pro tabulky.
     - XLS/XLSX → knihovna (např. `xlsx` v Node.js), mapování sloupců na interní schéma (např. `Metric`).
     - TXT/HTML → regulární výrazy / DOM parsování.
   - Výstup:
     - normalizované tabulky metrik (např. tržby, EBITDA),
     - strukturované objekty pro LV (parcelní čísla, druh pozemku, zátěže),
     - extrahované klíčové údaje ze smluv (strany smlouvy, částky, zajištění, splatnosti),
     - indexovatelný text (např. pro fulltext).

4. **Indexing & AI context layer**  
   - Udržuje:
     - **seznam zdrojů** (typ `ExternalSource`),
     - **vazby** na konkrétní klienty/spisy,
     - **odvozené metriky** (agregace, trendové analýzy).
   - Poskytuje API pro:
     - výběr relevantních zdrojů pro dotaz (filtrace dle klienta, roku, typu dokumentu),
     - přípravu krátkého, strukturovaného kontextu pro LLM (např. seznam kandidátních zdrojů).

5. **LLM interface**  
   - Abstraktní vrstva, která:
     - sestaví prompt (včetně seznamu zdrojů, možných typů),
     - definuje **strukturovaný výstup** (JSON schema – odpověď + seznam ID zdrojů),
     - případně rozdělí úlohu na více kroků (nejdříve výběr zdrojů, pak generování verbální odpovědi).

#### 3. Bezpečnost a compliance

- Přihlašovací údaje (např. katastr) jsou pouze v **bezpečném uložišti** (env, secret manager).
- Logy neobsahují citlivá data (jen technické informace).
- Je jasně oddělena vrstva:
  - která komunikuje s externí službou,
  - která pracuje s interními klientskými daty,
  - která komunikuje s AI modelem.
- U dat chráněných zvláštním režimem (např. GDPR, bankovní tajemství) je zavedeno:
  - řízení přístupu (role-based access),
  - audit trail (kdo kdy s daty pracoval),
  - možnost lokalizace či výmazu dat.

#### 4. Integrace do stávajícího Next.js prototypu

- **Krátkodobě (prototyp)**:
  - používat lokální soubory v `docs/` + JSON (`external-sources.json`) jako zdroj metadat,
  - simulovat „sync“ endpointy (`/api/sync/justice`, `/api/sync/csu`),
  - posílat do LLM pouze seznam zdrojů (ID, typ, název, URL, popis, tagy).
- **Střednědobě (pilot)**:
  - přesunout parsování a sync do samostatné backend služby (např. Node/Go worker),
  - plánovat synchronizace (cron / job queue),
  - ukládat výstupy do databáze.
- **Dlouhodobě (produkce)**:
  - plně automatizovaný pipeline:
    - plánované synchro zdrojů,
    - robustní error-handling a alerting,
    - škálování podle počtu klientů a dokumentů.


