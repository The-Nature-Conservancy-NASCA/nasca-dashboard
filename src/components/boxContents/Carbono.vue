<template>
  <div>
    <StackedArea :graphData="carbono" :graphId="'areachart__carbono'" />
    <DownloadImageBtn :graphId="'areachart__carbono'" />
  </div>
</template>
<script>
import DownloadImageBtn from "./DownloadImageBtn.vue";
import StackedArea from "./StackedArea.vue";

export default {
  name: "Carbono",
  components: {
    DownloadImageBtn,
    StackedArea
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    }
  }
};
</script>
