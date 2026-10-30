<script setup>
import { ref } from 'vue'
import { t } from './i18n.js'

const emit = defineEmits(['select'])
const query = ref('')
const results = ref([])
const status = ref('') // '', 'loading', 'empty', 'error'

async function search() {
  const q = query.value.trim()
  if (!q) return
  status.value = 'loading'
  results.value = []
  try {
    // Nominatim usage policy: no autocomplete, so we only query on submit.
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`
    const res = await fetch(url, { headers: { 'Accept-Language': navigator.language } })
    if (!res.ok) throw new Error(res.status)
    results.value = await res.json()
    status.value = results.value.length ? '' : 'empty'
  } catch {
    status.value = 'error'
  }
}

function pick(r) {
  const [s, n, w, e] = r.boundingbox.map(Number)
  emit('select', [[s, w], [n, e]])
  results.value = []
  query.value = r.display_name
}
</script>

<template>
  <form class="flex flex-col gap-2" role="search" @submit.prevent="search">
    <input
      v-model="query"
      type="search"
      class="input w-full shadow-md"
      :placeholder="t.search"
      :aria-label="t.search"
      enterkeyhint="search"
    />
    <ul v-if="results.length" class="menu bg-base-100 rounded-box shadow-md w-full">
      <li v-for="r in results" :key="r.place_id">
        <button type="button" class="text-left" @click="pick(r)">{{ r.display_name }}</button>
      </li>
    </ul>
    <p v-else-if="status && status !== 'loading'" class="text-sm bg-base-100 rounded-box shadow-md px-4 py-3" role="status">
      {{ status === 'empty' ? t.empty : t.error }}
    </p>
  </form>
</template>
