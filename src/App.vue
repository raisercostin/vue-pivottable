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
      :defaultFields="defaultFieldList"
      :defaultRows="defaultRowList"
      :defaultColumns="defaultColumnList"
      :fields="fieldList"
    ></VuePivottableUi>
  </div>
</template>
<script>
import tips from "./tips";
import "./assets/vue-pivottable.css";
import VuePivottableUi from "./PivottableUi";

export default {
  components: {
    VuePivottableUi,
  },
  data() {
    return {
      pivotData: tips,
      aggregatorName: "Count",
      rendererName: "Table",
      rows: [],
      cols: [],
      vals: [],
      defaultFieldList: ["Meal", "Tip"],
      defaultRowList: ["Total Bill"],
      defaultColumnList: ["Party Size"],
      fieldList: [
        "Total Bill",
        "Tip",
        "Payer Gender",
        "Payer Smoker",
        "Day of Week",
        "Meal",
        "Party Size",
      ],
      rendererList: ["Table"], // Here to specify show renderer list
      aggregatorList: [], // Here to specify show aggregator list
    };
  },
};
</script>
