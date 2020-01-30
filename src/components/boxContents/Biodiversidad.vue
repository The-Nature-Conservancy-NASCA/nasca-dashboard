<template>
  <div class="biodiversidad">
    <div v-for="group in groups" :key="group">
      <PieChart
        :graphData="biodiversidad(group)"
        :icono="icono(group)"
        :group="group"
        :count="groupCount(group)"
        :graphId="`piechart__biodiversidad__${group}`"
      />
    </div>
    <div class="treemap__year-buttons" v-if="groups.length">
      <button v-for="year in years" :key="year" @click="changeYear(year)">
        {{ year }}
      </button>
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
    years() {
      return this.$store.getters.yearsBiodiversidad;
    }
  },
  methods: {
    biodiversidad(group) {
      return this.$store.getters.biodiversidad(group);
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
}
</style>
