/* Übersetzungen DE / FR / IT / EN.
   FR/IT weitgehend aus Excel-Blatt 10 (Parameter_Sprache), EN ergänzt.
   Schlüssel = deutscher Originaltext. Dynamische Sätze nutzen {0}, {1} … (siehe t()). */
const I18N = {
  // ---- Header / Chrome ----
  'Kooperationsprojekt Tiefbau · Offerte- & Abrechnungstool': {
    FR: 'Projet de coopération génie civil · Outil d’offre et de décompte',
    IT: 'Progetto di cooperazione genio civile · Strumento di offerta e conteggio',
    EN: 'Civil engineering cooperation project · Offer & billing tool' },
  'Total GKS': { FR: 'Total EAC', IT: 'Totale SAC', EN: 'Total estimate' },
  'Drucken': { FR: 'Imprimer', IT: 'Stampa', EN: 'Print' },
  'Reset': { FR: 'Réinitialiser', IT: 'Reimposta', EN: 'Reset' },
  'Zurücksetzen': { FR: 'Réinitialiser', IT: 'Reimposta', EN: 'Reset' },

  // ---- Footer ----
  'NPK WISP TB-KoPa V5.0 · aus der Excel-Vorlage erzeugt': {
    FR: 'NPK WISP TB-KoPa V5.0 · généré à partir du modèle Excel',
    IT: 'NPK WISP TB-KoPa V5.0 · generato dal modello Excel',
    EN: 'NPK WISP TB-KoPa V5.0 · generated from the Excel template' },
  'Richtpreisliste SCS · Berechnung im Browser, keine Datenübertragung': {
    FR: 'Liste de prix indicatifs SCS · calcul dans le navigateur, aucune transmission de données',
    IT: 'Listino prezzi indicativi SCS · calcolo nel browser, nessuna trasmissione di dati',
    EN: 'SCS indicative price list · calculated in the browser, no data transmission' },

  // ---- Navigationsgruppen ----
  'Grobkostenschätzung': { FR: 'Estimation approximative des coûts', IT: 'Stima approssimativa dei costi', EN: 'Rough cost estimate' },
  'Offerte & Abrechnung (OAT)': { FR: 'Offre & décompte (OAT)', IT: 'Offerta e conteggio (OAT)', EN: 'Offer & billing (OAT)' },
  'Referenz': { FR: 'Référence', IT: 'Riferimento', EN: 'Reference' },

  // ---- Navigationseinträge ----
  'Projektübersicht': { FR: 'Aperçu du projet', IT: 'Panoramica del progetto', EN: 'Project overview' },
  'Tiefbau · Montage · Bauplatz': { FR: 'Génie civil · Montage · Chantier', IT: 'Genio civile · Montaggio · Cantiere', EN: 'Civil works · Assembly · Site' },
  'Engineering · BL · BHV': { FR: 'Engineering · DT · RMO', IT: 'Engineering · DL · RC', EN: 'Engineering · CM · CR' },
  'OAT Projektübersicht': { FR: 'Aperçu du projet OAT', IT: 'Panoramica del progetto OAT', EN: 'OAT project overview' },
  'Montage NPK EPG': { FR: 'Montage NPK EPG', IT: 'Montaggio NPK EPG', EN: 'Assembly NPK EPG' },
  'Tiefbau & Spez.-Aufgaben': { FR: 'Génie civil & tâches spéc.', IT: 'Genio civile & compiti spec.', EN: 'Civil works & special tasks' },
  'Bauplatz-Installation': { FR: 'Installation de chantier', IT: 'Installazione cantiere', EN: 'Site installation' },
  'BHV & Engineering': { FR: 'RMO & Engineering', IT: 'RC & Engineering', EN: 'CR & Engineering' },
  'Bestelländerung': { FR: 'Modification de commande', IT: 'Modifica ordine', EN: 'Order change' },
  'Parameter & Sprache': { FR: 'Paramètres & langue', IT: 'Parametri e lingua', EN: 'Parameters & language' },
  'LV-Texte DE/FR/IT': { FR: 'Textes CAN DE/FR/IT', IT: 'Testi CPN DE/FR/IT', EN: 'BoQ texts DE/FR/IT' },
  'Änderungskontrolle': { FR: 'Contrôle des modifications', IT: 'Controllo delle modifiche', EN: 'Change control' },

  // ---- View-Titel ----
  '01 · Projektübersicht': { FR: '01 · Aperçu du projet', IT: '01 · Panoramica del progetto', EN: '01 · Project overview' },
  '02 · Tiefbau · Montage · Bauplatz': { FR: '02 · Génie civil · Montage · Chantier', IT: '02 · Genio civile · Montaggio · Cantiere', EN: '02 · Civil works · Assembly · Site' },
  '03 · Engineering · Bauleitung · Bauherrenvertretung': { FR: '03 · Engineering · Direction des travaux · Représentation du maître d’ouvrage', IT: '03 · Engineering · Direzione lavori · Rappresentanza del committente', EN: '03 · Engineering · Construction management · Client representation' },
  '04 · OAT Projektübersicht': { FR: '04 · Aperçu du projet OAT', IT: '04 · Panoramica del progetto OAT', EN: '04 · OAT project overview' },
  '05 · Montage NPK EPG': { FR: '05 · Montage NPK EPG', IT: '05 · Montaggio NPK EPG', EN: '05 · Assembly NPK EPG' },
  '06 · Tiefbau & Spezial-Aufgaben': { FR: '06 · Génie civil & tâches spéciales', IT: '06 · Genio civile & compiti speciali', EN: '06 · Civil works & special tasks' },
  '07 · Bauplatz-Installation': { FR: '07 · Installation de chantier', IT: '07 · Installazione cantiere', EN: '07 · Site installation' },
  '08 · BHV & Engineering': { FR: '08 · RMO & Engineering', IT: '08 · RC & Engineering', EN: '08 · CR & Engineering' },
  '09 · Bestelländerung': { FR: '09 · Modification de commande', IT: '09 · Modifica ordine', EN: '09 · Order change' },
  '10 · Parameter & Sprache': { FR: '10 · Paramètres & langue', IT: '10 · Parametri e lingua', EN: '10 · Parameters & language' },
  '11 · LV-Texte DE / FR / IT': { FR: '11 · Textes CAN DE / FR / IT', IT: '11 · Testi CPN DE / FR / IT', EN: '11 · BoQ texts DE / FR / IT' },

  // ---- View-Untertitel ----
  'Grobkostenschätzung Kooperationsprojekt Tiefbau – Zusammenzug aller Positionen': {
    FR: 'Estimation des coûts du projet de coopération génie civil – récapitulatif de toutes les positions',
    IT: 'Stima dei costi del progetto di cooperazione genio civile – riepilogo di tutte le posizioni',
    EN: 'Cost estimate of the civil engineering cooperation project – summary of all items' },
  'Grobkostenschätzung nach Positionen (Richtpreisliste) oder als Totalbetrag (Devis-Tool / Offerte)': {
    FR: 'Estimation des coûts par position (liste de prix) ou comme montant total (outil devis / offre)',
    IT: 'Stima dei costi per posizione (listino prezzi) o come importo totale (strumento preventivo / offerta)',
    EN: 'Cost estimate by item (price list) or as a total amount (quote tool / offer)' },
  'Honorarberechnung nach SIA-103-Modell (Richtwert) oder manuell (Stunden × Ansatz)': {
    FR: 'Calcul des honoraires selon le modèle SIA 103 (valeur indicative) ou manuellement (heures × taux)',
    IT: 'Calcolo dell’onorario secondo il modello SIA 103 (valore indicativo) o manualmente (ore × tariffa)',
    EN: 'Fee calculation per the SIA 103 model (indicative) or manually (hours × rate)' },
  'Offerte & Abrechnung – Gegenüberstellung Grobkostenschätzung / Offerte': {
    FR: 'Offre & décompte – comparaison estimation des coûts / offre',
    IT: 'Offerta e conteggio – confronto stima dei costi / offerta',
    EN: 'Offer & billing – comparison of cost estimate / offer' },
  'Tiefbau-Koopa-Offerten gemäss separater Offerte des Koopa-TB-Partners': {
    FR: 'Offres de coopération génie civil selon l’offre séparée du partenaire GC',
    IT: 'Offerte di cooperazione genio civile secondo l’offerta separata del partner GC',
    EN: 'Civil works cooperation offers per the separate offer of the civil works partner' },
  'Automatisierte Auftragspauschale nach Projektsumme': {
    FR: 'Forfait de commande automatisé selon le montant du projet',
    IT: 'Forfait d’ordine automatizzato secondo l’importo del progetto',
    EN: 'Automated lump-sum order fee based on project amount' },
  'Erfassung der Aufwände für Engineering, Bauleitung und Bauherrenvertretung nach Positionen': {
    FR: 'Saisie des charges pour Engineering, direction des travaux et représentation du maître d’ouvrage par position',
    IT: 'Registrazione degli oneri per Engineering, direzione lavori e rappresentanza del committente per posizione',
    EN: 'Recording of efforts for Engineering, construction management and client representation by item' },
  'Volumenänderungen (Ausmass) – Erfassung der Bestelländerungen': {
    FR: 'Modifications de volume (métré) – saisie des modifications de commande',
    IT: 'Modifiche di volume (rilievo) – registrazione delle modifiche d’ordine',
    EN: 'Volume changes (measurement) – recording of order changes' },
  'Stundensätze, Rabatte und Auswahllisten (Referenz)': {
    FR: 'Taux horaires, rabais et listes de sélection (référence)',
    IT: 'Tariffe orarie, sconti ed elenchi di selezione (riferimento)',
    EN: 'Hourly rates, discounts and selection lists (reference)' },
  'Versionshistorie der Vorlage': { FR: 'Historique des versions du modèle', IT: 'Cronologia delle versioni del modello', EN: 'Version history of the template' },

  // ---- Card-Titel ----
  'Grobkostenschätzung SCS': { FR: 'Estimation approximative des coûts SCS', IT: 'Stima approssimativa dei costi SCS', EN: 'SCS rough cost estimate' },
  'BHV & Engineering & Bauleitung': { FR: 'RMO & Engineering & direction des travaux', IT: 'RC & Engineering & direzione lavori', EN: 'CR & Engineering & construction management' },
  'Honorar-Obergrenze (BHV / BL / ENG)': { FR: 'Plafond des honoraires (RMO / DT / ENG)', IT: 'Limite massimo dell’onorario (RC / DL / ENG)', EN: 'Fee cap (CR / CM / ENG)' },
  'Zusammenfassung': { FR: 'Récapitulatif', IT: 'Riepilogo', EN: 'Summary' },
  'Grundlagen der Honorarberechnung': { FR: 'Bases du calcul des honoraires', IT: 'Basi del calcolo dell’onorario', EN: 'Basis of the fee calculation' },
  'Weitere Angaben': { FR: 'Autres indications', IT: 'Ulteriori indicazioni', EN: 'Further details' },
  'Kategorienübersicht': { FR: 'Aperçu par catégorie', IT: 'Panoramica per categoria', EN: 'Category overview' },
  'Rabattstufen (Referenz)': { FR: 'Niveaux de rabais (référence)', IT: 'Livelli di sconto (riferimento)', EN: 'Discount levels (reference)' },
  'Grundlage': { FR: 'Base', IT: 'Base', EN: 'Basis' },
  'Stundensätze': { FR: 'Taux horaires', IT: 'Tariffe orarie', EN: 'Hourly rates' },
  'Rabatte für Projekte ≥ 50 kCHF': { FR: 'Rabais pour projets ≥ 50 kCHF', IT: 'Sconti per progetti ≥ 50 kCHF', EN: 'Discounts for projects ≥ 50 kCHF' },
  'Auswahllisten & Einheiten': { FR: 'Listes de sélection & unités', IT: 'Elenchi di selezione e unità', EN: 'Selection lists & units' },
  'Herleitung Tiefbau-Honorar (nach Baukosten / Schwierigkeitsgrad)': {
    FR: 'Dérivation des honoraires génie civil (selon coûts de construction / degré de difficulté)',
    IT: 'Derivazione dell’onorario genio civile (secondo costi di costruzione / grado di difficoltà)',
    EN: 'Derivation of civil works fee (by construction cost / difficulty level)' },
  'Kabel / Montage (unverändert)': { FR: 'Câble / montage (inchangé)', IT: 'Cavo / montaggio (invariato)', EN: 'Cable / assembly (unchanged)' },

  // ---- Metadaten-Felder ----
  'Baustellenname': { FR: 'Nom du chantier', IT: 'Nome del cantiere', EN: 'Site name' },
  'Kontakt Swisscom': { FR: 'Contact Swisscom', IT: 'Contatto Swisscom', EN: 'Swisscom contact' },
  'Kontakt TU': { FR: 'Contact TU', IT: 'Contatto TU', EN: 'TU contact' },

  // ---- Tabellen-/Spaltenüberschriften & Kategorien ----
  'Kategorie': { FR: 'Catégorie', IT: 'Categoria', EN: 'Category' },
  'Grobkostenschätzung [CHF]': { FR: 'Estimation des coûts [CHF]', IT: 'Stima dei costi [CHF]', EN: 'Cost estimate [CHF]' },
  'Beschreibung': { FR: 'Description', IT: 'Descrizione', EN: 'Description' },
  'Einheit': { FR: 'Unité', IT: 'Unità', EN: 'Unit' },
  'Richtpreis': { FR: 'Prix indicatif', IT: 'Prezzo indicativo', EN: 'Unit price' },
  'Menge': { FR: 'Quantité', IT: 'Quantità', EN: 'Quantity' },
  'Total': { FR: 'Total', IT: 'Totale', EN: 'Total' },
  'Position': { FR: 'Position', IT: 'Posizione', EN: 'Item' },
  'Kurztext': { FR: 'Texte court', IT: 'Testo breve', EN: 'Short text' },
  'Deutsch': { FR: 'Allemand', IT: 'Tedesco', EN: 'German' },
  'Grobkostenschätzung': { FR: 'Estimation des coûts', IT: 'Stima dei costi', EN: 'Cost estimate' },
  'Offerte / Bestellung': { FR: 'Offre / commande', IT: 'Offerta / ordine', EN: 'Offer / order' },
  'Preis': { FR: 'Prix', IT: 'Prezzo', EN: 'Price' },
  'Baukosten-Bereich': { FR: 'Plage des coûts de construction', IT: 'Intervallo costi di costruzione', EN: 'Construction cost range' },
  'Max. Anteil': { FR: 'Part max.', IT: 'Quota max.', EN: 'Max. share' },
  'Max. Honorar': { FR: 'Honoraires max.', IT: 'Onorario max.', EN: 'Max. fee' },
  'Version': { FR: 'Version', IT: 'Versione', EN: 'Version' },
  'Datum': { FR: 'Date', IT: 'Data', EN: 'Date' },
  'Änderungen': { FR: 'Modifications', IT: 'Modifiche', EN: 'Changes' },
  'Arbeitsblatt': { FR: 'Feuille de calcul', IT: 'Foglio di lavoro', EN: 'Worksheet' },
  'Verfasser': { FR: 'Auteur', IT: 'Autore', EN: 'Author' },
  'Freigabe': { FR: 'Validation', IT: 'Approvazione', EN: 'Approval' },
  'Projektsumme': { FR: 'Montant du projet', IT: 'Importo del progetto', EN: 'Project amount' },
  'TU-Rabatt (ohne SCS-Material)': { FR: 'Rabais TU (sans matériel SCS)', IT: 'Sconto TU (senza materiale SCS)', EN: 'TU discount (excl. SCS material)' },
  'TU-Rabatt (nur h-Positionen)': { FR: 'Rabais TU (seul. positions h)', IT: 'Sconto TU (solo posizioni h)', EN: 'TU discount (h-items only)' },
  'Leistung': { FR: 'Prestation', IT: 'Prestazione', EN: 'Service' },
  'Ansatz [CHF/h]': { FR: 'Taux [CHF/h]', IT: 'Tariffa [CHF/h]', EN: 'Rate [CHF/h]' },
  'Art': { FR: 'Type', IT: 'Tipo', EN: 'Type' },
  'Wert': { FR: 'Valeur', IT: 'Valore', EN: 'Value' },
  'Stunden': { FR: 'Heures', IT: 'Ore', EN: 'Hours' },
  'Leistungsart (AK)': { FR: 'Type de prestation (AK)', IT: 'Tipo di prestazione (AK)', EN: 'Service type (AK)' },
  'Einheiten': { FR: 'Unités', IT: 'Unità', EN: 'Units' },
  'Sprachen': { FR: 'Langues', IT: 'Lingue', EN: 'Languages' },
  'Berechnung': { FR: 'Calcul', IT: 'Calcolo', EN: 'Calculation' },

  // ---- Kategorien / Summary ----
  'Tiefbauarbeiten': { FR: 'Travaux de génie civil', IT: 'Lavori di genio civile', EN: 'Civil works' },
  'Montagearbeiten': { FR: 'Travaux de montage', IT: 'Lavori di montaggio', EN: 'Assembly works' },
  'Installation Bauplatz': { FR: 'Installation de chantier', IT: 'Installazione cantiere', EN: 'Site installation' },
  'Engineering': { FR: 'Engineering', IT: 'Engineering', EN: 'Engineering' },
  'Dritt-Ingenieur': { FR: 'Ingénieur tiers', IT: 'Ingegnere terzo', EN: 'Third-party engineer' },
  'Bauleitung': { FR: 'Direction des travaux', IT: 'Direzione lavori', EN: 'Construction management' },
  'Bauherrenvertretung': { FR: 'Représentation du maître d’ouvrage', IT: 'Rappresentanza del committente', EN: 'Client representation' },
  'Koopa-Synergie': { FR: 'Synergie coopération', IT: 'Sinergia cooperazione', EN: 'Cooperation synergy' },
  'Zwischentotal': { FR: 'Sous-total', IT: 'Subtotale', EN: 'Subtotal' },
  'Kabelarbeiten': { FR: 'Travaux de câblage', IT: 'Lavori di cablaggio', EN: 'Cable works' },

  // ---- Buttons / Toggles ----
  '+ Zeile hinzufügen': { FR: '+ Ajouter une ligne', IT: '+ Aggiungi riga', EN: '+ Add row' },
  'Nur erfasste': { FR: 'Seulement saisis', IT: 'Solo inseriti', EN: 'Only entered' },
  'Alle zeigen': { FR: 'Tout afficher', IT: 'Mostra tutti', EN: 'Show all' },
  'Richtpreisliste (Positionen)': { FR: 'Liste de prix (positions)', IT: 'Listino prezzi (posizioni)', EN: 'Price list (items)' },
  'Devis-Tool / Offerte (Totalbetrag)': { FR: 'Outil devis / offre (montant total)', IT: 'Strumento preventivo / offerta (importo totale)', EN: 'Quote tool / offer (total amount)' },
  'Totalbetrag [CHF]': { FR: 'Montant total [CHF]', IT: 'Importo totale [CHF]', EN: 'Total amount [CHF]' },
  'z. B. 25000': { FR: 'p. ex. 25000', IT: 'es. 25000', EN: 'e.g. 25000' },
  'Direkt erfasster Offert-/Devis-Betrag. Überschreibt die Positionsberechnung und fliesst in Totale, Bauplatz-Installation und Honorar-Obergrenze ein.': {
    FR: 'Montant d’offre/devis saisi directement. Remplace le calcul par position et alimente les totaux, l’installation de chantier et le plafond des honoraires.',
    IT: 'Importo di offerta/preventivo inserito direttamente. Sostituisce il calcolo per posizione e confluisce nei totali, nell’installazione di cantiere e nel limite dell’onorario.',
    EN: 'Directly entered offer/quote amount. Overrides the item-based calculation and feeds into totals, site installation and the fee cap.' },
  'Automatisiert (SIA)': { FR: 'Automatisé (SIA)', IT: 'Automatizzato (SIA)', EN: 'Automated (SIA)' },
  'Manuell': { FR: 'Manuel', IT: 'Manuale', EN: 'Manual' },

  // ---- Honorar ----
  'Honorar Engineering': { FR: 'Honoraires Engineering', IT: 'Onorario Engineering', EN: 'Engineering fee' },
  'Honorar Bauleitung': { FR: 'Honoraires direction des travaux', IT: 'Onorario direzione lavori', EN: 'Construction management fee' },
  'Honorar Bauherrenvertretung': { FR: 'Honoraires représentation du maître d’ouvrage', IT: 'Onorario rappresentanza del committente', EN: 'Client representation fee' },
  'Schwierigkeitsgrad Tiefbau': { FR: 'Degré de difficulté génie civil', IT: 'Grado di difficoltà genio civile', EN: 'Difficulty level civil works' },
  'Schwierigkeitsgrad Kabel': { FR: 'Degré de difficulté câble', IT: 'Grado di difficoltà cavo', EN: 'Difficulty level cable' },
  'Anzahl Regiestunden': { FR: 'Nombre d’heures en régie', IT: 'Numero di ore in economia', EN: 'Number of time-and-material hours' },
  'Stundensatz': { FR: 'Taux horaire', IT: 'Tariffa oraria', EN: 'Hourly rate' },
  'Baukosten Tiefbau (Grundlage Zeitaufwand)': { FR: 'Coûts génie civil (base temps)', IT: 'Costi genio civile (base tempo)', EN: 'Civil works cost (basis for time)' },
  'Schwierigkeitsgrad n (Tiefbau)': { FR: 'Degré de difficulté n (génie civil)', IT: 'Grado di difficoltà n (genio civile)', EN: 'Difficulty n (civil works)' },
  'Leistungsanteil q (Tiefbau)': { FR: 'Part de prestation q (génie civil)', IT: 'Quota di prestazione q (genio civile)', EN: 'Service share q (civil works)' },
  'Anpassungsfaktor r': { FR: 'Facteur d’ajustement r', IT: 'Fattore di adeguamento r', EN: 'Adjustment factor r' },
  'Baukosten Kabel/Montage': { FR: 'Coûts câble/montage', IT: 'Costi cavo/montaggio', EN: 'Cable/assembly cost' },
  'Schwierigkeitsgrad n · Leistungsanteil q': { FR: 'Degré de difficulté n · part de prestation q', IT: 'Grado di difficoltà n · quota di prestazione q', EN: 'Difficulty n · service share q' },
  'Honorar Kabel/Montage': { FR: 'Honoraires câble/montage', IT: 'Onorario cavo/montaggio', EN: 'Cable/assembly fee' },
  'einfache Aufgaben (ohne UMSA)': { FR: 'tâches simples (sans UMSA)', IT: 'compiti semplici (senza UMSA)', EN: 'simple tasks (without UMSA)' },
  'anspruchsvolle Aufgaben (einfache UMSA)': { FR: 'tâches exigeantes (UMSA simples)', IT: 'compiti impegnativi (UMSA semplici)', EN: 'demanding tasks (simple UMSA)' },
  'sehr anspruchsvolle Aufgaben (komplexe UMSA)': { FR: 'tâches très exigeantes (UMSA complexes)', IT: 'compiti molto impegnativi (UMSA complessi)', EN: 'very demanding tasks (complex UMSA)' },
  'Klein': { FR: 'Petit', IT: 'Piccolo', EN: 'Small' },
  'Mittel': { FR: 'Moyen', IT: 'Medio', EN: 'Medium' },
  'Gross': { FR: 'Grand', IT: 'Grande', EN: 'Large' },
  'Ohne Dritt-Ingenieur-Leistungen.': { FR: 'Sans prestations d’ingénieur tiers.', IT: 'Senza prestazioni di ingegnere terzo.', EN: 'Excluding third-party engineer services.' },

  // ---- Parameter-View Werte ----
  'Montage (Basis)': { FR: 'Montage (base)', IT: 'Montaggio (base)', EN: 'Assembly (base)' },
  'TU-Rabatt Material': { FR: 'Rabais TU matériel', IT: 'Sconto TU materiale', EN: 'TU material discount' },
  'TU-Rabatt Regie (h-Positionen)': { FR: 'Rabais TU régie (positions h)', IT: 'Sconto TU economia (posizioni h)', EN: 'TU time-and-material discount (h-items)' },
  '3rd-Party-Handling-Fee': { FR: '3rd Party Handling Fee', IT: '3rd Party Handling Fee', EN: '3rd-party handling fee' },

  // ---- Dynamische Sätze (t() mit {0} …) ----
  'Offert-Katalog mit {0} NPK-Positionen – Menge erfassen': {
    FR: 'Catalogue d’offre avec {0} positions NPK – saisir la quantité',
    IT: 'Catalogo d’offerta con {0} posizioni NPK – inserire la quantità',
    EN: 'Offer catalogue with {0} NPK items – enter quantity' },
  'Dreisprachiger Positionskatalog ({0} Positionen)': {
    FR: 'Catalogue de positions trilingue ({0} positions)',
    IT: 'Catalogo di posizioni trilingue ({0} posizioni)',
    EN: 'Trilingual item catalogue ({0} items)' },
  'Maximaler Honoraranteil nach Projektgrösse (Baukosten Tiefbau + Montage = {0}).': {
    FR: 'Part maximale des honoraires selon la taille du projet (coûts génie civil + montage = {0}).',
    IT: 'Quota massima dell’onorario secondo la dimensione del progetto (costi genio civile + montaggio = {0}).',
    EN: 'Maximum fee share by project size (civil works + assembly cost = {0}).' },
  'Innerhalb der Obergrenze: Honorar {0} von max. {1}.': {
    FR: 'Dans la limite : honoraires {0} sur max. {1}.',
    IT: 'Entro il limite: onorario {0} su max. {1}.',
    EN: 'Within the cap: fee {0} of max. {1}.' },
  'Obergrenze überschritten.': { FR: 'Plafond dépassé.', IT: 'Limite superato.', EN: 'Cap exceeded.' },
  'Das Honorar ({0}) liegt über dem Maximum von {1} ({2} % der Baukosten). Höhere Kosten müssen begründet werden.': {
    FR: 'Les honoraires ({0}) dépassent le maximum de {1} ({2} % des coûts de construction). Des coûts plus élevés doivent être justifiés.',
    IT: 'L’onorario ({0}) supera il massimo di {1} ({2} % dei costi di costruzione). Costi più elevati devono essere giustificati.',
    EN: 'The fee ({0}) exceeds the maximum of {1} ({2} % of construction cost). Higher costs must be justified.' },
  'Die Total-Tiefbau- und -Montagekosten treiben die automatisierte Honorarberechnung sowie die Obergrenze (Kategorie {0}, max. {1} %).': {
    FR: 'Les coûts totaux génie civil et montage déterminent le calcul automatisé des honoraires ainsi que le plafond (catégorie {0}, max. {1} %).',
    IT: 'I costi totali genio civile e montaggio determinano il calcolo automatizzato dell’onorario e il limite massimo (categoria {0}, max. {1} %).',
    EN: 'The total civil works and assembly costs drive the automated fee calculation and the cap (category {0}, max. {1} %).' },
  'Total Tiefbaukosten (Devis-Tool)': { FR: 'Coûts totaux génie civil (outil devis)', IT: 'Costi totali genio civile (strumento preventivo)', EN: 'Total civil works cost (quote tool)' },
  'Total Tiefbaukosten (Positionen)': { FR: 'Coûts totaux génie civil (positions)', IT: 'Costi totali genio civile (posizioni)', EN: 'Total civil works cost (items)' },
  'Total Montagekosten (Devis-Tool)': { FR: 'Coûts totaux montage (outil devis)', IT: 'Costi totali montaggio (strumento preventivo)', EN: 'Total assembly cost (quote tool)' },
  'Total Montagekosten (Positionen)': { FR: 'Coûts totaux montage (positions)', IT: 'Costi totali montaggio (posizioni)', EN: 'Total assembly cost (items)' },
  'Baukosten (Basis Honorar-Obergrenze)': { FR: 'Coûts de construction (base du plafond)', IT: 'Costi di costruzione (base del limite)', EN: 'Construction cost (fee-cap basis)' },

  // ---- Übersicht: BHV/ENG/BL Aufteilung ----
  'Summe BHV & Engineering & Bauleitung': { FR: 'Somme RMO & Engineering & direction des travaux', IT: 'Somma RC & Engineering & direzione lavori', EN: 'Sum CR & Engineering & construction management' },
  'davon Engineering': { FR: 'dont Engineering', IT: 'di cui Engineering', EN: 'of which Engineering' },
  'davon Bauleitung': { FR: 'dont direction des travaux', IT: 'di cui direzione lavori', EN: 'of which construction management' },
  'davon Bauherrenvertretung': { FR: 'dont représentation du maître d’ouvrage', IT: 'di cui rappresentanza del committente', EN: 'of which client representation' },
  'Anteil am Bestellvolumen (Zwischentotal)': { FR: 'Part du volume de commande (sous-total)', IT: 'Quota del volume d’ordine (subtotale)', EN: 'Share of order volume (subtotal)' },
  'Koopa-Synergie-Reduktion': { FR: 'Réduction synergie coopération', IT: 'Riduzione sinergia cooperazione', EN: 'Cooperation synergy reduction' },
  'Koopa-Synergie-Reduktion ({0}%)': { FR: 'Réduction synergie coopération ({0}%)', IT: 'Riduzione sinergia cooperazione ({0}%)', EN: 'Cooperation synergy reduction ({0}%)' },
  'Total Grobkostenschätzung': { FR: 'Total estimation des coûts', IT: 'Totale stima dei costi', EN: 'Total cost estimate' },

  // ---- Honorar: SIA-Herleitung ----
  'Zeitaufwand Tm = Baukosten × p/100 × n × q × r': { FR: 'Temps Tm = coûts × p/100 × n × q × r', IT: 'Tempo Tm = costi × p/100 × n × q × r', EN: 'Time Tm = cost × p/100 × n × q × r' },
  'Gesamtbausumme koord. Projekt': { FR: 'Coût total du projet coordonné', IT: 'Costo totale del progetto coordinato', EN: 'Total cost of coordinated project' },
  'Baukosten Tiefbau': { FR: 'Coûts génie civil', IT: 'Costi genio civile', EN: 'Civil works cost' },
  'Baukosten': { FR: 'Coûts de construction', IT: 'Costi di costruzione', EN: 'Construction cost' },
  '– (keine Baukosten)': { FR: '– (aucun coût)', IT: '– (nessun costo)', EN: '– (no cost)' },
  'Automatisiertes Modell nach SIA 103: Das Tiefbau-Honorar wird aus den Baukosten und dem Schwierigkeitsgrad hergeleitet.': {
    FR: 'Modèle automatisé selon SIA 103 : les honoraires génie civil sont dérivés des coûts de construction et du degré de difficulté.',
    IT: 'Modello automatizzato secondo SIA 103: l’onorario genio civile è derivato dai costi di costruzione e dal grado di difficoltà.',
    EN: 'Automated model per SIA 103: the civil works fee is derived from the construction cost and the difficulty level.' },
  'Formel: Honorar = Baukosten × (p / 100) × n × q × r × Stundenansatz, mit p = Z1 + Z2 / ∛Baukosten (Z1 = {0}, Z2 = {1}).': {
    FR: 'Formule : honoraires = coûts × (p / 100) × n × q × r × taux horaire, avec p = Z1 + Z2 / ∛coûts (Z1 = {0}, Z2 = {1}).',
    IT: 'Formula: onorario = costi × (p / 100) × n × q × r × tariffa oraria, con p = Z1 + Z2 / ∛costi (Z1 = {0}, Z2 = {1}).',
    EN: 'Formula: fee = cost × (p / 100) × n × q × r × hourly rate, with p = Z1 + Z2 / ∛cost (Z1 = {0}, Z2 = {1}).' },
  'Grundfaktor p = Z1 + Z2 / ∛({0} {1})': {
    FR: 'Facteur de base p = Z1 + Z2 / ∛({0} {1})',
    IT: 'Fattore di base p = Z1 + Z2 / ∛({0} {1})',
    EN: 'Base factor p = Z1 + Z2 / ∛({0} {1})' },
  'Honorar Tiefbau (Tm × CHF {0}/h)': { FR: 'Honoraires génie civil (Tm × CHF {0}/h)', IT: 'Onorario genio civile (Tm × CHF {0}/h)', EN: 'Civil works fee (Tm × CHF {0}/h)' },
  'Kennwerte gemäss SIA 103: p={0}, n={1}, o={2}, f={3}.': {
    FR: 'Valeurs selon SIA 103 : p={0}, n={1}, o={2}, f={3}.',
    IT: 'Parametri secondo SIA 103: p={0}, n={1}, o={2}, f={3}.',
    EN: 'Parameters per SIA 103: p={0}, n={1}, o={2}, f={3}.' },
  'Richtwert (Ansatz CHF {0}/h)': { FR: 'Valeur indicative (taux CHF {0}/h)', IT: 'Valore indicativo (tariffa CHF {0}/h)', EN: 'Indicative value (rate CHF {0}/h)' },
  'Manuell ({0} h × CHF {1})': { FR: 'Manuel ({0} h × CHF {1})', IT: 'Manuale ({0} h × CHF {1})', EN: 'Manual ({0} h × CHF {1})' },
  'angewendet': { FR: 'appliqué', IT: 'applicato', EN: 'applied' },
  'Die Bauplatz-Installation (Auftragspauschale) wird automatisch anhand der Projektsumme aus Tiefbau- und Montagearbeiten ({0}) ermittelt.': {
    FR: 'L’installation de chantier (forfait de commande) est déterminée automatiquement à partir du montant du projet (travaux génie civil + montage : {0}).',
    IT: 'L’installazione di cantiere (forfait d’ordine) è determinata automaticamente in base all’importo del progetto (lavori genio civile + montaggio: {0}).',
    EN: 'The site installation (lump-sum order fee) is determined automatically from the project amount (civil works + assembly: {0}).' },
  'Das automatisierte Modell liefert Richtwerte nach SIA 103. Für verbindliche Angaben die manuelle Berechnung verwenden.': {
    FR: 'Le modèle automatisé fournit des valeurs indicatives selon SIA 103. Pour des valeurs contraignantes, utiliser le calcul manuel.',
    IT: 'Il modello automatizzato fornisce valori indicativi secondo SIA 103. Per valori vincolanti utilizzare il calcolo manuale.',
    EN: 'The automated model provides indicative values per SIA 103. Use the manual calculation for binding figures.' },

  // ---- Weitere Angaben (Honorar) ----
  'Gesamtbausumme koord. Projekt (alle Dritten)': { FR: 'Coût total du projet coordonné (tous tiers)', IT: 'Costo totale del progetto coordinato (tutti i terzi)', EN: 'Total cost of coordinated project (all parties)' },
  'Dritt-Ingenieur-Leistungen [CHF]': { FR: 'Prestations d’ingénieur tiers [CHF]', IT: 'Prestazioni di ingegnere terzo [CHF]', EN: 'Third-party engineer services [CHF]' },
  'Die Gesamtbausumme fliesst in den SIA-Grundfaktor der Engineering-Berechnung ein (Standard: Tiefbau + Montage).': {
    FR: 'Le coût total entre dans le facteur de base SIA du calcul Engineering (par défaut : génie civil + montage).',
    IT: 'Il costo totale entra nel fattore di base SIA del calcolo Engineering (predefinito: genio civile + montaggio).',
    EN: 'The total cost feeds into the SIA base factor of the Engineering calculation (default: civil works + assembly).' },

  // ---- OAT / Editier-Tabellen ----
  'Leistungsposition': { FR: 'Position de prestation', IT: 'Posizione di prestazione', EN: 'Service item' },
  'Begründung': { FR: 'Motif', IT: 'Motivo', EN: 'Reason' },
  'Impact CHF (vor Rabatt)': { FR: 'Impact CHF (avant rabais)', IT: 'Impatto CHF (prima dello sconto)', EN: 'Impact CHF (before discount)' },
  'Flexibilität +/- % TU': { FR: 'Flexibilité +/- % TU', IT: 'Flessibilità +/- % TU', EN: 'Flexibility +/- % TU' },
  'Name BHV TU': { FR: 'Nom RMO TU', IT: 'Nome RC TU', EN: 'Name CR TU' },
  'Total Impact': { FR: 'Impact total', IT: 'Impatto totale', EN: 'Total impact' },
  'CHF/h': { FR: 'CHF/h', IT: 'CHF/h', EN: 'CHF/h' },
  'Zeile löschen': { FR: 'Supprimer la ligne', IT: 'Elimina riga', EN: 'Delete row' },
  'Alle Eingaben zurücksetzen?': { FR: 'Réinitialiser toutes les saisies ?', IT: 'Reimpostare tutti i dati inseriti?', EN: 'Reset all entries?' },
  'Alle Eingaben und Mengen zurücksetzen?': { FR: 'Réinitialiser toutes les saisies et quantités ?', IT: 'Reimpostare tutti i dati e le quantità?', EN: 'Reset all entries and quantities?' },
  'Total TB Dritte': { FR: 'Total GC tiers', IT: 'Totale GC terzi', EN: 'Total third-party civil works' },
  'Suche nach Position oder Kurztext…': { FR: 'Rechercher position ou texte court…', IT: 'Cerca posizione o testo breve…', EN: 'Search item or short text…' },
  'Alle Leistungsarten': { FR: 'Tous les types de prestation', IT: 'Tutti i tipi di prestazione', EN: 'All service types' },
  'Suche Position oder Text (DE/FR/IT)…': { FR: 'Rechercher position ou texte (DE/FR/IT)…', IT: 'Cerca posizione o testo (DE/FR/IT)…', EN: 'Search item or text (DE/FR/IT)…' },
  'Auftragsvolumen SCS Tiefbau-Kooperationsprojekt': { FR: 'Volume de commande SCS projet coopération génie civil', IT: 'Volume d’ordine SCS progetto cooperazione genio civile', EN: 'SCS order volume civil works cooperation project' },
  'TU-Rabatt': { FR: 'Rabais TU', IT: 'Sconto TU', EN: 'TU discount' },
  'TU-Rabatt Material': { FR: 'Rabais TU matériel', IT: 'Sconto TU materiale', EN: 'TU material discount' },
  'TU-Rabatt Regie (h-Positionen)': { FR: 'Rabais TU régie (positions h)', IT: 'Sconto TU economia (posizioni h)', EN: 'TU time-and-material discount (h-items)' },
  '3rd-Party-Handling-Fee ({0}%)': { FR: '3rd Party Handling Fee ({0}%)', IT: '3rd Party Handling Fee ({0}%)', EN: '3rd-party handling fee ({0}%)' },
  'Richtpreise gemäss Richtpreisliste SCS, in CHF, ohne MwSt. Bauplatz-Installation und Honorare werden automatisch aus den erfassten Mengen berechnet.': {
    FR: 'Prix indicatifs selon la liste SCS, en CHF, hors TVA. L’installation de chantier et les honoraires sont calculés automatiquement à partir des quantités saisies.',
    IT: 'Prezzi indicativi secondo il listino SCS, in CHF, IVA esclusa. L’installazione di cantiere e gli onorari sono calcolati automaticamente dalle quantità inserite.',
    EN: 'Indicative prices per the SCS price list, in CHF, excl. VAT. Site installation and fees are calculated automatically from the entered quantities.' },

  // ==== Datenbereiche: GKS-Kategorieüberschriften (Tiefbau) ====
  'Graben (exkl.Rohre, exkl. Behinderung, Zwischentransport, Fels, etc.)': {
    FR: 'Tranchée (hors tubes, hors entrave, transport intermédiaire, roche, etc.)',
    IT: 'Scavo (esclusi tubi, ostacoli, trasporto intermedio, roccia, ecc.)',
    EN: 'Trench (excl. pipes, obstruction, intermediate transport, rock, etc.)' },
  'Rohre (Durchschnittspreis inkl. Bogen, Schnitte, etc)': {
    FR: 'Tubes (prix moyen, coudes et coupes compris, etc.)',
    IT: 'Tubi (prezzo medio, curve e tagli inclusi, ecc.)',
    EN: 'Pipes (average price incl. bends, cuts, etc.)' },
  'Schächte (ohne Behinderung best. Swisscom-Anlage, Fels etc.)': {
    FR: 'Regards (sans entrave de l’installation Swisscom existante, roche, etc.)',
    IT: 'Pozzetti (senza ostacoli dell’impianto Swisscom esistente, roccia, ecc.)',
    EN: 'Manholes (excl. obstruction of existing Swisscom infrastructure, rock, etc.)' },
  'Werklöcher': { FR: 'Niches de tirage', IT: 'Nicchie di tiro', EN: 'Draw pits' },
  'Gebäudeeinführung': { FR: 'Entrée de bâtiment', IT: 'Ingresso nell’edificio', EN: 'Building entry' },
  'Allgemeine Arbeiten': { FR: 'Travaux généraux', IT: 'Lavori generali', EN: 'General works' },

  // ==== GKS-Kategorieüberschriften (Montage) ====
  'Kabelarbeiten (Material)': { FR: 'Travaux de câblage (matériel)', IT: 'Lavori di cablaggio (materiale)', EN: 'Cable works (material)' },
  'Kabelarbeiten/Abbruch (Arbeit)': { FR: 'Travaux de câblage/démontage (main-d’œuvre)', IT: 'Lavori di cablaggio/smontaggio (manodopera)', EN: 'Cable works/removal (labour)' },

  // ==== Unterüberschriften ====
  'Kulturland': { FR: 'Terrain agricole', IT: 'Terreno agricolo', EN: 'Farmland' },
  'Kulturland (Alternativen)': { FR: 'Terrain agricole (alternatives)', IT: 'Terreno agricolo (alternative)', EN: 'Farmland (alternatives)' },
  'Gehweg': { FR: 'Trottoir', IT: 'Marciapiede', EN: 'Sidewalk' },
  'Strasse': { FR: 'Route', IT: 'Strada', EN: 'Road' },
  'Kantonsstrasse': { FR: 'Route cantonale', IT: 'Strada cantonale', EN: 'Cantonal road' },
  'Zuschläge': { FR: 'Suppléments', IT: 'Supplementi', EN: 'Surcharges' },
  'Schachtdeckel anpassen (Niveau)/ersetzen': {
    FR: 'Adapter (niveau)/remplacer le couvercle de regard',
    IT: 'Adattare (livello)/sostituire il coperchio del pozzetto',
    EN: 'Adjust (level)/replace manhole cover' },
  'Neue Kabel': { FR: 'Nouveaux câbles', IT: 'Nuovi cavi', EN: 'New cables' },
  'Muffen': { FR: 'Manchons', IT: 'Giunti', EN: 'Splice closures' },
  'Längsverschlussrohr': { FR: 'Tube de fermeture longitudinale', IT: 'Tubo di chiusura longitudinale', EN: 'Longitudinal sealing duct' },
  'Unvorhergesehenes': { FR: 'Imprévus', IT: 'Imprevisti', EN: 'Contingencies' },
  'Kabeleinzug': { FR: 'Tirage de câble', IT: 'Tiratura del cavo', EN: 'Cable pulling' },
  'Kabelauszug': { FR: 'Retrait de câble', IT: 'Estrazione del cavo', EN: 'Cable withdrawal' },
  'Bestehende Kabel umlegen in Längsverschlussrohr (pro Kabel)': {
    FR: 'Déplacer les câbles existants dans le tube de fermeture longitudinale (par câble)',
    IT: 'Spostare i cavi esistenti nel tubo di chiusura longitudinale (per cavo)',
    EN: 'Relocate existing cables into longitudinal sealing duct (per cable)' },
  'Spleissarbeiten': { FR: 'Travaux d’épissure', IT: 'Lavori di giunzione', EN: 'Splicing works' },
  'Schachtvorbereitung (Ausrüsten f. Spleissarbeiten)': {
    FR: 'Préparation du regard (équipement pour travaux d’épissure)',
    IT: 'Preparazione del pozzetto (attrezzatura per lavori di giunzione)',
    EN: 'Manhole preparation (fitting for splicing works)' },
  'Hausinstallation': { FR: 'Installation domestique', IT: 'Installazione domestica', EN: 'In-house installation' },
  'Freileitung': { FR: 'Ligne aérienne', IT: 'Linea aerea', EN: 'Overhead line' },
  'Abbruch': { FR: 'Démontage', IT: 'Smontaggio', EN: 'Removal' },

  // ==== Bauplatz-Pauschalstufen (FR/IT aus Excel-Blatt 10) ====
  "Auftragspauschale Klein Pro Projektsumme < CHF 1'500.-": {
    FR: 'Forfait ordre petit · pour montant du projet < CHF 1’500.-',
    IT: 'Forfait ordine piccolo · per importo del progetto < CHF 1’500.-',
    EN: 'Lump-sum order fee small · for project amount < CHF 1’500.-' },
  "Auftragspauschale mittel Pro Projektsumme >= CHF 1'500.-  und < CHF 10'000.-": {
    FR: 'Forfait ordre moyen · pour montant du projet ≥ CHF 1’500.- et < CHF 10’000.-',
    IT: 'Forfait ordine medio · per importo del progetto ≥ CHF 1’500.- e < CHF 10’000.-',
    EN: 'Lump-sum order fee medium · for project amount ≥ CHF 1’500.- and < CHF 10’000.-' },
  "Auftragspauschale gross Pro Projektsumme >=CHF 10'000.- und < 50'000.-": {
    FR: 'Forfait ordre grand · pour montant du projet ≥ CHF 10’000.- et < 50’000.-',
    IT: 'Forfait ordine grande · per importo del progetto ≥ CHF 10’000.- e < 50’000.-',
    EN: 'Lump-sum order fee large · for project amount ≥ CHF 10’000.- and < 50’000.-' },
  "Auftragspauschale sehr gross Pro Projektsumme >= CHF 50'000.-": {
    FR: 'Forfait ordre très grand · pour montant du projet ≥ CHF 50’000.-',
    IT: 'Forfait ordine molto grande · per importo del progetto ≥ CHF 50’000.-',
    EN: 'Lump-sum order fee very large · for project amount ≥ CHF 50’000.-' },
};

/* Übersetzt einen deutschen Text; für DE oder fehlende Einträge wird das Original zurückgegeben. */
function tr(de, lang) {
  if (!lang || lang === 'DE') return de;
  const e = I18N[de];
  return (e && e[lang]) ? e[lang] : de;
}
