<template>
  <div class="w-100">
    <div class="implementaciones" v-if="implementaciones.length">
      <BarChart
        :graphData="implementaciones"
        :graphId="'barchart__implementaciones'"
      />
    </div>
    <div v-else class="no__data__warning">
      <p>Todavía no hay datos :(</p>
    </div>
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
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}

.no__data__warning > p {
  text-align: center;
  font-size: 14px;
}
.implementaciones {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  width: 100%;
}
</style>
