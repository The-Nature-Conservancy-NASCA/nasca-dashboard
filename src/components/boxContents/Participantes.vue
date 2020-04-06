<template>
  <div class="participantes">
    <i class="box__icon esri-icon-description" @click="showModal()"></i>
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
        ? this.participantes.reduce((a, b) => a.value + b.value)
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
        [this.strings.hombres]: "#285572",
        [this.strings.mujeres]: "#EDB43A"
      };
    },
    showModal() {
      const modalContent = {
        header:  this.$parent.box.title,
        content: "Lorem ipsum Participantes"
      }
      this.$store.dispatch("showModal", modalContent);
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
