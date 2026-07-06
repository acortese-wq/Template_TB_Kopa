# NPK WISP TB-KoPa V5.0 – Grobkostenschätzung (Web)

Interaktiver Kostenrechner, erzeugt aus der Excel-Vorlage
`NPK_WISP_TBKoPa_V5.0` (Kooperationsprojekt Tiefbau, Richtpreisliste SCS).

Die Website bildet die **Grobkostenschätzung (GKS)** der Vorlage als
statische Single-Page-Anwendung ab – ohne Server, ohne Build-Schritt.

## Funktionen

- **Tiefbauarbeiten** – 49 Positionen in 6 Kategorien (Graben, Rohre, Schächte,
  Werklöcher, Gebäudeeinführung, Allgemeine Arbeiten) mit Mengeneingabe und
  Live-Berechnung der Zeilen- und Kategorietotale.
- **Montagearbeiten** – 32 Positionen (Kabelarbeiten Material sowie
  Kabelarbeit/Abbruch) inkl. Kennzeichnung nach Leistungsart (CU / GF / AB).
- **Bauplatz-Installation** – automatische Ermittlung der Auftragspauschale
  anhand der Projektsumme (Tiefbau + Montage) mit vier Stufen
  (< 1'500 / < 10'000 / < 50'000 / ≥ 50'000 CHF).
- **Projektübersicht** mit Metadatenfeldern (SPAN Ticket-ID, SID Nr.,
  Baustellenname, Kontakte).
- **Koopa-Synergie** – prozentualer Abzug auf die Zwischensumme.
- **Sticky-Zusammenfassung** mit Gesamttotal, **Drucken/PDF-Export** und
  **Zurücksetzen**.
- Eingaben werden lokal im Browser (`localStorage`) gespeichert – es werden
  keine Daten übertragen.

## Nutzung

Die Anwendung ist rein statisch. Zum Öffnen genügt es, `index.html` im Browser
zu laden – oder z. B. lokal auszuliefern:

```bash
python3 -m http.server 8000
# danach http://localhost:8000 aufrufen
```

## Dateien

| Datei        | Inhalt                                                        |
|--------------|---------------------------------------------------------------|
| `index.html` | Seitenstruktur                                                |
| `styles.css` | Gestaltung (responsiv, Druck-Layout)                          |
| `app.js`     | Rendering & Berechnungslogik                                  |
| `data.js`    | Preisdaten (aus der Excel extrahiert, Richtpreisliste SCS)    |

## Hinweis

Alle Beträge in CHF, ohne MwSt. Es handelt sich um Richtpreise gemäss
Richtpreisliste SCS zu Schätzungszwecken.
