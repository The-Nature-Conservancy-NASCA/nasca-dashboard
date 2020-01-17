<template>
  <div>
    <div>
      <PieChart :graphData="biodiversidadAves"/>
    </div>
    <div>
      <PieChart :graphData="biodiversidadEscarabajos"/>
    </div>
    <div>
      <PieChart :graphData="biodiversidadMamiferos"/>
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart.vue";

export default {
  name: "Carbono",
  components: {
    PieChart
  },
  computed: {
    biodiversidadAves() {
      return this.$store.getters.biodiversidadAves;
    },
    biodiversidadEscarabajos() {
      return this.$store.getters.biodiversidadEscarabajos;
    },
    biodiversidadMamiferos() {
      return this.$store.getters.biodiversidadMamiferos;
    }
  }
};
</script>
