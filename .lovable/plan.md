

# Vier nieuwe foto-templates voor Visuals

## Overzicht

Vier nieuwe templates die allemaal hetzelfde principe volgen als Speler en Citaat: een eigen foto vertelt het verhaal, met tekst eroverheen.

### 1. Breaking News
- **Doel**: Transfers, blessures, breaking nieuws
- **Invoervelden**: Headline + subtitle
- **Layout**: Rood "BREAKING" accent-balkje, grote vette headline, kleinere subtitel eronder
- **Logo**: Rechtsboven

### 2. Statistiek
- **Doel**: Mijlpalen uitlichten (bijv. "100 goals", "50 caps")
- **Invoervelden**: Getal/waarde + beschrijving
- **Layout**: Enorm groot getal centraal, beschrijving eronder
- **Logo**: Rechtsboven

### 3. Matchday (intern id: `gameday`)
- **Doel**: Wedstrijddag-aankondiging met sfeer
- **Invoervelden**: Geen (haalt automatisch de volgende wedstrijd op via bestaande API)
- **Layout**: "MATCHDAY" tekst bovenaan, teamlogo's + aftrapstijd centraal, stadion/competitie info onderaan, alles over de geuploade sfeerfoto
- **Logo**: Rechtsboven

### 4. Poll / Stelling
- **Doel**: Engagement op social media
- **Invoervelden**: Vraag/stelling
- **Layout**: Grote vraagtekst centraal over de foto, "Wat denk jij?" of eigen tekst
- **Logo**: Rechtsboven

---

## Technische aanpak

### TemplateSelector.tsx
- `TemplateType` uitbreiden met `'breaking' | 'stat' | 'gameday' | 'poll'`
- Vier nieuwe items toevoegen met passende iconen (Zap, Hash, Flame, MessageCircle)

### Nieuwe template-bestanden
- `src/components/visuals/templates/BreakingTemplate.tsx` — Props: `headline`, `subtitle`, `backgroundImage`
- `src/components/visuals/templates/StatTemplate.tsx` — Props: `statValue`, `statLabel`, `backgroundImage`
- `src/components/visuals/templates/GamedayTemplate.tsx` — Props: `fixture` (van API), `backgroundImage`
- `src/components/visuals/templates/PollTemplate.tsx` — Props: `question`, `backgroundImage`

Alle templates volgen hetzelfde patroon: 1080x1080, full-bleed foto, gradient overlay, rode lijn bovenaan, AZ Fanpage logo rechtsboven.

### Visuals.tsx
- State uitbreiden met `headline`, `subtitle`, `statValue`, `statLabel`, `question`
- Conditionele invoervelden per template tonen:
  - **breaking**: headline + subtitle
  - **stat**: getal + beschrijving
  - **gameday**: geen extra velden (API-data)
  - **poll**: vraag/stelling
- `backgrounds` record uitbreiden met de vier nieuwe keys

### VisualPreview.tsx
- Imports voor de vier nieuwe templates
- `TEMPLATE_SIZES` uitbreiden (allemaal 1080x1080)
- Download-labels toevoegen
- Props doorsturen en conditioneel renderen
- Gameday-template krijgt `nextFixture` mee (al beschikbaar via bestaande hook)

### Geen nieuwe dependencies of API-calls
- Gameday hergebruikt de bestaande `useNextAZFixture` hook
- De andere drie zijn puur handmatige tekst + foto

