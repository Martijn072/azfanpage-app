
# Responsive Mobile Layout

## Huidige situatie

De sidebar is altijd zichtbaar op alle schermformaten, inclusief mobiel. Op een telefoon neemt de sidebar ~240px in beslag, waardoor de content bijna onleesbaar wordt. Er is geen hamburger-menu, geen off-canvas navigatie, en de content-area wordt extreem smal.

## Aanpak

### 1. Sidebar omzetten naar mobiel hamburger-menu

**Sidebar.tsx** aanpassen:
- Op desktop (md en groter): sidebar blijft zoals hij is (vast aan de linkerkant)
- Op mobiel (kleiner dan md/768px): sidebar verbergen en vervangen door een **off-canvas drawer** die opent via een hamburger-knop
- De sidebar gebruikt een overlay wanneer geopend op mobiel
- Menu sluit automatisch bij het klikken op een navigatie-item

### 2. TopBar.tsx aanpassen voor mobiel

- Hamburger-icoon links toevoegen (alleen zichtbaar op mobiel)
- Paginanaam en seizoen-selector compacter maken op mobiel
- "Redactie" label verbergen op kleine schermen

### 3. AppLayout.tsx aanpassen

- De layout-wrapper moet de mobiele sidebar-state doorgeven
- Op mobiel: geen vaste sidebar, alleen de hamburger-triggered drawer

### 4. Content-pagina's: kleine verbeteringen

De meeste pagina's gebruiken al responsive classes (`grid-cols-1 lg:grid-cols-2`, `sm:flex-row`, etc.), dus die zijn al redelijk goed. Specifieke verbeteringen:

- **Visuals.tsx**: Template-selector knoppen op mobiel kleiner maken (alleen icoon + korte label, format-tekst verbergen)
- **Voorbeschouwing/Nabeschouwing**: Match-header op mobiel versimpelen (team-namen onder logo's i.p.v. ernaast)
- **Competitie**: Tabel is al responsive met `hidden sm:table-cell` -- dat is goed

### 5. Padding en spacing aanpassen

- `AppLayout` main padding: `p-6` wordt `p-4 md:p-6`
- Content max-width kan op mobiel volle breedte gebruiken

## Technisch overzicht

### Bestanden die wijzigen:
- `src/components/layout/Sidebar.tsx` -- hamburger-menu + off-canvas drawer op mobiel
- `src/components/layout/TopBar.tsx` -- hamburger-knop, compactere mobiele weergave
- `src/components/layout/AppLayout.tsx` -- sidebar-state management, padding-aanpassing
- `src/components/visuals/TemplateSelector.tsx` -- format-label verbergen op mobiel
- `src/pages/app/Voorbeschouwing.tsx` -- match-header compacter op mobiel
- `src/pages/app/Nabeschouwing.tsx` -- match-header compacter op mobiel

### Geen nieuwe dependencies nodig
De off-canvas drawer wordt gebouwd met standaard Tailwind CSS (translate-x + overlay).
