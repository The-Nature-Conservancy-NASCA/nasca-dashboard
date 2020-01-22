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
      <DownloadImageBtn :graphId="`piechart__biodiversidad__${group}`" />
    </div>
  </div>
</template>
<script>
import DownloadImageBtn from "./DownloadImageBtn";
import PieChart from "./PieChart.vue";

export default {
  name: "Carbono",
  components: {
    DownloadImageBtn,
    PieChart
  },
  computed: {
    groups() {
      return this.$store.getters.gruposBiodiversidad;
    }
  },
  methods: {
    biodiversidad(group) {
      return this.$store.getters.biodiversidad(group);
    },
    groupCount(group) {
      return this.$store.getters.biodiversityGroupCount(group);
    },
    icono(group) {
      return this.$store.getters.biodiversityIcon(group);
    }
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
