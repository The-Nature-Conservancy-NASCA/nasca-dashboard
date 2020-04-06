<template>
  <div class="participantes">
    <span v-if="hayDatos">
      <QuantityText
        class="participantes__quantity__text"
        :name="strings.campesinos"
        :value="countOtros(strings.campesinos)"
      />
      <PieChart
        :graphData="participantes"
        :graphId="'piechart__participantes__genero'"
        :colors="getColors()"
        :valueLabel="strings.individuos"
        :value="count()"
      />
      <QuantityText
        class="participantes__quantity__text"
        :name="strings.indigenas"
        :value="countOtros(strings.indigenas)"
      />
    </span>
    <div v-else class="no__data__warning">
      <p>{{ strings.noHayDatos }}</p>
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
    },
    strings() {
      return this.$store.getters.strings;
    },
    hayDatos() {
      return (
        this.count(this.strings.campesinos) +
          this.count(this.strings.indigenas) +
          this.count() !==
        0
      );
    }
  },
  methods: {
    count() {
      return this.participantes.length > 0
        ? this.participantes.reduce((a, b) => a + b.value, 0)
        : 0;
    },
    countOtros(group) {
      const value = this.groups[group];
      if (value === 0) {
        return "-";
      } else {
        return value;
      }
    },
    getColors() {
      return {
        [this.strings.hombres]: "#FFC107",
        [this.strings.mujeres]: "#1976D2",
        [this.strings.sinInformacion]: "#757575"
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.participantes,
.participantes > span {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;

  &__quantity__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
