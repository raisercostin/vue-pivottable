<template>
  <div id="app">
    <div class="title">
      <h1>Vue Pivottable</h1>
      <small>Sample Dataset: Tips</small>
    </div>
    <vue-pivottable
      :data="pivotData"
      :aggregatorName="aggregatorName"
      :rows="rows"
      :cols="cols"
      :vals="vals"
      :rowOrder="rowOrder"
      :rowTotal="false"
      :colTotal="false"
    >
      <template v-slot:colHeaderSlot="{ path, value }">
        {{ value }}
        <div
          class="sort"
          v-if="['Friday', 'Saturday', 'Sunday', 'Thursday'].includes(value)"
        >
          <button @click="sort(path, 'asc')">&uarr;</button>
          <button @click="sort(path, 'desc')">&darr;</button>
        </div>
      </template>
    </vue-pivottable>
  </div>
</template>

<script>
import tips from './tips'
import { VuePivottable } from 'vue-pivottable'
import 'vue-pivottable/dist/vue-pivottable.css'
export default {
  components: {
    VuePivottable
  },
  name: 'app',
  data () {
    return {
      pivotData: tips,
      aggregatorName: 'Sum',
      rows: ['Payer Gender', 'Party Size'],
      cols: ['Meal', 'Payer Smoker', 'Day of Week'],
      vals: ['Total Bill'],
      rowOrder: 'key_a_to_z'
    }
  },
  methods: {
    sort (path, order) {
      this.rowOrder = { path, order }
    }
  }
}
</script>

<style>
.pvtTable {
  width: 100%;
}
.sort button {
  margin: 6px;
}
</style>
