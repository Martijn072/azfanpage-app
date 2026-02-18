

# Stand-template: AZ-focus card

## Concept

De huidige tabel met 10 teams wordt vervangen door een visueel sterke kaart die draait om AZ. Het idee:

- **Bovenaan**: "Eredivisie" + seizoen als header, met het AZ Fanpage logo
- **Centraal blok**: AZ groot uitgelicht met:
  - Positie (groot cijfer, bijv. "6e")
  - Club logo + naam
  - Punten (groot)
  - Vorm: de laatste 5 wedstrijden als gekleurde bolletjes (groen = winst, grijs = gelijk, rood = verlies)
  - Gespeeld / Doelsaldo
- **Onderaan**: Een compacte lijst met 2 teams boven AZ en 2 teams onder AZ, zodat je direct de concurrentie ziet. Elk met rank, logo, naam en punten.

## Visuele stijl

- Formaat blijft 1080x1350 (story-formaat)
- Donkere achtergrond met optionele achtergrondafbeelding (bestaande upload-functie)
- AZ-rij krijgt een rode accent-border en subtiele rode achtergrond
- De omliggende teams zijn kleiner en gedempt weergegeven
- Rode gradient-lijn bovenaan (consistent met andere templates)

## Technische aanpak

### Bestand: `src/components/visuals/templates/StandingsTemplate.tsx`

Volledige herbouw van de template-inhoud:

1. **AZ detectie**: Zoek AZ in de standings-array op basis van teamnaam (bestaande logica)
2. **Context-teams**: Pak 2 teams boven en 2 teams onder AZ's positie uit de volledige stand
3. **Centraal AZ-blok**: Groot weergegeven met positie, logo, punten en vorm-indicator
4. **Vorm-bolletjes**: De `form`-string uit de API (bijv. "WWDLW") omzetten naar gekleurde cirkels
5. **Omliggende teams**: Compacte rijen met rank, klein logo, naam en punten

### Geen andere bestanden nodig

De props (`standings`, `backgroundImage`) en het formaat (1080x1350) blijven identiek. Alleen de visuele inhoud van de template verandert.

