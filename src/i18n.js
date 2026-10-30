const dict = {
  pl: {
    title: 'Strefa dla mapy',
    search: 'Szukaj adresu lub miejscowości',
    empty: 'Nic nie znaleziono.',
    error: 'Błąd wyszukiwania. Spróbuj ponownie.',
    locate: 'Moja lokalizacja',
    hintEmpty: 'Tapnij w mapę, aby dodać punkty strefy.',
    hintFew: (n) => `Punkty: ${n}. Potrzeba co najmniej 3.`,
    hintReady: (n, km2) => `Punkty: ${n}, powierzchnia ${km2} km². Przeciągnij punkt, aby poprawić.`,
    undo: 'Cofnij',
    clear: 'Wyczyść',
    download: 'Pobierz .geojson',
    file: 'strefa.geojson',
  },
  en: {
    title: 'Map zone',
    search: 'Search for an address or place',
    empty: 'Nothing found.',
    error: 'Search failed. Try again.',
    locate: 'My location',
    hintEmpty: 'Tap the map to add zone points.',
    hintFew: (n) => `Points: ${n}. At least 3 are needed.`,
    hintReady: (n, km2) => `Points: ${n}, area ${km2} km². Drag a point to adjust.`,
    undo: 'Undo',
    clear: 'Clear',
    download: 'Download .geojson',
    file: 'zone.geojson',
  },
}

export const lang = navigator.language.startsWith('pl') ? 'pl' : 'en'
export const t = dict[lang]
