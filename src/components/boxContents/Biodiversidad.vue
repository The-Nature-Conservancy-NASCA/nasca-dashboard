<template>
  <div class="biodiversidad">
    <div v-for="group in groups" :key="group">
      <PieChart
        :graphData="biodiversidad(group)"
        :icono="icono(group)"
        :group="group"
        :count="groupCount(group)"
        :graphId="`piechart__biodiversidad__${group}`"
        :valueLabel="'especies'"
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
    groups() {
      return this.$store.getters.gruposBiodiversidad;
    },
    selectedYear() {
      return this.$store.getters.filtro.year.biodiversidad;
    },
    years() {
      return this.$store.getters.yearsBiodiversidad;
    }
  },
  methods: {
    biodiversidad(group) {
      return this.$store.getters.biodiversidad(group);
    },
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
    groupCount(group) {
      return this.$store.getters.biodiversityGroupCount(group);
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
  margin-top: 3rem;

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
