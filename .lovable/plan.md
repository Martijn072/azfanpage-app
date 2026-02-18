

# Visuals Module — Social Media Image Generator

## Overzicht

Een nieuwe module binnen de app waarmee je automatisch social media-afbeeldingen genereert op basis van live wedstrijddata. Je selecteert een template, de data wordt automatisch ingevuld, en je downloadt een kant-en-klare PNG.

## Templates (Fase 1)

| Template | Formaat | Databron |
|----------|---------|----------|
| **Uitslag** | 1080x1080 (Instagram) | `useAZFixtures` — score, teams, logos, competitie |
| **Voorbeschouwing** | 1080x1080 | `useNextAZFixture` — datum, tijd, tegenstander, venue |
| **Stand** | 1080x1350 | `useEredivisieStandings` — top-10 met AZ highlight |
| **Speelronde** | 1080x1080 | `useAZFixtures` — laatste resultaat + volgende wedstrijd |

## Hoe het werkt

1. Gebruiker opent `/visuals` en ziet de template-galerij
2. Klikt op een template — de preview verschijnt met live data
3. Past optioneel kleuren/tekst aan
4. Klikt "Download PNG" — `html-to-image` rendert het DOM-element naar een afbeelding

```text
+------------------------------------------+
|  Visuals                                  |
|                                           |
|  [Uitslag] [Preview] [Stand] [Speelronde] |
|                                           |
|  +------------------------------------+   |
|  |                                    |   |
|  |     LIVE PREVIEW (1:1 ratio)       |   |
|  |     met echte data                 |   |
|  |                                    |   |
|  +------------------------------------+   |
|                                           |
|  [ Download PNG ]  [ Kopieer ]            |
+------------------------------------------+
```

## Technische aanpak

### Nieuwe dependency
- `html-to-image` (npm) — converteert een DOM-node naar PNG via canvas/SVG. Lichtgewicht, actief onderhouden, werkt goed met React refs.

### Nieuwe bestanden

| Bestand | Doel |
|---------|------|
| `src/pages/app/Visuals.tsx` | Hoofdpagina met template-selector en preview |
| `src/components/visuals/TemplateSelector.tsx` | Grid met template-kaarten |
| `src/components/visuals/VisualPreview.tsx` | Preview-container met download-functionaliteit |
| `src/components/visuals/templates/ResultTemplate.tsx` | Uitslag-template (1080x1080) |
| `src/components/visuals/templates/PreviewTemplate.tsx` | Voorbeschouwing-template |
| `src/components/visuals/templates/StandingsTemplate.tsx` | Stand-template (1080x1350) |
| `src/components/visuals/templates/MatchdayTemplate.tsx` | Speelronde-template |
| `src/hooks/useVisualDownload.ts` | Hook die `html-to-image` wraptmet toPng + download |

### Bestaande bestanden die worden aangepast

| Bestand | Wijziging |
|---------|-----------|
| `src/components/layout/Sidebar.tsx` | Visuals-item activeren (disabled verwijderen, route koppelen) |
| `src/App.tsx` | Route `/visuals` toevoegen met lazy import |

### Template rendering-strategie

Elk template-component:
- Rendert op een vaste pixel-afmeting (bijv. 1080x1080) binnen een `transform: scale()` container zodat het in de preview past
- Gebruikt inline styles + Tailwind voor de layout
- Laadt team-logos via `<img>` tags (cross-origin safe via API-Football CDN)
- Wordt via een React ref aan `html-to-image.toPng()` gekoppeld

### Download flow

```text
Gebruiker klikt "Download"
  -> useVisualDownload hook
  -> toPng(ref.current, { pixelRatio: 2, cacheBust: true })
  -> Blob -> anchor download -> "az-uitslag-20260218.png"
```

### Data-integratie per template

- **ResultTemplate**: hergebruikt `useAZFixtures(201, 1)` — dezelfde hook als Nabeschouwing
- **PreviewTemplate**: hergebruikt `useNextAZFixture(201)` — dezelfde hook als Voorbeschouwing
- **StandingsTemplate**: hergebruikt `useEredivisieStandings()`
- **MatchdayTemplate**: combineert `useAZFixtures(201, 1)` + `useNextAZFixture(201)`

### Design van de templates

- Donkere achtergrond (#0F1117) met AZ-rood accent
- Team-logos prominent
- Grote score-typography (JetBrains Mono)
- AZ Fanpage watermark/logo in de hoek
- Competitielogo + speelronde als context

## Geschatte omvang

- **Stap 1**: Pagina + routing + download-hook + 1 template (Uitslag) — 1 prompt
- **Stap 2**: Overige 3 templates — 1-2 prompts
- **Stap 3**: Styling polish, responsive preview scaling — 1 prompt
- **Totaal**: 3-4 prompts

