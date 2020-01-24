<template>
  <div>
    <Treemap :graphData="cobertura" :graphId="'treemap__carbono'" />
    <div>
      <DownloadDataBtn :exportData="prepareData(cobertura)" />
      <DownloadImageBtn :graphId="'treemap__carbono'" />
    </div>
  </div>
</template>
<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";
import Treemap from "./Treemap.vue";

export default {
  name: "Cobertura",
  components: {
    DownloadDataBtn,
    DownloadImageBtn,
    Treemap
  },
  computed: {
    cobertura() {
      return this.$store.getters.coberturas;
    }
  },
  methods: {
    prepareData(graphData) {
      // console.log(graphData);
      const data = [];
      graphData.children.forEach(parent => {
        parent.children.forEach(child => {
          const obj = {
            nivel_1: parent.name,
            nivel_2: child.name ? child.name.replace(/, |,/g, "|") : null,
            area: child.value
          };
          data.push(obj);
        });
      });
      const header = ["nivel_1", "nivel_2", "area"];
      return { data, header };
    }
  }
};
</script>
