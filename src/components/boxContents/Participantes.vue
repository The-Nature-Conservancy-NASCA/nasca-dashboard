<template>
  <div class="container">
    <div>
      <PieChart
        :graphData="participantes"
        :graphId="'piechart__participantes__genero'"
        :group="'Participantes'"
        :count="count()"
        :valueLabel="'individuos'"
      />
    </div>
    <div
      class="other-participantes"
      v-for="group in Object.keys(groups)"
      :key="group"
    >
      <h4>{{ group }}</h4>
      <h5>{{ countOtros(group) }}</h5>
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
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;
}

.other-participantes {
  text-align: center;

  h4 {
    color: #666;
    font-size: 1.8rem;
    text-transform: uppercase;
  }

  h5 {
    font-size: 1.6rem;
  }
}
</style>
