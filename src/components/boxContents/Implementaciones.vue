<template>
  <div>
    <BarChart :graphData="implementaciones" />
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
}
</script>
