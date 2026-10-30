// Shape required by the Kōji import: empty properties, Polygon.
export function toFeatureCollection(points) {
  if (points.length < 3) throw new Error('polygon needs at least 3 points')
  const ring = points.map(([lat, lng]) => [round(lng), round(lat)])
  ring.push(ring[0])
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [ring] },
      },
    ],
  }
}

const round = (n) => Math.round(n * 1e6) / 1e6

export function download(points, name = 'strefa.geojson') {
  const blob = new Blob([JSON.stringify(toFeatureCollection(points), null, 2)], { type: 'application/geo+json' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name })
  a.click()
  URL.revokeObjectURL(a.href)
}

// Geodesic area on a sphere (same formula as leaflet-draw / turf), points as [[lat, lng], ...]
export function areaKm2(points) {
  const n = points.length
  if (n < 3) return 0
  const R = 6378137
  const rad = Math.PI / 180
  let sum = 0
  for (let i = 0; i < n; i++) {
    const [lat1, lng1] = points[i]
    const [lat2, lng2] = points[(i + 1) % n]
    sum += (lng2 - lng1) * rad * (2 + Math.sin(lat1 * rad) + Math.sin(lat2 * rad))
  }
  return Math.abs((sum * R * R) / 2) / 1e6
}
