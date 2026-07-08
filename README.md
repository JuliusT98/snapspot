# SnapSpot – Foto-Tagebuch (PWA)

Eine Progressive Web App, die Fotos mit der Kamera aufnimmt, den Standort
automatisch dazu speichert und alles offline in IndexedDB ablegt.
Gebaut mit **React**, **Vite** und **Tailwind CSS**, mit vier Screens und
Bottom-Tab-Navigation wie in einer nativen App.

## Screens

| Screen | Route | Inhalt |
|---|---|---|
| Kamera | `/` | Sucher mit Auslöser, Standort wird beim Foto automatisch erfasst |
| Galerie | `/gallery` | Foto-Grid, Tippen öffnet die Detailansicht |
| Detail | `/gallery/:id` | Großansicht mit Datum, Koordinaten, Karten-Link, Löschen |
| Karte | `/map` | Alle Fotos mit Standort als Marker (Leaflet + OpenStreetMap/CARTO) |
| Einstellungen | `/settings` | Install-Button, Online-Status, Speicherverbrauch, alles löschen |

## Portfolio-Kriterien

| # | Kriterium | Umsetzung |
|---|-----------|-----------|
| 1 | UI mit ansprechendem Layout & Styling | Tailwind CSS, Dark Theme, Bottom-Tab-Bar, responsive (`src/index.css`, Komponenten) |
| 2 | Offline-Funktionalität mit Service-Worker | `vite-plugin-pwa` (Workbox): App-Shell-Precaching + Runtime-Cache für Kartentiles (`vite.config.js`) |
| 3 | Installierbarkeit über A2H | Manifest via PWA-Plugin + eigener Install-Button (`src/hooks/useInstallPrompt.js`) |
| 4 | Nutzung von WebAPIs | **Kamera** (`src/hooks/useCamera.js`) und **Geolocation** (`src/hooks/useGeolocation.js`) |

Zusätzlich: **IndexedDB** zur Offline-Speicherung der Fotos (`src/lib/db.js`),
Online/Offline-Statusanzeige, `navigator.storage.estimate()` für Speicher-Info.

## Tech-Stack

- **Vite** – Build-Tool und Dev-Server
- **React 19** + **react-router-dom** – Komponenten und Routing
- **Tailwind CSS 4** – Styling
- **vite-plugin-pwa** – Service Worker (Workbox) und Web App Manifest
- **Leaflet / react-leaflet** – Karten-Screen
- **lucide-react** – Icons

## Starten

```
npm install
npm run dev
```

Dann http://localhost:5173 im Browser (Chrome/Edge) öffnen.

Für den vollständigen PWA-Test (Service Worker, Installieren, Offline):

```
npm run build
npm run preview
```

## Testen

- **Offline:** Production-Build starten, Seite einmal laden, dann DevTools → Network → „Offline" → Reload → App und gespeicherte Fotos funktionieren weiter.
- **Installieren:** Button unter „Einstellungen" oder Install-Symbol in der Adressleiste.
- **Kamera/Standort:** Kamera-Screen öffnen, Browser-Berechtigungen erlauben, Auslöser drücken.
- **Lighthouse:** DevTools → Lighthouse → Kategorie „Progressive Web App" prüfen.

## Projektstruktur

```
PWA/
├── index.html               Vite-Entry
├── vite.config.js           Vite + Tailwind + PWA-Plugin (Manifest, Workbox)
├── public/icons/            App-Icons (192, 512, maskable)
└── src/
    ├── main.jsx             Einstiegspunkt (Router)
    ├── App.jsx              Layout: Header, Routen, Tab-Bar
    ├── index.css            Tailwind + Theme
    ├── lib/db.js            IndexedDB-Zugriff
    ├── hooks/               Kamera, Geolocation, Online-Status, Install-Prompt, Snaps
    ├── components/          TabBar, Toast, SnapCard
    └── screens/             Kamera, Galerie, Detail, Karte, Einstellungen
```
