# Statikum AI Prototyp

AI asistent pro analýzu dokumentů a odpovědí na otázky týkající se klientů a jejich finančních dat.

## Přehled

Tato aplikace umožňuje uživatelům klást otázky týkající se klientů a jejich dokumentů. Systém automaticky najde relevantní odpovědi, související dokumenty a finanční metriky.

## Funkce

- Interaktivní dotazovací systém
- Automatické párování otázek s připravenými odpověďmi
- Zobrazení souvisejících dokumentů
- Vizualizace finančních metrik
- Podpora více klientů
- Tematický režim (světlý/tmavý)

## Technologie

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI komponenty

## Instalace

```bash
npm install
# nebo
pnpm install
```

## Spuštění

Pro vývojové prostředí:

```bash
npm run dev
# nebo
pnpm dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000)

Pro produkční build:

```bash
npm run build
npm start
```

## Struktura projektu

- `app/` - Next.js aplikace a routy
- `components/` - React komponenty
- `data/` - Mock data (dokumenty, odpovědi, metriky)
- `lib/` - Utility funkce a helpery
- `types/` - TypeScript typy

## Licence

Soukromý projekt
