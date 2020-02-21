<template>
  <div class="participantes">
    <div>
      <PieChart
        :graphData="participantes"
        :graphId="'piechart__participantes__genero'"
        :group="'Participantes'"
        :count="count()"
        :valueLabel="'individuos'"
        :colors="colors"
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
  data() {
    return {
      colors: {
        Hombres: "#1e88e5",
        Mujeres: "#d81b60"
      }
    };
  },
  methods: {
    count() {
      return this.participantes.length > 0
        ? this.participantes.reduce((a, b) => a.value + b.value)
        : 0;
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

  &__otros {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 40%;
  }
}
</style>
