<template>
  <div>
    <BarChart
      :graphData="implementaciones"
      :graphId="'barchart__implementaciones'"
    />
    <DownloadImageBtn :graphId="'barchart__implementaciones'" />
  </div>
</template>
<script>
import BarChart from "./BarChart.vue";
import DownloadImageBtn from "./DownloadImageBtn";

export default {
  name: "Implementaciones",
  components: {
    BarChart,
    DownloadImageBtn
  },
  computed: {
    implementaciones() {
      return this.$store.getters.implementaciones;
    }
  }
};
</script>
