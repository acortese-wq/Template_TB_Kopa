# NPK WISP TB-KoPa V5.0 – Web-Anwendung

Vollständige Web-Umsetzung der Excel-Vorlage `NPK_WISP_TBKoPa_V5.0`
(Kooperationsprojekt Tiefbau, Richtpreisliste SCS). **Alle 12 Arbeitsblätter**
sind als interaktive Ansichten abgebildet – als statische Single-Page-Anwendung
ohne Server und ohne Build-Schritt.

## Ansichten (= Arbeitsblätter)

**Grobkostenschätzung (GKS)**
- **01 · Projektübersicht** – Projektmetadaten und Zusammenzug aller Kategorien
  inkl. BHV/Engineering/Bauleitung-Anteilen und Koopa-Synergie-Reduktion.
- **02 · Tiefbau · Montage · Bauplatz** – 49 Tiefbau- und 32 Montage-Positionen
  mit Mengeneingabe und Live-Totalen; alternativ **Devis-Tool / Offerte**:
  Totalbetrag direkt erfassen (z. B. Tiefbau CHF 25'000) statt Positionen.
  Bauplatz-Installation automatisch nach Projektsumme (4 Pauschalstufen).
- **03 · Engineering · Bauleitung · BHV** – Honorarberechnung wahlweise
  automatisiert (SIA-103-Richtwertmodell) oder manuell (Stunden × Ansatz),
  getrieben durch die Total-Tiefbau-/Montagekosten. Enthält die
  **Honorar-Obergrenze nach Projektgrösse** (K 30 % / M 25 % / G 20 % der
  Baukosten) mit Warnung, dass höhere Kosten begründet werden müssen.

**Offerte & Abrechnung (OAT)**
- **04 · OAT Projektübersicht** – Gegenüberstellung Grobkostenschätzung / Offerte,
  3rd-Party-Handling-Fee, Rabattstufen.
- **05 · Montage NPK EPG** – durchsuchbarer Katalog mit 993 NPK-Positionen,
  Filter nach Leistungsart (CU/GF/AB/KK/tbd), TU-Rabatt und laufendem Total.
- **06 · Tiefbau & Spezial-Aufgaben** – editierbare Offert-Zeilen (Datum,
  Kurztext, AK, Einheit, Menge, Preis) mit Total.
- **07 · Bauplatz-Installation** – automatisierte Auftragspauschale nach
  Projektsumme (Offerte oder GKS).
- **08 · BHV & Engineering** – Positionsweise Erfassung der Stundenaufwände für
  Engineering, Bauleitung und Bauherrenvertretung.
- **09 · Bestelländerung** – editierbare Tabelle der Volumenänderungen (Ausmass).

**Referenz**
- **10 · Parameter & Sprache** – Stundensätze, Rabatte, Auswahllisten.
- **11 · LV-Texte DE/FR/IT** – dreisprachiger Positionskatalog (1147 Positionen),
  durchsuchbar.
- **Änderungskontrolle** – Versionshistorie der Vorlage.

## Sprachen

Die Oberfläche ist **viersprachig: DE / FR / IT / EN** (Umschalter oben rechts).
FR/IT stammen weitgehend aus dem Excel-Blatt „Parameter_Sprache"; EN wurde
ergänzt. Die gewählte Sprache wird lokal gespeichert. Hinweis: Die
**Positionsbeschreibungen** der GKS-Kataloge (Tiefbau/Montage) liegen in der
Excel-Quelle nur auf Deutsch vor und bleiben daher unübersetzt; für den
NPK-Katalog stehen DE/FR/IT unter „LV-Texte" zur Verfügung.

## Funktionen

- Live-Berechnung sämtlicher Totale, blattübergreifend verknüpft
  (GKS → Bauplatz → Honorare → Gesamttotal).
- Alle Eingaben werden lokal im Browser (`localStorage`) gespeichert – es werden
  **keine Daten übertragen**.
- Drucken/PDF-Export, Reset, responsive Darstellung (Desktop & Mobile).

## Nutzung

Rein statisch – `index.html` im Browser öffnen oder lokal ausliefern:

```bash
python3 -m http.server 8000   # danach http://localhost:8000
```

## Dateien

| Datei           | Inhalt                                                       |
|-----------------|--------------------------------------------------------------|
| `index.html`    | Grundgerüst mit Seitenleisten-Navigation                     |
| `styles.css`    | Gestaltung (responsiv + Druck-Layout)                        |
| `app.js`        | View-Router, Rendering & Berechnungslogik aller Blätter      |
| `data.js`       | GKS-Preisdaten (Tiefbau, Montage, Bauplatz)                  |
| `data-extra.js` | NPK-Katalog, LV-Texte, Parameter, Änderungshistorie, Honorar |

## Hinweise

- Alle Beträge in CHF, ohne MwSt.; Richtpreise gemäss Richtpreisliste SCS.
- Das automatisierte Honorarmodell (Blatt 03) liefert **Richtwerte** nach
  SIA 103; für verbindliche Angaben ist die manuelle Berechnung vorgesehen.
