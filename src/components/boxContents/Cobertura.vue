<template>
  <div>
    <Treemap :graphData="cobertura" :graphId="'treemap__carbono'" />
  </div>
</template>
<script>
import Treemap from "./Treemap.vue";

export default {
  name: "Cobertura",
  components: {
    Treemap
  },
  computed: {
    cobertura() {
      return this.$store.getters.coberturas;
    }
  }
};
</script>
