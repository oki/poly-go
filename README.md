# PolyGO

Draw a zone on the map and download it as GeoJSON for import into [Kōji](https://github.com/TurtIeSocks/Koji).
Client-side only (Vue 3 + Vite + Tailwind/daisyUI + Leaflet), installable as a PWA, UI in Polish or English based on browser language.

## Run

```sh
npm install
npm run dev     # http://localhost:5173
npm test        # export format tests
npm run build   # static output in dist/
```

## Import into Kōji

Kōji → Import Wizard → JSON → upload the downloaded `.geojson`, then set the name and mode (`auto_quest`) in the wizard.
