<template>
  <div v-if="implementaciones.length">
    <BarChart
      :graphData="implementaciones"
      :graphId="'barchart__implementaciones'"
    />
  </div>
</template>
<script>
import BarChart from "./BarChart.vue";
export default {
  name: "Implementaciones",
  components: {
    BarChart
  },
  computed: {
    implementaciones() {
      return this.$store.getters.implementaciones;
    }
  }
};
</script>
