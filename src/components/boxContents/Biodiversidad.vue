<template>
  <div class="biodiversidad">
    <div v-for="group in biodiversidad" :key="group.name">
      <PieChart
        :graphData="group.data"
        :icono="icono(group.name)"
        :group="group.name"
        :count="group.data.reduce((a, b) => +a + +b.value, 0)"
        :graphId="`piechart__biodiversidad__${group.name}`"
        :valueLabel="strings.especies"
      />
    </div>
  </div>
</template>
<script>
import PieChart from "./PieChart.vue";

export default {
  name: "Biodiversidad",
  components: {
    PieChart
  },
  computed: {
    biodiversidad() {
      return this.$store.getters.biodiversidad;
    },
    strings() {
      return this.$store.getters.strings;
    }
  },
  methods: {
    buttonClass(year) {
      return {
        selected: this.selectedYear === year,
        unselected: this.selectedYear !== year
      };
    },
    changeYear(year) {
      this.$store.dispatch("changeYear", {
        year: year,
        component: "biodiversidad"
      });
    },
    icono(group) {
      return this.$store.getters.biodiversityIcon(group);
    }
  },
  beforeMount() {
    this.years;
  }
};
</script>

<style lang="scss">
.biodiversidad {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;

  &__buttons {
    transform: translateY(-3.5rem);
  }

  &__year-buttons {
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
      background-color: #ddd;
      cursor: pointer;
      border: none;
      padding: 1rem;
      transition: all 0.2s;

      &.selected {
        background-color: var(--color-green-tnc);
        color: #fff;
      }

      &:hover {
        box-shadow: 0 5px 8px rgba(0, 0, 0, 0.4);
        transform: translateY(-2px);
      }
    }
  }
}
</style>
