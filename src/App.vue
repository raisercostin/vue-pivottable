<template>
  <div id="app">
    <VuePivottableUi
      :data="pivotData"
      :aggregator-name="aggregatorName"
      :renderer-name="rendererName"
      :rows="rows"
      :cols="cols"
      :row-total="true"
      :col-total="true"
      :showRenderers="rendererList"
      :showAggregators="aggregatorList"
      :fields="fieldList"
    ></VuePivottableUi>
  </div>
</template>
<script>
import tips from './tips'
import './assets/vue-pivottable.css'
import VuePivottableUi from './PivottableUi'

export default {
  components: {
    VuePivottableUi
  },
  data () {
    return {
      pivotData: tips,
      aggregatorName: 'Count',
      rendererName: 'Table',
      rows: [],
      cols: [],
      vals: [],
      fieldList: ['Meal', 'Tip', 'Payer Smoker', 'Day of Week', 'Payer Gender', 'Party Size','Total Bill'],
      rendererList: ['Table'], // Here to specify show renderer list
      aggregatorList: [], // Here to specify show aggregator list
    }
  }
}
</script>
