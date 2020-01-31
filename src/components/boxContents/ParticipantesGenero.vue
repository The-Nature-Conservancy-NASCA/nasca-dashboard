<template>
  <div>
    <PieChart
      :graphData="participantes"
      :graphId="'piechart__participantes__genero'"
      :group="'Participantes'"
      :count="count()"
    />
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
    participantes() {
      return this.$store.getters.participantes;
    }
  },
  methods: {
    count() {
      return this.participantes.reduce((a, b) => a.value + b.value);
    }
  }
};
</script>
