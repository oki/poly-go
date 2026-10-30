<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import MapView from './MapView.vue'
import Search from './Search.vue'
import { download, areaKm2 } from './geojson.js'
import { t, lang } from './i18n.js'

document.documentElement.lang = lang
document.title = t.title

const map = ref(null)
const points = ref([]) // [[lat, lng], ...]
const area = computed(() => areaKm2(points.value).toLocaleString(lang, { maximumSignificantDigits: 3 }))

// keep the drawing across reloads
const KEY = 'zone'
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (saved.length) map.value.setPoints(saved)
  } catch {}
})
watch(points, (p) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {}
})
</script>

<template>
  <main class="relative h-full">
    <MapView ref="map" @change="points = $event" />
    <div class="absolute left-4 right-16 top-4 z-[1000] sm:max-w-sm pt-[env(safe-area-inset-top)]">
      <Search @select="map.fitBounds($event)" />
    </div>
    <div class="absolute inset-x-4 bottom-4 z-[1000] sm:max-w-sm flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
      <button class="btn btn-circle bg-base-100 shadow-md" :aria-label="t.locate" @click="map.locate()">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="8"/></svg>
      </button>
      <div class="card bg-base-100 shadow-md">
        <div class="card-body gap-4 p-4">
          <p class="text-sm" aria-live="polite">
            {{ points.length === 0 ? t.hintEmpty : points.length < 3 ? t.hintFew(points.length) : t.hintReady(points.length, area) }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-ghost" :disabled="!points.length" @click="map.undo()">{{ t.undo }}</button>
            <button class="btn btn-ghost" :disabled="!points.length" @click="map.clear()">{{ t.clear }}</button>
            <button class="btn btn-primary ml-auto" :disabled="points.length < 3" @click="download(points, t.file)">{{ t.download }}</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
