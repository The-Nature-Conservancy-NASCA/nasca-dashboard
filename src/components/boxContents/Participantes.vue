<template>
  <div class="container">
    <div>
      <PieChart
        :graphData="participantes"
        :graphId="'piechart__participantes__genero'"
        :group="'Participantes'"
        :count="count()"
      />
    </div>
    <div v-for="group in Object.keys(groups)" :key="group">
      <h5>{{ group }}</h5>
      <h4>{{ countOtros(group) }}</h4>
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart.vue";

export default {
  name: "Participantes",
  components: {
    PieChart
  },
  computed: {
    groups() {
      return this.$store.getters.gruposParticipantes;
    },
    participantes() {
      return this.$store.getters.participantes;
    }
  },
  methods: {
    count() {
      return this.participantes.reduce((a, b) => a.value + b.value);
    },
    countOtros(group) {
      return this.groups[group];
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
}
</style>