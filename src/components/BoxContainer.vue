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
  grid-gap: 1.5rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 29vh;
  margin: 0 3rem 2rem 2rem;

  @media screen and (max-width: 900px) {
    display: flex;
    flex-direction: column;

    .box {
      height: 50vh;
      margin-bottom: 1rem;
    }
  }
}
</style>
