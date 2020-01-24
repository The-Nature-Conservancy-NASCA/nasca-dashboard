<template>
  <div>
    <BarChart
      :graphData="implementaciones"
      :graphId="'barchart__implementaciones'"
    />
    <div>
      <DownloadDataBtn :exportData="prepareData(implementaciones)" />
      <DownloadImageBtn :graphId="'barchart__implementaciones'" />
    </div>
  </div>
</template>
<script>
import BarChart from "./BarChart.vue";
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";

export default {
  name: "Implementaciones",
  components: {
    BarChart,
    DownloadDataBtn,
    DownloadImageBtn
  },
  computed: {
    implementaciones() {
      return this.$store.getters.implementaciones;
    }
  },
  methods: {
    prepareData(graphData) {
      const data = graphData.map(item => {
        return { accion: item.name, area: item.value }
      });
      const header = Object.keys(data[0]);
      return { data: data, header: header };
    }
  }
};
</script>
