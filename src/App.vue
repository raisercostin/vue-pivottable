<template>
  <div id="app">
    <VuePivottableUi
      :data="pivotData"
      :renderer-name="rendererName"
      :showRenderers="rendererList"
      :showAggregators="aggregatorList"
      :defaultAggregatorName="defaultAggregatorName"
      :defaultVals="defaultVals"
      :defaultTables="defaultTables"
      :defaultRows="defaultRows"
      :defaultColumns="defaultColumns"
      :defaultValueFilter="defaultValueFilter"
      :fields="fieldList"
      @updateFilter="updateFilter"
      @updateTables="updateTables"
      @updateRows="updateRows"
      @updateColumns="updateColumns"
      @updateAggregatorName="updateAggregatorName"
      @updateVals="updateVals"
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
  methods: {
    updateAggregatorName(val) {
      this.selectedAggregatorName = val;
    },
    updateVals(val) {
      this.selectedVals = JSON.stringify(val);
    },
    updateTables(val) {
      this.selectedTables = JSON.stringify(val);
    },
    updateRows(val) {
      this.selectedRows = JSON.stringify(val);
    },
    updateColumns(val) {
      this.selectedColumns = JSON.stringify(val);
    },
    updateFilter(val) {
      this.selectedFilter = JSON.stringify(val);
    },
  },
  data() {
    return {
      pivotData: tips,
      rendererName: "Table",
      defaultAggregatorName: "Count Unique Values",
      defaultVals: ["Tip"],
      defaultTables: ["Tip"],
      defaultRows: ["Meal"],
      defaultColumns: ["Party Size"],
      defaultValueFilter: {
        "Total Bill": {},
        Tip: {},
        "Payer Gender": {},
        "Payer Smoker": {},
        "Day of Week": {},
        Meal: { Dinner: true },
        "Party Size": {},
      },
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
      selectedAggregatorName: "",
      selectedVals: [],
      selectedTables: [],
      selectedRows: [],
      selectedColumns: [],
      selectedFilter: {},
    };
  },
};
</script>
