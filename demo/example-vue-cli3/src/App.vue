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
      row-order="value_a_to_z"
      :rowTotal="false"
      :colTotal="false"
    />
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
      vals: ['Total Bill']
    }
  }
}
</script>

<style>
.pvtTable {
  width: 100%;
}
</style>
