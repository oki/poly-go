<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['change'])
const el = ref(null)
let map
const vertices = [] // L.Marker[]
let midpoints = [] // L.Marker[] – one per edge, dragging/tapping one inserts a vertex
// interactive: false – clicks inside go straight to the map and the cursor stays consistent
const polygon = L.polygon([], { color: '#3b82f6', weight: 2, fillOpacity: 0.15, interactive: false })
const coarse = matchMedia('(pointer: coarse)').matches
const size = coarse ? 28 : 16
const icon = L.divIcon({ className: 'vertex', iconSize: [size, size] })
const midIcon = L.divIcon({ className: 'vertex vertex-mid', iconSize: [size, size] })

onMounted(() => {
  map = L.map(el.value, { zoomControl: false }).setView([50.06, 19.94], 12)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  L.control.zoom({ position: 'topright' }).addTo(map)
  polygon.addTo(map)
  map.on('click', (e) => addVertex(e.latlng))
})

function sync() {
  const latlngs = vertices.map((m) => m.getLatLng())
  polygon.setLatLngs(latlngs)
  emit('change', latlngs.map((p) => [p.lat, p.lng]))
}

function rebuildMidpoints() {
  midpoints.forEach((m) => m.remove())
  midpoints = []
  const n = vertices.length
  const edges = n < 2 ? 0 : n === 2 ? 1 : n
  for (let i = 0; i < edges; i++) {
    const a = vertices[i].getLatLng()
    const b = vertices[(i + 1) % n].getLatLng()
    const m = L.marker([(a.lat + b.lat) / 2, (a.lng + b.lng) / 2], { draggable: true, icon: midIcon, keyboard: false })
    let inserted = false
    const insert = () => {
      if (inserted) return
      inserted = true
      midpoints = midpoints.filter((x) => x !== m)
      vertices.splice(i + 1, 0, makeVertex(m))
      sync()
      rebuildMidpoints()
    }
    m.on('dragstart', insert).on('click', insert).addTo(map)
    midpoints.push(m)
  }
}

function makeVertex(m) {
  // class toggle, not setIcon(): setIcon() re-creates the drag handler and aborts a drag in progress
  m.getElement().classList.remove('vertex-mid')
  return m.on('drag', sync).on('dragend', rebuildMidpoints)
}

// index of the edge (i → i+1) closest to the given point, in screen pixels
function nearestEdge(latlng) {
  const p = map.latLngToLayerPoint(latlng)
  const n = vertices.length
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < n; i++) {
    const a = map.latLngToLayerPoint(vertices[i].getLatLng())
    const b = map.latLngToLayerPoint(vertices[(i + 1) % n].getLatLng())
    const d = L.LineUtil.pointToSegmentDistance(p, a, b)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  }
  return best
}

// once a polygon exists, a new point goes into the closest edge instead of the end of the ring
function addVertex(latlng, at = vertices.length < 3 ? vertices.length : nearestEdge(latlng) + 1) {
  vertices.splice(at, 0, makeVertex(L.marker(latlng, { draggable: true, icon, keyboard: false }).addTo(map)))
  sync()
  rebuildMidpoints()
}

function undo() {
  vertices.pop()?.remove()
  sync()
  rebuildMidpoints()
}

function clear() {
  vertices.forEach((m) => m.remove())
  vertices.length = 0
  sync()
  rebuildMidpoints()
}

function locate() {
  map.locate({ setView: true, maxZoom: 16 })
}

function fitBounds(bounds) {
  map.fitBounds(bounds)
}

function setPoints(list) {
  clear()
  list.forEach((p) => addVertex(L.latLng(p), vertices.length))
  if (list.length) map.fitBounds(polygon.getBounds(), { maxZoom: 16 })
}

defineExpose({ locate, undo, clear, fitBounds, setPoints })
</script>

<template>
  <div ref="el" class="h-full w-full"></div>
</template>

<style>
.vertex {
  cursor: grab;
}
/* visual in a pseudo-element so midpoints look smaller but keep the full hit area */
.vertex::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #3b82f6;
}
.vertex-mid::before {
  inset: 15%;
  border-width: 2px;
  opacity: 0.6;
}
</style>
