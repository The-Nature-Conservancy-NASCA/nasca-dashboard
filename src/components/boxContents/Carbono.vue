<template>
  <div>
    <StackedArea :graphData="carbono" :graphId="'areachart__carbono'" />
    <div>
      <DownloadDataBtn :exportData="prepareData(carbono)" />
      <DownloadImageBtn :graphId="'areachart__carbono'" />
    </div>
  </div>
</template>
<script>
import DownloadDataBtn from "./DownloadDataBtn.vue";
import DownloadImageBtn from "./DownloadImageBtn.vue";
import StackedArea from "./StackedArea.vue";

export default {
  name: "Carbono",
  components: {
    DownloadDataBtn,
    DownloadImageBtn,
    StackedArea
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    }
  },
  methods: {
    prepareData(graphData) {
      const data = [];
      graphData.data.forEach(item => {
        const obj = {};
        delete Object.assign(obj, item, { ["año"]: item["year"] })["year"];
        data.push(obj);
      });
      const header = Object.keys(data[0]);
      return { data: data, header: header };
    }
  }
};
</script>
