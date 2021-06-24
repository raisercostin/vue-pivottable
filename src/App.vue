<template>
  <div id="app" style="padding: 2%">
    <VuePivottableUi
      :data="pivotData"
      :editingUrl="editingUrl"
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
      :showTemplates="templates"
      :roleCreate="roleCreate"
      :roleEditDelete="roleEditDelete"
      @updateFilter="updateFilter"
      @updateTables="updateTables"
      @updateRows="updateRows"
      @updateColumns="updateColumns"
      @updateAggregatorName="updateAggregatorName"
      @updateVals="updateVals"
      @hasChanges="hasChanges"
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
    hasChanges(val) {
      if (val) {
        console.log(val);
        console.log("there is changes");
      } else {
        console.log("no change");
      }
    },
  },
  data() {
    return {
      pivotData: tips,
      rendererName: "Table",
      defaultAggregatorName: "Count",
      defaultVals: [],
      defaultTables: [],
      defaultRows: [],
      defaultColumns: [],
      defaultValueFilter: {
        "Name": {},
        "Total Bill": {},
        Tip: {},
        "Payer Gender": {},
        "Payer Smoker": {},
        "Day of Week": {},
        Meal: {},
        "Party Size": {},
      },
      fieldList: [
        "Name",
        "Total Bill",
        "Tip",
        "Payer Gender",
        "Payer Smoker",
        "Day of Week",
        "Meal",
        "Party Size",
      ],
      editingUrl: 'https://www.google.com',
      roleCreate: true,
      roleEditDelete: true,
      rendererList: ["Table"], // Here to specify show renderer list
      aggregatorList: [], // Here to specify show aggregator list
      selectedAggregatorName: "",
      selectedVals: [],
      selectedTables: [],
      selectedRows: [],
      selectedColumns: [],
      selectedFilter: {},
      templates: [
        {
          aggreatorName: "Count",
          columns: '["Payer Gender","Tip"]',
          filters: '{ "Meal": {"Dinner" : true} }',
          id: "b6a2ec8c-cfbe-4db2-1425-08d84d954082",
          isPublic: false,
          rows: '["Payer Smoker", "Meal", "Day of Week"]',
          tables: "[]",
          templateName: "Temp 4 lalalallalalalalalalalala",
          values: "[]",
        },
        {
          aggreatorName: "Count",
          columns: "[]",
          filters: "{}",
          id: "b6a2ec8c-cfbe-4db2-1425-08d84d954082",
          isPublic: false,
          rows: "[]",
          tables: "[]",
          templateName: "Temp 5",
          values: "[]",
        },
        {
          aggreatorName: "Count",
          columns: "[]",
          filters: "{}",
          id: "b6a2ec8c-cfbe-4db2-1425-08d84d954082",
          isPublic: false,
          rows: "[]",
          tables: "[]",
          templateName: "Temp 6",
          values: "[]",
        },
      ],
    };
  },
};
</script>
