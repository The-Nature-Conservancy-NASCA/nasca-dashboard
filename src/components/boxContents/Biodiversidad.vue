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
      <div>
        <DownloadDataBtn :exportData="prepareData(biodiversidad(group))" />
        <DownloadImageBtn :graphId="`piechart__biodiversidad__${group}`" />
      </div>
    </div>
  </div>
</template>
<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";
import PieChart from "./PieChart.vue";

export default {
  name: "Carbono",
  components: {
    DownloadDataBtn,
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
    },
    prepareData(graphData) {
      const data = graphData.map(item => {
        return { cobertura: item.name, especies: item.value };
      });
      const header = ["cobertura", "especies"];
      return { data: data, header: header };
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
