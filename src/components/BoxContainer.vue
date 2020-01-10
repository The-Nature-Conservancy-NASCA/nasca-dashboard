<template>
  <main class="box-container">
    <Box v-for="(box, i) in boxes" :key="i" :box="box" />
  </main>
</template>
<script>
import Box from "./Box.vue";

export default {
  name: "BoxContainer",
  components: {
    Box
  },
  computed: {
    boxes() {
      return this.$store.state.boxes;
    }
  }
};
</script>
<style lang="scss" scoped>
.box-container {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  margin: 0 3rem 3rem 3rem;
}
</style>
