<template>
  <div class="participantes">
    <div>
      <PieChart
        :graphData="participantes"
        :graphId="'piechart__participantes__genero'"
        :group="'Participantes'"
        :count="count()"
        :valueLabel="'individuos'"
        quantityValueSize="2"
      />
    </div>
    <div class="participantes__otros">
      <QuantityText
        v-for="group in Object.keys(groups)"
        :key="group"
        :name="group"
        :value="countOtros(group)"
      />
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart.vue";
import QuantityText from "./QuantityText.vue";

export default {
  name: "Participantes",
  components: {
    PieChart,
    QuantityText
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
.participantes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;
  margin-top: 4rem;

  &__otros {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 40%;
  }
}
</style>
