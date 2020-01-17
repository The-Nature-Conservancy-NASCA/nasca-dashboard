<template>
  <div>
    <StackedArea :graphData="carbono" />
  </div>
</template>
<script>
import StackedArea from "./StackedArea.vue";

export default {
  name: "Carbono",
  components: {
    StackedArea
  },
  computed: {
    carbono() {
      return this.$store.getters.carbono;
    }
  }
};
</script>
