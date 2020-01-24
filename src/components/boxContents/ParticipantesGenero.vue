<template>
  <div>
    <PieChart
      :graphData="participantes"
      :graphId="'piechart__participantes__genero'"
      :group="'Participantes'"
      :count="count()"
    />
    <div>
      <DownloadDataBtn :exportData="prepareData(participantes)" />
      <DownloadImageBtn :graphId="'piechart__participantes__genero'" />
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
    participantes() {
      return this.$store.getters.participantes;
    }
  },
  methods: {
    count() {
      return this.participantes.reduce((a, b) => a.value + b.value);
    },
    prepareData(graphData) {
      const data = graphData.map(item => {
        return { genero: item.name, total: item.value }
      });
      const header = Object.keys(data[0]);
      return { data: data, header: header };
    }
  }
};
</script>
