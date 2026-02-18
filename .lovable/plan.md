
# Visuals verrijken: locatie-emoji verwijderen + achtergrondafbeelding upload

## Wat verandert er?

### 1. Locatie-emoji (📍) verwijderen
De emoji voor het stadion wordt verwijderd uit de **ResultTemplate** en **PreviewTemplate**. De venue-tekst blijft staan, maar zonder het icoontje.

### 2. Achtergrondafbeelding upload per template
Een nieuwe upload-knop onder de template-selector waarmee je een eigen foto kunt uploaden die als achtergrond in de template wordt getoond. Denk aan een sfeerbeeld van het stadion, supporters, of het veld.

**Hoe het werkt voor de gebruiker:**
- Onder de template-selector verschijnt een "Achtergrond uploaden" knop
- Je kiest een foto van je apparaat
- De foto wordt als achtergrond in de geselecteerde template getoond (met een donkere overlay zodat tekst leesbaar blijft)
- De achtergrond wordt per template onthouden zolang je op de pagina bent
- Bij het downloaden wordt de achtergrond mee gerenderd in de PNG
- Er is een "Verwijder achtergrond" knop om terug te gaan naar de standaard donkere achtergrond

---

## Technische details

### Bestanden die worden aangepast

| Bestand | Wijziging |
|---------|-----------|
| `ResultTemplate.tsx` | Emoji verwijderen, `backgroundImage` prop toevoegen |
| `PreviewTemplate.tsx` | Emoji verwijderen, `backgroundImage` prop toevoegen |
| `StandingsTemplate.tsx` | `backgroundImage` prop toevoegen |
| `MatchdayTemplate.tsx` | `backgroundImage` prop toevoegen |
| `VisualPreview.tsx` | Upload-state beheren, achtergrond doorgeven aan templates |
| `Visuals.tsx` | State voor achtergronden per template bijhouden |

### Nieuw bestand

| Bestand | Doel |
|---------|------|
| `src/components/visuals/BackgroundUploader.tsx` | Upload-component met preview-thumbnail en verwijder-knop |

### Aanpak achtergrond in templates

Elke template krijgt een optionele `backgroundImage?: string` prop (een data-URL of object-URL). Wanneer aanwezig:
- De vaste `bg-[#0F1117]` achtergrond wordt vervangen door de afbeelding
- Een semi-transparante donkere overlay (`bg-black/60`) wordt erover gelegd zodat tekst leesbaar blijft
- De afbeelding wordt getoond als `object-cover` zodat het het hele canvas vult

### Upload flow

- Gebruik een standaard `<input type="file" accept="image/*">` (geen Supabase storage nodig)
- De afbeelding wordt als lokale object-URL (`URL.createObjectURL`) in state opgeslagen
- Geen server-side opslag: alles blijft in de browser-sessie
- Bij download rendert `html-to-image` de achtergrond mee omdat het een gewoon DOM-element is

### Geschatte omvang
2 prompts: 1 voor de emoji-verwijdering + upload-component + template-aanpassingen, en 1 voor eventuele polish.
