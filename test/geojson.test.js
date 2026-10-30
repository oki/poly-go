import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toFeatureCollection, areaKm2 } from '../src/geojson.js'

test('builds a closed [lon, lat] polygon with empty properties', () => {
  const fc = toFeatureCollection([
    [50.0661881, 20.0291491],
    [50.065101, 20.031509],
    [50.063971, 20.035844],
  ])
  const f = fc.features[0]
  assert.equal(fc.type, 'FeatureCollection')
  assert.equal(f.type, 'Feature')
  assert.deepEqual(f.properties, {})
  assert.equal(f.geometry.type, 'Polygon')
  const ring = f.geometry.coordinates[0]
  assert.equal(ring.length, 4)
  assert.deepEqual(ring[0], [20.029149, 50.066188])
  assert.deepEqual(ring[0], ring[3])
})

test('rejects fewer than 3 points', () => {
  assert.throws(() => toFeatureCollection([[50, 20], [51, 21]]))
})

test('computes area of a ~10.7 x 10.0 km rectangle near Kraków', () => {
  const a = areaKm2([
    [49.994498, 19.89418],
    [50.084023, 19.89418],
    [50.084023, 20.043182],
    [49.994498, 20.043182],
  ])
  assert.ok(a > 105 && a < 108, `got ${a}`)
  assert.equal(areaKm2([[50, 20], [51, 21]]), 0)
})
