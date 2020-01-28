<template>
  <div v-if="cobertura.children.length">
    <Treemap
      :graphData="cobertura"
      :graphId="'treemap__coberturas'"
      :component="'coberturas'"
    />
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
